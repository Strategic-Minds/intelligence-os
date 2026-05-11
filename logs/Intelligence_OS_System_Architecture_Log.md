# Intelligence OS Architecture and System Log

## 1. Core Purpose
- Autonomous build and workflow execution.
- Continuous trigger system for all projects.
- Recursive self-validation and iteration.
- Centralized monitoring and logging.

## 2. System Components
- **Admin Command (GPT Bridge):** Decision engine using MASTER_OPERATOR_PROMPT.md for step triggers.
- **Workflow Engine:** Shopify workflow templates drive canonical workflow; step-level execution mapped to projects.
- **Auto Build System:** Executes runtime, data, and deployment triggers; loops recursively.
- **Repo Sync Layer:** Syncs all GitHub repos (Bronx, Epoxy, Shopify templates, Admin Command, Intelligence OS).
- **Drive Sync Layer:** Local storage / Drive-equivalent assets for templates, logs, instructions.
- **Frontend Layer:** Vercel deployment for dashboards and workflow display.
- **Backend Layer:** Supabase / Neon for data persistence and logging.
- **Trigger System:** Executes Auto Build scripts and recursive step execution.
- **Logging & Validation:** Logs system state, PRs, issues, workflow steps; triple validation.
- **Notification Layer:** Hourly email updates.

## 3. Projects / Workflows
- **Bronx:** Social system project; step-level triggers, PR/issue updates.
- **Epoxy Changes Lives:** Product/education system; step-level triggers, PR/issue updates.
- **Shopify Stores:** Store workflow; auto-deploy updates.
- **Intelligence OS:** Central hub for all automation.

## 4. Auto Build / Trigger Logic
- Sync Repos, Read Drive Assets, Validate Architecture (Triple Check)
- Initialize Auto Build, Recursive Reflection, Log & Monitor, Notifications
- Loop until full workflow completion (100%)

## 5. Logging Plan
- Drive Logs: Snapshots of templates, workflow instructions.
- Git Logs: Commits, PR updates, issue tracking, project boards.
- Auto Build Logs: Step execution outcomes, validation results.
- Combined System Log: Master log for mobile bridge and monitoring dashboard.

---
