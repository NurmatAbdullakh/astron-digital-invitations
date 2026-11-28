# ADR-002 — PostgreSQL persistence on the Contabo VPS

- **Status:** Accepted for Phase 1 implementation
- **Date:** 2026-11-28
- **Decision owner:** Product Owner
- **Decision:** Use the existing Contabo VPS; do not provision a second VPS for the MVP.

## Context

Issue #6 requires durable invitation/order/payment state. The current product is a Next.js App Router application with no database or server-side persistence. The Product Owner selected Contabo as the production hosting target.

The existing VPS also hosts other workloads. Astron Digital Invitations must therefore have an isolated database, credentials, storage volume, and application configuration. It must not reuse another product's database or database role.

## Decisions

1. Keep the current Next.js application as a modular monolith. Do not introduce microservices for this MVP.
2. Run a dedicated PostgreSQL 17 service/container on the Contabo VPS, subject to checking the installed Docker/host environment before deployment.
3. Use a dedicated database, database role, persistent Docker volume, and migration history for Astron Digital Invitations.
4. Do not publish PostgreSQL port 5432 on a public host interface. The application connects over a private Docker bridge network. If the app runs directly on the host during an interim setup, bind the DB port to loopback only.
5. Keep database credentials in deployment environment/secrets, never in source control, client-side variables, image layers, or logs.
6. Use the `pg` Node.js driver and `node-pg-migrate` for versioned schema migrations. Keep SQL schema changes reviewable in Git.
7. Use a bounded connection pool (default max 10) and short connection/statement timeouts. Revisit pool sizing before adding replicas.
8. Expose separate liveness (`/api/health`) and readiness (`/api/ready`) endpoints. Readiness checks PostgreSQL; liveness does not.
9. Back up PostgreSQL daily to storage outside the VPS and test restores before launch. A VPS-local volume alone is not a backup.
10. Do not deploy or provision infrastructure as part of this PR. Deployment requires a separate approved operations task and a live VPS inspection.

## Data model foundation

The initial migration creates:

- `invitations` — template/event details, locale, contact fields, lifecycle state, and future public slug.
- `orders` — immutable amount/currency snapshot and order lifecycle.
- `payments` — provider, provider references, idempotency key, amount/currency, and verification state.
- `payment_events` — callback deduplication and processing outcome metadata; no secrets or raw credentials.
- `invitation_access_tokens` — SHA-256 token hashes only; raw guest access tokens must never be persisted.
- `audit_events` — append-only business lifecycle metadata.

The schema is a foundation only. It does not yet expose customer-facing create/update APIs or claim that payment and publishing workflows exist.

## Contabo network and security boundary

Preferred topology:

```text
Internet
   |
Nginx / HTTPS
   |
Next.js application container
   |  private Docker bridge
   +-----------------------------+
                                 |
                         PostgreSQL 17
                         no public port
                         dedicated volume
```

- Allow inbound SSH and required HTTP/HTTPS only through the host firewall.
- Never open 5432 to the public internet.
- Use a dedicated non-superuser database role for the application; migrations may use a separate restricted deployment role.
- Use strong unique credentials and rotate them through deployment secrets.
- Keep PostgreSQL and the app on the same private network; Docker service DNS may use `postgres` as the hostname.
- For host-process development, use a loopback-only port binding and SSH access; do not weaken the public firewall.
- Configure encrypted off-host backups and verify restore procedure and retention.

## Operational requirements before production

- Inspect the actual Contabo VPS OS, Docker/Compose versions, disk capacity, firewall, existing networks, and current services.
- Confirm the application deployment topology and canonical HTTPS domain.
- Provision a dedicated database, role, volume, and private network without touching other services.
- Configure deployment-only `DATABASE_URL`; set `DATABASE_SSL=disable` only for trusted private-network traffic. Use `DATABASE_SSL=require` with certificate verification for a TLS-enabled database endpoint.
- Run migrations as a controlled release step, not automatically on every app startup.
- Configure backup, restore test, disk/CPU/RAM monitoring, and log retention.
- Verify `/api/health` and `/api/ready` after deployment.

## Consequences

- Lowest operational complexity and infrastructure cost for the MVP.
- The VPS is a single failure domain; off-host backups and a tested restore plan are mandatory.
- The application and database share host CPU, RAM, disk, and maintenance windows.
- A separate VPS or managed database can be introduced later without changing the domain model, provided the connection contract remains PostgreSQL.

## Out of scope

- Actual VPS provisioning, SSH changes, firewall changes, DNS, Nginx, TLS, deployment, and production credentials.
- Click/Payme integration and merchant onboarding.
- Customer-facing invitation/order/payment APIs.
