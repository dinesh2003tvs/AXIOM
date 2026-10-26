# AXIOM — Functional Clickable Prototype

## End-to-end prototype flow
Home → Project Intake → AI Review → PMO / Governance → Project Workspace → Requirements & Artifacts → Open → Meetings → Status → Control & Governance → Virtual PM → Analytics → Closure → Knowledge Repository.

## Included interactions
- Sidebar navigation across all major modules.
- Five-step Project Intake workflow.
- Editable intake fields and draft-save feedback.
- AI intake summary / missing-information review surfaces.
- Portfolio RAG filters and project drill-down.
- Project Workspace with module tabs and clickable capability cards.
- Project health, timeline, artifact and action views.
- Knowledge Repository search and category navigation.
- Admin & Masters navigation and resource table.
- Role selector for CXO / Leadership, PMO and PM.
- New Project modal and contextual action feedback.
- Responsive enterprise UI.

## Prototype boundary
This is a frontend-only prototype with local browser persistence. Project records, intake drafts, knowledge entries and preferences are saved in localStorage; uploaded file contents use IndexedDB. AI outputs, authentication, external systems, calendars, transcription and autonomous Virtual PM actions remain simulations rather than live enterprise integrations. Local role selection is not authentication or authorization, and browser data is not synced to a server.



## Project Status Lifecycle

The primary project status follows four lifecycle stages:
1. **Open** — the project request has just been received.
2. **Ready for review** — first-level requirement gathering is complete and the project is ready for PMO review.
3. **In Progress** — a PM has been assigned and execution has started.
4. **Closed** — closure activities are complete and the project is formally closed.

RAG is separate from the lifecycle status and is represented by a coloured circle only.
