# TASK-ASTRON-DB-001 — PostgreSQL persistence foundation on Contabo

- **Status:** IN_REVIEW
- **Priority:** P0
- **Owner:** Development Department
- **Product Owner decision:** Contabo VPS approved
- **Branch:** `feat/phase-1-postgres-foundation`

## Goal

Introduce the server-side PostgreSQL foundation required by Issue #6 without changing the existing catalogue, template artwork, or invitation wizard.

## Scope

- [x] Record the Contabo hosting architecture in ADR-002.
- [x] Document the infrastructure preflight, network boundary, migration, backup, and rollback runbook.
- [x] Add server-only PostgreSQL pool with bounded connections and timeouts.
- [x] Add transaction helper.
- [x] Add initial versioned schema migration for invitations, orders, payments, payment events, guest access-token hashes, and audit events.
- [x] Add liveness and database readiness endpoints.
- [x] Add database configuration unit tests.
- [ ] CI executes unit tests, typecheck, lint, and production build successfully.
- [ ] Review migration against a real PostgreSQL 17 instance and verify up/down behavior.
- [ ] Product Owner reviews the ADR and Phase 1 PR.

## Non-goals

- No VPS changes, SSH, firewall, Docker, DNS, Nginx, TLS, or production deployment.
- No customer-facing invitation CRUD/API yet.
- No payment provider integration or payment success simulation.
- No guest token issuance/validation service yet.
- No migration execution against production.

## Acceptance criteria

1. Existing frontend routes and UI remain unchanged.
2. Database credentials are server-only and are never returned from health endpoints.
3. Pool is lazy-created, bounded, and reused across Next.js development reloads.
4. Transactions commit on success and roll back on failure.
5. Migration is explicit and versioned; it does not run on app startup.
6. Readiness returns 503 when PostgreSQL is unavailable; liveness remains independent.
7. CI runs the new unit test suite plus existing quality checks.
8. Contabo deployment is not attempted before preflight and explicit deployment approval.

## Review notes

This is the infrastructure/data foundation only. Issue #6 remains open until invitation persistence, guest checkout, verified payments, publication, QR delivery, admin, and release QA are implemented.
