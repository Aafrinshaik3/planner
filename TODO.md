# Celebrate delivery checklist

## Event workspace supports planning weddings, birthdays, and community events
- [x] Users can create and edit an event plan with event type, date, location, guest count, budget, theme, and preferences.
- [x] The workspace is responsive and usable on desktop and mobile planning workflows.

## Dashboard summarizes planning progress and next actions
- [x] Dashboard summarizes planning progress, upcoming milestones, budget status, and outstanding vendor tasks.
- [x] Users can move between overview, budget, timeline, vendors, ideas, and settings without losing the active plan.

## Budget manager keeps spending decisions clear
- [x] Budget categories show estimated and actual costs, payment status, category totals, and remaining-budget calculations.
- [x] Users can add a budget category and see totals update immediately.

## Timeline and vendor checklist make execution actionable
- [x] Timeline shows dated tasks in chronological order with deadline, owner/area, and completion states.
- [x] Vendor checklist is organized by relevant categories with status tracking, notes, and due dates.
- [x] Users can complete or reopen timeline and vendor tasks.

## Personalized idea generator turns event details into suggestions
- [x] Ideas are tailored to event details, budget, theme, audience, and preferences.
- [x] Users can generate, review, and save selected suggestions into the event plan.
- [x] The server uses the managed LLM when available and retains a useful fallback when unavailable.

## AI vendor recommendation feature
- [x] Users can enter a budget and location from the Vendors workspace and request a tailored vendor shortlist.
- [x] Recommendations use event type, guest count, budget, location, and preferences as context.
- [x] Each recommendation includes a category, fit, description, directional budget, reason, next step, and shortlist control.
- [x] The server uses the managed LLM when available and falls back to useful location- and budget-aware directions when unavailable.
- [x] The UI labels recommendations as directional and asks users to confirm pricing and availability directly.

## Login and settings are working options
- [x] `/login` provides a working Manus OAuth sign-in action, signed-in state, sign-out action, and return to the workspace.
- [x] Settings can toggle gentle reminders and compact planning view, export the event plan as JSON, reset the demo workspace, and open login.
- [x] The sidebar and route manifest expose Overview, Budget, Timeline, Vendors, Ideas lab, Settings, and Login.

## Requested handoff deliverables
- [x] Functional web app is published at a public URL.
- [x] GitHub repository is connected and remains under 10 MB excluding dependencies.
- [ ] Walkthrough demo video is provided and stays under 4 minutes, showing key workflows.

## Event-aware workspace, provider login, and payments
- [x] Workspace name and initials derive from the current event title and event type instead of remaining fixed to the starter wedding.
- [x] Login offers Manus, Google, GitHub, and other provider choices through the secure Manus sign-in portal.
- [x] Payments has a dedicated workspace with paid, due, and processing summaries; tracked payment rows; status transitions; methods; and a clear distinction between the local event ledger and future live checkout provider setup.
