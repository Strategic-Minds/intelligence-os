# Drive → GitHub → Vercel → Supabase Automation Bridge

## Objective
Eliminate manual copy/paste from Google Drive into GitHub. Google Drive becomes the staging source. GitHub becomes the versioned implementation source. Vercel deploys from GitHub. Supabase stores logs, runs, blockers, approvals, and source receipts.

## Production Lock
Production lock remains ON. The bridge may create or update files only on a non-production branch unless release firewall passes.

## Immediate Trigger Model

### Trigger 1 — Google Drive folder scan
Apps Script scans the Intelligence OS Drive folder and looks for staged files marked for sync.

### Trigger 2 — Manifest-controlled sync
Only files listed in `sync_manifest.json` or rows in the command sheet tab `GITHUB_SYNC_QUEUE` are eligible.

### Trigger 3 — GitHub branch write
The bridge writes files to branch:

`autobuild/intelligence-os-doc-system`

### Trigger 4 — GitHub Actions validation
After files are committed, GitHub Actions runs package validation, QA firewall, and release firewall checks.

### Trigger 5 — Vercel preview
Vercel creates preview from the branch after GitHub receives valid code. Production remains blocked.

## Required Script Properties
Never paste secrets into cells or chat.

Set these in Apps Script Project Settings → Script properties:

- `GITHUB_TOKEN`
- `GITHUB_REPO` = `Strategic-Minds/intelligence-os`
- `GITHUB_BRANCH` = `autobuild/intelligence-os-doc-system`
- `DRIVE_ROOT_FOLDER_ID` = `1g2Le0btZyuuFI7eJJu5Wvil_aLerPhgI`
- `MASTER_COMMAND_SHEET_ID` = `1udKCoTJ_OuOk_ef85Mhj6UsBRRtwT_N-r1YJHsEZkic`
- `AUTO_BUILD_COMMAND_SHEET_ID` = `13SbSHcZQeC_4m68pb4ZAYe5I9adpBmL1KcdAUGyWmOE`
- `PRODUCTION_LOCK` = `ON`

## Required Workbook Tabs

- `GITHUB_SYNC_QUEUE`
- `SYNC_LOG`
- `BLOCKER_LOG`
- `QA_FIREWALL`
- `RELEASE_FIREWALL`
- `SOURCE_LEDGER`

## Safe Sync Statuses

- `READY_TO_SYNC`
- `SYNCED`
- `BLOCKED`
- `FAILED`
- `NEEDS_APPROVAL`

## Blocked Actions

- direct push to main
- production deploy
- Shopify publish
- email send
- social post
- destructive Supabase writes
- service role key exposure

## Immediate Setup

1. Open Intelligence OS Master Command sheet.
2. Extensions → Apps Script.
3. Paste `apps-script/DriveToGitHubBridge.gs`.
4. Add Script Properties listed above.
5. Run `installDriveToGitHubTriggers()` once.
6. Put staged file rows in `GITHUB_SYNC_QUEUE`.
7. Run `syncQueuedDriveFilesToGitHub()`.

After install, any eligible queue row can be synced without manual file transfer.
