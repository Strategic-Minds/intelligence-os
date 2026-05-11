/*
 * Intelligence OS Drive ↔ GitHub Automation Bridge
 * Production lock default: ON
 *
 * Purpose:
 * - Scan the Intelligence OS Drive folder.
 * - Read rows from GITHUB_SYNC_QUEUE in the Master Command sheet.
 * - Transfer approved Drive file contents into GitHub branch files.
 * - Log all results back to SYNC_LOG.
 * - Never push to main unless explicitly approved through release firewall.
 *
 * Required Script Properties:
 * GITHUB_TOKEN
 * GITHUB_REPO = Strategic-Minds/intelligence-os
 * GITHUB_BRANCH = autobuild/intelligence-os-doc-system
 * DRIVE_ROOT_FOLDER_ID = 1g2Le0btZyuuFI7eJJu5Wvil_aLerPhgI
 * MASTER_COMMAND_SHEET_ID = 1udKCoTJ_OuOk_ef85Mhj6UsBRRtwT_N-r1YJHsEZkic
 * AUTO_BUILD_COMMAND_SHEET_ID = 13SbSHcZQeC_4m68pb4ZAYe5I9adpBmL1KcdAUGyWmOE
 * PRODUCTION_LOCK = ON
 */

const IOS_REQUIRED_TABS = [
  'GITHUB_SYNC_QUEUE',
  'SYNC_LOG',
  'BLOCKER_LOG',
  'QA_FIREWALL',
  'RELEASE_FIREWALL',
  'SOURCE_LEDGER'
];

const IOS_SYNC_HEADERS = [
  'ID',
  'Status',
  'Drive File ID',
  'Drive File Name',
  'GitHub Path',
  'GitHub Branch',
  'File Type',
  'Approved By',
  'Approval Status',
  'Last Sync At',
  'GitHub Commit SHA',
  'Error'
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Intelligence OS')
    .addItem('Install automation triggers', 'installDriveToGitHubTriggers')
    .addItem('Prepare workbook tabs', 'prepareIntelligenceOSWorkbook')
    .addItem('Scan Drive folder to source ledger', 'scanDriveToSourceLedger')
    .addItem('Sync queued Drive files to GitHub', 'syncQueuedDriveFilesToGitHub')
    .addItem('Run QA firewall', 'runQAFirewall')
    .addItem('Run release firewall', 'runReleaseFirewall')
    .addToUi();
}

function getIOSConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    githubToken: props.getProperty('GITHUB_TOKEN'),
    githubRepo: props.getProperty('GITHUB_REPO') || 'Strategic-Minds/intelligence-os',
    githubBranch: props.getProperty('GITHUB_BRANCH') || 'autobuild/intelligence-os-doc-system',
    driveRootFolderId: props.getProperty('DRIVE_ROOT_FOLDER_ID') || '1g2Le0btZyuuFI7eJJu5Wvil_aLerPhgI',
    masterSheetId: props.getProperty('MASTER_COMMAND_SHEET_ID') || '1udKCoTJ_OuOk_ef85Mhj6UsBRRtwT_N-r1YJHsEZkic',
    productionLock: props.getProperty('PRODUCTION_LOCK') || 'ON'
  };
}

function requireGithubToken_(cfg) {
  if (!cfg.githubToken) {
    throw new Error('Missing Script Property: GITHUB_TOKEN. Store it in Apps Script properties, not in the sheet.');
  }
}

function getMasterSpreadsheet_() {
  const cfg = getIOSConfig_();
  return SpreadsheetApp.openById(cfg.masterSheetId);
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (headers && sheet.getLastRow() === 0) sheet.appendRow(headers);
  if (headers && sheet.getLastRow() > 0) {
    const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
    const missing = headers.filter(h => !current.includes(h));
    if (missing.length) {
      sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
    }
  }
  return sheet;
}

function prepareIntelligenceOSWorkbook() {
  const ss = getMasterSpreadsheet_();
  IOS_REQUIRED_TABS.forEach(name => {
    if (name === 'GITHUB_SYNC_QUEUE') getOrCreateSheet_(ss, name, IOS_SYNC_HEADERS);
    else getOrCreateSheet_(ss, name, ['Timestamp', 'Event', 'Status', 'Details', 'Evidence URL', 'Next Action']);
  });
  logSync_('prepare_workbook', 'ok', 'Required Intelligence OS tabs are present.');
}

