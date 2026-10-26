# AXIOM — Dynamic Frontend Prototype

AXIOM is a React/Vite frontend prototype for project intake, portfolio governance, project delivery workspaces, enterprise knowledge, and administration. The app runs without a backend or database.

## Run locally

1. Open the folder containing `package.json`.
2. Install packages: `npm.cmd install`
3. Start the development server: `npm.cmd run dev`
4. Open the localhost URL printed by Vite.

Build and test:

```powershell
npm.cmd test
npm.cmd run build
```

Vercel builds use the site root (`/`) automatically. GitHub Pages builds set `GITHUB_PAGES=true` in the deployment workflow so generated assets use the `/AXIOM/` project-site path.

## Local data and files

- Projects, intake drafts, role selection, UI preferences, knowledge entries, resource masters, and governance settings are saved in browser `localStorage`.
- Uploaded file contents are stored in browser `IndexedDB`; local storage contains only file metadata and links.
- Data is scoped to the current browser and device. It does not sync between users, browsers, or devices.
- Use **Admin & Masters → Restore demo data** as PMO to discard local edits and restore the sample dataset. This action requires confirmation.
- If stored data is unreadable or unsupported, AXIOM shows a warning and does not overwrite it until demo data is explicitly restored.

## Prototype boundaries

The CXO / Leadership, PMO, and PM selector changes the local UI view only; it is not authentication or an authorization boundary. AI recommendations, Virtual PM, notifications, meeting scheduling, validation, and enterprise integrations are clearly identified local simulations. No AI service, identity provider, calendar, external system, or API is contacted.

Uploaded documents remain in browser storage. Clearing site data or using another browser removes access to those files and records.
