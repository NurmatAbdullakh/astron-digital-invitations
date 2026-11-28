# Contabo PostgreSQL Runbook — Astron Digital Invitations

**Status:** Preparation only. No server has been changed by this document.

## Target topology

- Existing Contabo VPS.
- Dedicated PostgreSQL 17 container and persistent volume for Astron Digital Invitations.
- Dedicated database and non-superuser application role.
- Private Docker bridge network shared with the app container.
- No public PostgreSQL port.
- Daily encrypted off-host backups with documented restore verification.

Do not reuse the POS database, credentials, volume, or application role.

## Required preflight (must be performed on the VPS)

1. Confirm VPS identity and owner-approved maintenance window.
2. Inspect OS, Docker Engine, Compose plugin, free disk, memory, firewall, current containers, networks, volumes, and listening ports.
3. Identify the actual Astron app deployment mode (Docker container or host process).
4. Confirm the canonical domain and reverse-proxy routing.
5. Confirm a safe backup destination outside this VPS.
6. Ensure a rollback plan exists before creating or changing services.

Do not copy commands from this runbook into production until the preflight confirms names and topology. Never remove or prune existing Docker volumes during setup.

## Deployment environment

Configure these values in the deployment secret store or protected server-side environment file. Do not commit real values:

```dotenv
DATABASE_URL=postgresql://astron_app:REPLACE_WITH_STRONG_SECRET@postgres:5432/astron_invitations
DATABASE_SSL=disable
DATABASE_POOL_MAX=10
```

`DATABASE_SSL=disable` is acceptable only when app and PostgreSQL communicate over a trusted private Docker network on the same VPS. For a TLS-enabled external endpoint use `DATABASE_SSL=require` with certificate validation.

## Network rules

- PostgreSQL must not have a public `ports: 5432:5432` mapping.
- Container-to-container access uses a private bridge network.
- If the app must temporarily run on the host, publish PostgreSQL only to `127.0.0.1`, not `0.0.0.0`.
- Public firewall ingress must not include TCP 5432.
- Do not disable the host firewall to troubleshoot connectivity.

## Migration release procedure

1. Take and verify a pre-migration backup.
2. Deploy the reviewed application artifact and migration files.
3. Run `npm run db:migrate` once as a controlled release step using a migration-capable database role.
4. Verify migration history and `/api/ready`.
5. Verify `/api/health` independently.
6. If migration fails, stop rollout and inspect the migration state; do not blindly rerun destructive SQL.

Migrations must not run automatically in every Next.js process or container startup.

## Backup and restore policy

Before production launch, choose an encrypted off-host backup target and document:
- Daily full logical backup (`pg_dump`) and transfer off the VPS.
- Retention target: at least 7 daily and 4 weekly restore points, subject to storage/cost approval.
- Backup success/failure alerting.
- Periodic restore test into an isolated database.
- Recovery owner and acceptable recovery point/time objectives.

A Docker volume or snapshot on the same VPS does not protect against VPS loss.

## Health checks

- `GET /api/health`: application process is responding.
- `GET /api/ready`: PostgreSQL connection is available; returns HTTP 503 otherwise.

Do not expose connection strings, usernames, hostnames, SQL errors, or stack traces in public health responses.

## Rollback

- Application rollback must not automatically roll back schema changes.
- Prefer backward-compatible expand/contract migrations.
- Before any destructive migration, take a verified backup and obtain explicit approval.
- Restore from backup only under an incident procedure; verify the target database before restoring.