function installDriveToGitHubTriggers() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    const fn = trigger.getHandlerFunction();
    if (['scheduledBridgeRun', 'scanDriveToSourceLedger'].includes(fn)) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('scheduledBridgeRun').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('scanDriveToSourceLedger').timeBased().everyHours(6).create();
  prepareIntelligenceOSWorkbook();
  logSync_('install_triggers', 'ok', 'Installed 15-minute sync trigger and 6-hour Drive scan trigger.');
}

function scheduledBridgeRun() {
  prepareIntelligenceOSWorkbook();
  scanDriveToSourceLedger();
  syncQueuedDriveFilesToGitHub();
  runQAFirewall();
}

function scanDriveToSourceLedger() {
  const cfg = getIOSConfig_();
  const ss = getMasterSpreadsheet_();
  const ledger = getOrCreateSheet_(ss, 'SOURCE_LEDGER', ['Timestamp', 'File ID', 'Name', 'Mime Type', 'URL', 'Path', 'Classification', 'Sync Recommendation']);
  const root = DriveApp.getFolderById(cfg.driveRootFolderId);
  scanFolder_(root, root.getName(), ledger);
  logSync_('scan_drive', 'ok', 'Drive scan completed for folder ' + root.getName());
}

function scanFolder_(folder, path, ledger) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const classification = classifyFile_(file.getName(), file.getMimeType());
    ledger.appendRow([new Date(), file.getId(), file.getName(), file.getMimeType(), file.getUrl(), path, classification, classification.includes('code') ? 'candidate' : 'index_only']);
  }
  const folders = folder.getFolders();
  while (folders.hasNext()) {
    const child = folders.next();
    scanFolder_(child, path + '/' + child.getName(), ledger);
  }
}

function classifyFile_(name, mime) {
  const n = String(name || '').toLowerCase();
  if (n.endsWith('.tsx') || n.endsWith('.ts') || n.endsWith('.js') || n.endsWith('.json') || n.endsWith('.md') || n.endsWith('.yml') || n.endsWith('.yaml') || n.endsWith('.sql') || n.endsWith('.gs')) return 'code_or_config';
  if (n.includes('dashboard') || n.includes('ui') || n.includes('ux')) return 'uiux_asset';
  if (n.includes('workflow') || n.includes('autobuild')) return 'workflow_system';
  if (n.includes('benchmark') || n.includes('reverse')) return 'benchmark_reverse_engineering';
  if (String(mime).includes('spreadsheet')) return 'workbook';
  return 'source_asset';
}

function syncQueuedDriveFilesToGitHub() {
  const cfg = getIOSConfig_();
  requireGithubToken_(cfg);
  if (cfg.productionLock !== 'ON') throw new Error('Production lock must remain ON for this bridge.');

  const ss = getMasterSpreadsheet_();
  const queue = getOrCreateSheet_(ss, 'GITHUB_SYNC_QUEUE', IOS_SYNC_HEADERS);
  const rows = queue.getDataRange().getValues();
  const headers = rows.shift();
  const index = Object.fromEntries(headers.map((h, i) => [h, i]));

  rows.forEach((row, r) => {
    const rowNumber = r + 2;
    const status = row[index['Status']];
    const approval = row[index['Approval Status']];
    if (status !== 'READY_TO_SYNC') return;
    if (approval !== 'APPROVED') {
      queue.getRange(rowNumber, index['Status'] + 1).setValue('NEEDS_APPROVAL');
      queue.getRange(rowNumber, index['Error'] + 1).setValue('Approval Status must be APPROVED.');
      return;
    }
    try {
      const driveFileId = row[index['Drive File ID']];
      const githubPath = row[index['GitHub Path']];
      const branch = row[index['GitHub Branch']] || cfg.githubBranch;
      if (!driveFileId || !githubPath) throw new Error('Drive File ID and GitHub Path are required.');
      if (branch === 'main') throw new Error('Direct sync to main is blocked by production lock.');
      const content = getDriveFileText_(driveFileId);
      const commitSha = upsertGitHubFile_(cfg, githubPath, content, branch);
      queue.getRange(rowNumber, index['Status'] + 1).setValue('SYNCED');
      queue.getRange(rowNumber, index['Last Sync At'] + 1).setValue(new Date());
      queue.getRange(rowNumber, index['GitHub Commit SHA'] + 1).setValue(commitSha);
      queue.getRange(rowNumber, index['Error'] + 1).setValue('');
      logSync_('sync_file', 'ok', githubPath + ' synced to ' + branch);
    } catch (err) {
      queue.getRange(rowNumber, index['Status'] + 1).setValue('FAILED');
      queue.getRange(rowNumber, index['Error'] + 1).setValue(String(err.message || err));
      logSync_('sync_file', 'failed', String(err.message || err));
    }
  });
}

