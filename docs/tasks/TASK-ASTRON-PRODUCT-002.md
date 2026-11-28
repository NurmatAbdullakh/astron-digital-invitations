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
- Next: implement catalogue and template preview, then wizard; QA and Security review follow.
