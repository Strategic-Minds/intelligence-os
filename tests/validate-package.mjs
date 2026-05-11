import fs from 'node:fs';

const required = [
  'package.json',
  'app/page.tsx',
  'components/IntelligenceDashboard.tsx',
  'apps-script/DriveToGitHubBridge.gs',
  'docs/DRIVE_TO_GITHUB_AUTOMATION_BRIDGE.md',
  'docs/ENTERPRISE_CHECKLIST.md',
  'docs/UI_UX_APPROVED_DIRECTION.md',
  'public/approved-ui/intelligence-os-approved-dashboard.svg'
];

const missing = required.filter((file) => !fs.existsSync(file));
const component = fs.existsSync('components/IntelligenceDashboard.tsx') ? fs.readFileSync('components/IntelligenceDashboard.tsx', 'utf8') : '';
const bridge = fs.existsSync('apps-script/DriveToGitHubBridge.gs') ? fs.readFileSync('apps-script/DriveToGitHubBridge.gs', 'utf8') : '';

const checks = {
  missing,
  hasBlackBackground: component.includes('bg-black'),
  hasSilverBorders: component.includes('border-slate-300/30'),
  hasElectricBlueHover: component.includes('hover:border-blue-500'),
  hasProductionLock: bridge.includes('PRODUCTION_LOCK'),
  blocksMainBranch: bridge.includes("branch === 'main'"),
  hasSyncQueue: bridge.includes('GITHUB_SYNC_QUEUE'),
};

console.log(JSON.stringify(checks, null, 2));

if (
  missing.length ||
  !checks.hasBlackBackground ||
  !checks.hasSilverBorders ||
  !checks.hasElectricBlueHover ||
  !checks.hasProductionLock ||
  !checks.blocksMainBranch ||
  !checks.hasSyncQueue
) {
  process.exit(1);
}
