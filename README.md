# SIRRS

Secure Incident Reporting and Response System — a frontend-only React application for reporting, triaging, and investigating security incidents.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Production assets can be built with `npm run build`.

## Demo accounts

The first time the site opens in a browser, it creates local sample accounts and incidents. Existing saved demo workspaces are also updated with the additional sample accounts and reports. Use these accounts to preview each role:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@sirrs.demo` | `SIRRSAdmin!2026` |
| Reporter | `riley@sirrs.demo` | `Reporter!2026` |
| Reporter | `jordan.reporter@sirrs.demo` | `JordanReport!2026` |
| Reporter | `taylor.reporter@sirrs.demo` | `TaylorReport!2026` |
| Analyst | `alex@sirrs.demo` | `Analyst!2026` |
| Analyst | `casey.analyst@sirrs.demo` | `CaseyAnalyze!2026` |
| Analyst | `avery.analyst@sirrs.demo` | `AveryAnalyze!2026` |

New accounts register as reporters. Admins can grant analyst access from User Management. Use Sign out to switch accounts.

## Workflows

- **Reporter:** Submit a report with category, event date/time, description, and optional PDF/PNG/JPG evidence. Track status and public progress updates on personal reports. Mark a report solved to remove it; the action remains in the activity log.
- **Admin:** Review all reports, set severity, assign or unassign analysts, resolve/close/mark duplicates, manage account roles, and view severity/category summaries.
- **Analyst:** Work assigned cases, update status, post reporter-visible progress, and record internal investigation notes. Internal notes are only rendered for analysts and admins.
- **Audit history:** Important report, assignment, status, severity, note, and role actions are recorded with the actor and time. Admins can filter actions; activity visibility is limited by role and case ownership/assignment.

## Frontend-only storage and security limits

This project intentionally has no backend. Accounts, password verifiers, reports, and activity logs are stored in the current browser's local storage; evidence file contents are stored in that browser's IndexedDB. Data does not sync to other browsers or devices. Clearing site data removes it.

Email addresses are not verified, and roles or records can be altered by anyone with browser developer tools. The built-in demo admin credentials are public. Client-side checks are for workflow demonstration only and do not provide access control for real incident data. Do not use this build for sensitive reports or production accounts.

