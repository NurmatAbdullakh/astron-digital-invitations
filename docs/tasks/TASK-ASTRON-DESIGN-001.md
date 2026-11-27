---
id: TASK-ASTRON-DESIGN-001
title: Production-minded mobile-first invitation studio
feature: invitation-studio
status: IN_REVIEW
priority: HIGH
assignee: FRONTEND_ENGINEER
sprint: SPRINT-ASTRON-MVP-002
estimate: 3
start_date: 2026-11-27
due_date:
depends_on: []
labels: [frontend, ux, mobile-first, invitations]
---

## Objective
Replace the basic invitation form with a compact, mobile-first invitation studio. Users must be able to browse/select a template, edit event details, see an accurate live preview, save a local draft, and create a shareable invitation link.

## Acceptance criteria
- [ ] Template gallery shows distinct visual previews and selection state.
- [ ] Builder is mobile-first, compact, and responsive; mobile users can switch between editing and preview without losing form state.
- [ ] Desktop layout presents editor and live preview together.
- [ ] Preview updates immediately for every editable field and selected template.
- [ ] Draft can be explicitly saved and restored from the same browser/device.
- [ ] Share action validates required fields, creates a public invitation URL, and offers a copy fallback when Web Share is unavailable.
- [ ] Public invitation route renders the selected template variant and safely rejects malformed payloads.
- [ ] Uzbek, Russian, and English UI labels remain available.
- [ ] Keyboard focus, labels, status feedback, reduced motion, and narrow viewport behavior are covered.
- [ ] Typecheck, lint, and production build are run and their outcomes recorded.

## Implementation notes
- Follow the role profiles and relevant frontend skills in ai-engineering-project-template:
  - Product Owner
  - UI/UX Designer
  - Software Architect
  - Frontend Engineer
  - QA Engineer
- Keep the current Next.js App Router, React, TypeScript, and CSS stack; do not add dependencies.
- Use a typed, code-defined template catalog as the source of truth.
- Draft persistence is local to the browser for this MVP. It is not cross-device/cloud storage; server persistence requires a backend/database and is out of scope.
- Share URLs currently encode invitation data in the query string; keep payload limits and document the limitation.

## Handoff
- Owner: Frontend Engineer
- Evidence: Implemented on `feat/mobile-first-invitation-studio`; draft PR #1 opened.
- Changed: typed template catalog, mobile-first builder, visual template gallery, local draft save/restore, mobile Edit/Preview switch, public template rendering, responsive styling.
- Skills consulted: `frontend/react-nextjs-development`, `frontend/ui-ux-accessibility`.
- Validation: First CI run passed TypeScript but exposed a React hooks lint issue; fixed by deferring local-draft restoration. A new CI run is currently in progress. Local scripts were not run in this environment.
- Blockers/risks: Drafts are browser-local only; shared invitation data remains encoded in URL query parameters. This is not cross-device/server persistence.
- Next step: Wait for CI, run responsive browser QA at mobile/tablet/desktop widths, then request review.
