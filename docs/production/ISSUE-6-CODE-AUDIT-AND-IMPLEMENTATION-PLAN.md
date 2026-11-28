# Issue #6 — Production MVP Code Audit & Implementation Plan

**Issue:** [#6 — Complete Digital Invitations MVP for paid production launch](https://github.com/NurmatAbdullakh/astron-digital-invitations/issues/6)  
**Audit date:** 2026-11-28  
**Audited ref:** `main` at `35628fe5a9af1f80d98cac95c24924acfe7d57ff`  
**Status:** Static repository audit complete; runtime/browser verification and Product Owner architecture approval pending.

## 1. Executive summary

The current `main` branch contains a polished frontend MVP: localized catalogue, three invitation templates, dedicated previews, a seven-step wizard, shared artwork rendering, local browser drafts, and URL-based invitation previews.

It is **not yet a paid production service**. The repository has no database/ORM, server-side invitation or order persistence, payment integration, permanent public slug, customer access mechanism, QR generation, admin interface, or backend audit/event records. The README accurately discloses most of these limitations.

The correct next move is to preserve the working frontend and add a persistent commerce/publishing layer incrementally. Do not rewrite the catalogue, artwork, or wizard as part of the backend foundation.

## 2. Repository and baseline

### Confirmed repository facts

- Default branch: `main`.
- Audited main commit: `35628fe5a9af1f80d98cac95c24924acfe7d57ff`.
- Stack: Next.js 16 App Router, React 19, TypeScript 5.9, CSS.
- Runtime dependencies are currently only `next`, `react`, and `react-dom`.
- Existing scripts: `typecheck`, `lint`, `build`, `dev`, `start`.
- No database driver, ORM, migration tool, payment SDK, QR library, or test framework is declared in `package.json`.
- No API route, database schema, migration directory, Docker/compose deployment definition, or production environment contract exists in the audited tree.
- `NEXT_PUBLIC_SITE_URL` is the only documented environment variable.

### Existing frontend assets to preserve

- Localized catalogue and template preview routes for Uzbek, Russian, and English.
- Three typed templates: Botanical, Editorial, Minimal.
- Shared `InvitationArtwork` component for catalogue, preview, editor, and public preview.
- Seven-step invitation builder with basic validation and preview.
- Defensive localStorage draft restoration.
- Query-string share preview with a 5,000-character URL guard.
- Baseline metadata, sitemap, robots, and localized routes.

## 3. Findings against Issue #6

| Work package | Current state | Gap / implication |
|---|---|---|
| A. Product & code audit | Static audit completed | Browser QA and runtime verification remain |
| B. Persistent invitation | Not implemented | No DB, stable slug, server draft, or public record lookup |
| C. Checkout & payments | Not implemented | No order, pricing authority, provider adapter, callback, or idempotency |
| D. Customer delivery | Partial frontend only | No guest order access, permanent URL, QR, or server/local sync |
| E. Admin / operations | Not implemented | No protected order view or payment/publish audit trail |
| F. Quality/security/SEO | Partial baseline | No automated test suite, payment threat review, API abuse controls, production headers, or published-page indexing policy |

### Detailed findings

#### A. Frontend and data flow

1. `InvitationBuilder` is a client-side component. Invitation data lives in React state and browser localStorage.
2. Draft persistence is manual through the Save draft action; it is not server-side and does not sync across devices.
3. `makeShareUrl()` serializes invitation fields into the `data` query parameter. The share URL therefore carries the invitation's names, event date, venue, address, and message.
4. The public invitation route parses the query payload and performs useful shape, enum, date, time, template/theme, and length checks.
5. Normal React text rendering is used in `InvitationArtwork`; no `dangerouslySetInnerHTML` was observed in the inspected rendering path.
6. The existing public invite page is a query preview, not a permanent published record.
7. No QR-code generation or download action is present in the inspected product flow.

#### B. Persistence and lifecycle

No server-side persistence layer is present. There is no invitation/order/payment schema or migration mechanism. The required lifecycle in Issue #6 cannot currently be represented or enforced.

#### C. Payments

No Click or Payme adapter, payment initiation endpoint, callback endpoint, signature verification, transaction table, idempotency mechanism, or server-side price calculation exists.

Production payment success must never be inferred from a browser redirect. Real merchant credentials and provider account configuration will be required before production payment acceptance.

#### D. Customer access and publication

No guest checkout order lookup, secure edit/access token, permanent slug, published record resolver, QR code, or customer management route exists.

#### E. Admin and operations

No protected admin interface, order search, payment event log, publishing event log, or operational failure view exists.

#### F. SEO, quality, and security

- The current query-based invitation page is marked `noindex`, which is appropriate for a URL carrying personal event data.
- Production publishing needs a separate policy: only records in the confirmed `published` state may be eligible for indexing; draft and pending-payment records must remain private/noindex.
- Current security documentation correctly calls out query-string exposure and browser-local draft privacy.
- Existing QA documentation is a plan, not proof of browser or assistive-technology test execution.
- CI evidence recorded in the merged frontend PR confirms typecheck, lint, and build at that implementation point. It does not prove persistence, payment, production security, or end-to-end acceptance.

## 4. Critical product and technical decisions

The following decisions should be confirmed in the architecture ADR before implementation proceeds beyond the first vertical slice.

### Recommended application architecture

Keep the existing Next.js application as the product application and introduce server-side modules behind Next.js Route Handlers / Server Actions where appropriate:

- `src/modules/invitations` — invitation domain, validation, repository, service.
- `src/modules/orders` — order lifecycle and server-side price calculation.
- `src/modules/payments` — provider-neutral payment contract and provider adapters.
- `src/modules/publishing` — slug allocation, publication state, canonical URL.
- `src/modules/admin` — protected operational queries and actions.
- `src/app/api` — thin HTTP boundary, authentication/authorization, rate limits, request validation.
- PostgreSQL as durable storage, isolated from other application databases/users.
- Versioned database migrations committed to the repository.

This is a modular monolith for one product, not a new microservice fleet. Keep route handlers thin and put business rules in services/repositories.

**ORM/query layer:** select and record one approach in an ADR after checking deployment constraints and migration ergonomics. Do not add both Prisma and Drizzle or introduce an ORM merely for convenience.

### Suggested domain records

At minimum, model these concepts separately:

- **Invitation:** internal ID, unique opaque slug, template ID, locale, event payload, status, timestamps, publication timestamp.
- **Order:** order ID, invitation ID, server-calculated amount/currency, status, customer contact, timestamps.
- **Payment:** provider, provider transaction/reference ID, amount/currency, status, idempotency key, verified timestamps, raw event reference where safe.
- **InvitationAccess:** hashed high-entropy edit/access token, invitation/order association, expiry/revocation metadata.
- **PaymentEvent / AuditEvent:** provider callback deduplication and important state transitions.

Prefer typed, validated invitation fields over trusting arbitrary client JSON. Store only data necessary to provide the service.

### Lifecycle invariants

- An invitation begins as a private draft.
- Checkout creates or reuses an order with an authoritative server-calculated price.
- A payment attempt is pending until verified through a provider-authenticated server callback/status verification.
- Duplicate callbacks must be safe and must not duplicate payment, order completion, or publication.
- Only a verified successful payment may transition an eligible order/invitation to paid/published.
- A published invitation receives a stable opaque URL; the URL must not contain the invitation payload or edit token.
- Draft and pending-payment records must not be publicly retrievable or indexed.
- Failed, cancelled, expired, and retryable states must preserve the customer's data.

### Guest access and admin

The MVP should not force customer account creation. Use a high-entropy guest access/edit token; store only a secure hash server-side, avoid exposing it in public URLs/referrers/logs, and define recovery/revocation/expiry behavior.

Admin access must be separate from guest access and protected server-side. Do not ship an admin route protected only by hiding a link in the UI.

## 5. Recommended implementation sequence

Deliver small, reviewable vertical slices. Every slice gets its own PR, migrations, tests, and updated docs.

### Phase 0 — Audit and architecture (this PR)

- [x] Inspect repository, scripts, routes, dependencies, and existing product/security/QA docs.
- [x] Compare README claims with the actual repository structure and source paths.
- [x] Identify missing work packages and launch blockers.
- [x] Record a proposed implementation sequence.
- [ ] Product Owner approves persistence, hosting, payment, and access-token decisions.
- [ ] Browser QA baseline is recorded.

### Phase 1 — Persistence foundation

- Choose PostgreSQL access layer and migration tooling.
- Define invitation/order/payment schema and state transitions.
- Add server-only database configuration and safe health/readiness behavior.
- Add repository/service boundaries and unit/integration tests.
- Never expose DB credentials to client bundles.

### Phase 2 — Guest draft and durable invitation

- Create server-side draft/order without requiring registration.
- Issue secure guest access/edit token; store only its hash.
- Autosave/sync wizard draft to the server without losing the current local draft.
- Add recovery and validation behavior.
- Add unique opaque slug allocation and stable public record lookup.
- Keep drafts private and non-indexable.

### Phase 3 — Checkout and provider adapters

- Add server-side product/package pricing and immutable order amount/currency snapshot.
- Define provider-neutral payment interface.
- Implement Click and Payme adapters from their current official merchant documentation.
- Implement provider callback authentication, transaction verification, idempotency, amount/currency checks, and replay protection.
- Test sandbox callbacks and all failure/retry states.
- Production mode must fail closed if merchant configuration is absent; no mock-success fallback.

### Phase 4 — Publication and customer delivery

- Publish only after verified successful payment.
- Serve the invitation by stable opaque slug from PostgreSQL.
- Generate QR codes pointing only to canonical public URLs.
- Add copy/share/download actions and a payment-confirmed result page.
- Define edit-after-payment rules and safe token handling.
- Keep private states out of sitemap and search indexing.

### Phase 5 — Admin and operations

- Add protected minimal order/invitation/payment overview.
- Add search by order ID, customer contact, or slug with access controls.
- Add append-only payment/publishing event history and structured operational logs.
- Add retry/reconciliation paths for provider and publication failures.

### Phase 6 — Production hardening and release readiness

- Complete responsive and accessibility QA.
- Add unit, integration, callback replay, authorization, and end-to-end tests.
- Add rate limiting and abuse protection for public endpoints.
- Review XSS, IDOR, token leakage, open redirects, webhook forgery/replay, and secret handling.
- Verify backups/restore, migrations, health checks, monitoring, and deployment rollback.
- Update README, environment example, operations/runbook, privacy and payment terms.
- Product Owner performs final demo/acceptance and explicitly approves production credentials and deployment.

## 6. Proposed initial technical decisions

| Concern | Recommendation | Approval / follow-up |
|---|---|---|
| Application | Keep Next.js App Router modular monolith | No new service required for MVP |
| Database | PostgreSQL | Confirm production host/database isolation |
| Data access | Choose one typed query/ORM layer with migrations | ADR required before implementation |
| Customer identity | Guest checkout, no mandatory account | Secure token design and recovery policy |
| Public URL | Opaque random slug, payload-free URL | Define slug entropy and lifecycle |
| Payments | Provider-neutral interface + Click/Payme adapters | Verify current official protocols and merchant onboarding |
| Pricing | Server-side configured packages, order price snapshot | Product Owner must approve packages/prices |
| QR | Generate QR from canonical published URL | No invitation data or secret in QR |
| Admin | Minimal server-protected operator access | Confirm initial admin identity/bootstrap approach |
| Deployment | Environment-based secrets and separate DB role | Confirm target host/domain and backup owner |

## 7. External dependencies / Product Owner inputs

These are not reasons to stop the code audit, but they are required before production completion:

1. Final production domain and hosting target.
2. PostgreSQL host/database provisioning and backup/restore owner.
3. Approved product price(s), currency, and what payment unlocks.
4. Click merchant account and sandbox/production credentials.
5. Payme merchant account and sandbox/production credentials.
6. Customer contact policy (phone/email; minimum required field).
7. Privacy, retention, deletion, and customer support policy.
8. Initial admin/operator identity and access policy.
9. Whether edits are allowed after payment/publication and any republish rules.

Credentials must be supplied through deployment secrets, never GitHub source files or chat messages.

## 8. Acceptance and remaining risks

This audit does not mark Issue #6 complete. It establishes the implementation baseline and sequencing.

**Verified by static repository inspection:** the frontend MVP exists; durable persistence, payments, guest access, permanent publishing, QR, admin, and production operations do not.

**Not yet verified:** browser behavior across viewport sizes, keyboard/screen-reader flow, runtime deployment configuration, PostgreSQL availability, provider sandbox behavior, production security headers, and operational recovery.

**Release blocker:** no production launch until all Issue #6 acceptance criteria pass and Product Owner explicitly approves payment credentials and deployment.
