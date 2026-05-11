# Intelligence OS Mobile Bridge

This directory contains the persistent mobile bridge scaffold for Intelligence OS. It serves as the continuous command point for the Admin Command GPT system, Auto Build runtime/data triggers, and workflow orchestration across all repos and Drive assets.

## Purpose
- Establish mobile bridge as continuous command point.
- Integrate Admin Command as GPT command system.
- Use Auto Build for runtime, data, and trigger automation.
- Sync all GitHub repos and Drive assets.
- Treat Shopify Workflow as canonical workflow.
- Treat Bronx and Epoxy Changes Lives as projects.
- Use Vercel for frontend and Supabase/Neon for backend/data.
- No authentication required for this phase.
- Use fallbacks for missing API keys and mark as PENDING_SECRET.
- Log every action into GitHub and validate architecture before triggering builds.