---
id: TASK-ASTRON-PRODUCT-002
title: Catalogue-first guided invitation experience
feature: digital-invitations-product-journey
status: IN_PROGRESS
priority: CRITICAL
assignee: FRONTEND_ENGINEER
sprint: SPRINT-ASTRON-MVP-003
estimate: 8
depends_on: [TASK-ASTRON-DESIGN-001]
labels: [product, ux, frontend, accessibility, qa]
---

## Objective
Implement the approved catalogue-first product journey defined in `docs/product/PRD.md`: template catalogue, dedicated template preview, focused step-by-step wizard, final review, and safe share flow.

## Product requirements
- Catalogue is the primary entry point.
- Users can preview before selecting; no registration is required.
- Selection preserves locale, event type, and template ID.
- Wizard asks one question or one related group at a time.
- Desktop must not turn the wizard into a long/multi-field form.
- Draft is local-browser-only and clearly labelled as such.
- Same typed template and artwork renderer power catalogue, preview, editor preview, and public invite.
- Uzbek, Russian, and English remain supported.
- Payments, backend persistence, accounts, RSVP backend, and permanent publishing remain out of scope.

## Acceptance criteria
- [ ] Locale entry redirects to or renders the catalogue.
- [ ] Category filters work.
- [ ] Each template has a dedicated preview route.
- [ ] Use-template action enters the wizard with selected context.
- [ ] Wizard has focused steps for hosts, title, date, time, venue/address, optional message, and final review.
- [ ] Back/continue and validation work without losing data.
- [ ] Local draft is scoped, restorable, and defensively parsed.
- [ ] Live preview uses shared InvitationArtwork and reflects edits.
- [ ] Share link is size-limited and has clipboard fallback.
- [ ] Public invite rejects malformed data safely.
- [ ] Responsive and accessibility checks are completed.
- [ ] Typecheck, lint, and build pass, or exact blockers are recorded.

## Dependencies and decisions
- Builds on `feat/premium-real-invitation-artwork` to preserve the original Botanical, Editorial, and Minimal artwork.
- No new runtime dependencies.
- Existing share query contract is preserved for compatibility.
- PR remains unmerged pending Product Owner approval.

## Handoff
- Current owner: Frontend Engineer / Team Lead
- Implemented: catalogue-first localized entry, template preview route, seven-step guided builder, shared live artwork preview, defensive local draft restore, URL size guard, public payload validation, and localized sitemap entries.
- Documentation: `docs/product/PRD.md`, `docs/architecture/ADR-001-catalogue-guided-journey.md`, `docs/qa/TASK-ASTRON-PRODUCT-002-TEST-PLAN.md`, and `docs/security/TASK-ASTRON-PRODUCT-002-SECURITY-REVIEW.md`.
- Validation: Static diff review completed. An initial GitHub Actions run failed TypeScript due to an optional category value; fixed in commit `61c8f9f9530f0b7ae80e09f768576ac75996fdfa`. A follow-up run for the latest head has not yet been observed. Lint/build and browser QA remain pending. Shell cloning was unavailable because GitHub DNS could not be resolved in this environment.
- Risks: Share payload is visible in URL and is not durable hosting; drafts are browser-local only. See security review.
- Next: QA Engineer to run automated and responsive acceptance checks; Security Reviewer to validate negative payload cases; Team Lead to review integration. Product Owner acceptance and merge remain pending.
