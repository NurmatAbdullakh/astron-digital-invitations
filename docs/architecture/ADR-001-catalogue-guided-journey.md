# ADR-001 — Shared template renderer and guided invitation journey

- **Status:** Proposed for this implementation
- **Date:** 2026-11-28
- **Decision owner:** Product Owner

## Context
The product must behave like a template marketplace followed by a guided wizard. The same invitation design must look consistent in the catalogue, dedicated preview, editor preview, and public invitation page.

## Decision
1. Keep Next.js App Router, React 19, TypeScript, and CSS.
2. Keep template definitions in the existing typed `src/lib/invitations/templates.ts`.
3. Reuse `InvitationArtwork` as the single renderer for all invitation previews.
4. Separate template metadata from user-entered invitation data.
5. Use a dedicated route for each template preview.
6. Model the builder as explicit steps with only the current step's controls visible.
7. Preserve the existing query-string share contract for this frontend MVP, with a strict size limit and defensive parsing.
8. Keep drafts in browser localStorage for now; do not claim cross-device persistence.

## Consequences
- The UI can be rebuilt without rewriting the underlying template artwork.
- Future server persistence can replace query-string payloads and localStorage without changing template rendering.
- Share URLs are not suitable as a durable publication architecture; opaque IDs and backend persistence remain future work.
- This ADR does not approve payments, user accounts, RSVP backend, or production deployment.