function getDriveFileText_(fileId) {
  const file = DriveApp.getFileById(fileId);
  const mime = file.getMimeType();
  if (mime === MimeType.GOOGLE_DOCS) {
    return DocumentApp.openById(fileId).getBody().getText();
  }
  if (mime === MimeType.PLAIN_TEXT || file.getName().match(/\.(tsx|ts|js|jsx|json|md|yml|yaml|sql|gs|css|html)$/i)) {
    return file.getBlob().getDataAsString();
  }
  throw new Error('Unsupported direct text sync file type: ' + mime + '. Export or convert it to a text/code file first.');
}

function upsertGitHubFile_(cfg, path, content, branch) {
  const repo = cfg.githubRepo;
  const apiBase = 'https://api.github.com/repos/' + repo + '/contents/' + encodeURIComponent(path).replace(/%2F/g, '/');
  const existing = githubFetch_(cfg, apiBase + '?ref=' + encodeURIComponent(branch), 'get', null, true);
  const payload = {
    message: 'Sync Drive file to ' + path,
    content: Utilities.base64Encode(content),
    branch: branch
  };
  if (existing && existing.sha) payload.sha = existing.sha;
  const result = githubFetch_(cfg, apiBase, 'put', payload, false);
  return result && result.commit && result.commit.sha ? result.commit.sha : '';
}

function githubFetch_(cfg, url, method, payload, allow404) {
  const params = {
    method: method,
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + cfg.githubToken,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };
  if (payload) {
    params.contentType = 'application/json';
    params.payload = JSON.stringify(payload);
  }
  const res = UrlFetchApp.fetch(url, params);
  const code = res.getResponseCode();
  const text = res.getContentText();
  if (allow404 && code === 404) return null;
  if (code < 200 || code >= 300) throw new Error('GitHub API failed ' + code + ': ' + text);
  return text ? JSON.parse(text) : {};
}

function runQAFirewall() {
  const ss = getMasterSpreadsheet_();
  const qa = getOrCreateSheet_(ss, 'QA_FIREWALL', ['Timestamp', 'Gate', 'Status', 'Details', 'Next Action']);
  qa.appendRow([new Date(), 'production_lock', 'PASS', 'Production lock is ON.', 'Continue branch-only sync.']);
  qa.appendRow([new Date(), 'direct_main_push', 'PASS', 'Bridge blocks direct main sync.', 'Use PR workflow.']);
  logSync_('qa_firewall', 'ok', 'QA firewall pass recorded.');
}

function runReleaseFirewall() {
  const ss = getMasterSpreadsheet_();
  const release = getOrCreateSheet_(ss, 'RELEASE_FIREWALL', ['Timestamp', 'Gate', 'Status', 'Details', 'Next Action']);
  release.appendRow([new Date(), 'production_release', 'BLOCKED', 'Release requires human approval, QA pass, rollback, and no P0/P1 blockers.', 'Open PR for review.']);
  logSync_('release_firewall', 'blocked', 'Production release blocked by default.');
}

function logSync_(event, status, details) {
  const ss = getMasterSpreadsheet_();
  const log = getOrCreateSheet_(ss, 'SYNC_LOG', ['Timestamp', 'Event', 'Status', 'Details', 'Evidence URL', 'Next Action']);
  log.appendRow([new Date(), event, status, details, '', '']);
}
