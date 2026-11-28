# Astron Digital Invitations

SEO-first digital invitation platform built with Next.js App Router and TypeScript.

## Product direction

A multilingual digital invitation platform for weddings, birthdays, family events, corporate events, graduations, and other occasions. The primary experience is a template marketplace followed by a guided invitation builder.

## Stack

- Next.js App Router
- React 19 and TypeScript
- Server Components and statically generated public pages
- CSS with responsive layouts
- PostgreSQL (`pg`) and versioned migrations (`node-pg-migrate`) for server-side persistence foundation

## Local development

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_SITE_URL to your canonical site origin
npm run dev
```

Useful scripts:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run start`

## Routes

- `/` — redirects to the default Uzbek catalogue
- `/[locale]` — redirects to the localized catalogue
- `/[locale]/templates` — primary template catalogue
- `/[locale]/templates/[template]` — dedicated template preview and selection
- `/[locale]/create?type=[event]&template=[id]` — guided invitation wizard
- `/[locale]/invite?data=[payload]` — shareable public invitation preview
- `/[locale]/wedding`, `/birthday`, `/family`, `/corporate`, `/graduation` — event landing pages

Supported locales: Uzbek (`uz`), Russian (`ru`), English (`en`).

## MVP features

- Catalogue-first discovery with event context and original invitation artwork cards
- Dedicated template preview before selection; no account required
- Seven-step guided wizard that asks one question or one related group at a time
- Live preview powered by the same `InvitationArtwork` component as the public invitation
- Three original invitation styles: Botanical, Editorial, and Minimal
- Localized Uzbek, Russian, and English catalogue, preview, and builder UI
- Explicit local draft save/restore in the same browser/device
- Shareable invitation URL with payload size guard and clipboard fallback
- Public invitation payload validation and safe malformed-data handling
- No database persistence in this MVP; share payload is encoded in the URL query string
- Local drafts are stored in browser localStorage and are not synced across devices or accounts
- Payments, accounts, permanent slug publishing, RSVP storage/notifications, and server-side invitation management are not included yet

## SEO baseline

- Localized title and description metadata
- Canonical URLs and language alternates
- Open Graph metadata
- XML sitemap at `/sitemap.xml`
- Robots directives at `/robots.txt`
- JSON-LD structured data on public landing pages
- OAI-SearchBot allowed for ChatGPT Search discovery
- GPTBot configured separately from search crawling

Read [SEO and AI Search Readiness](docs/SEO-AND-AI-SEARCH.md) for production requirements.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS domain before deployment. The development fallback is localhost. Set the final HTTPS origin in the hosting environment before launch.

## Database foundation

The repository includes a PostgreSQL schema foundation, server-only connection pool, migration tooling, and separate liveness/readiness endpoints.

- `GET /api/health` — application liveness; does not depend on PostgreSQL.
- `GET /api/ready` — readiness; returns HTTP 503 when PostgreSQL is unavailable.
- `npm run test:unit` — database configuration unit tests.
- `npm run db:migrate` — apply reviewed migrations (requires a configured `DATABASE_URL`).

For local development, create a dedicated PostgreSQL database and role, copy `.env.example` to `.env.local`, and set `DATABASE_URL`. The migration command is an explicit release step; it is not run automatically at app startup.

Production hosting decision and network/security requirements are documented in [ADR-002](docs/architecture/ADR-002-contabo-postgresql-foundation.md) and the [Contabo PostgreSQL runbook](docs/operations/CONTABO-POSTGRESQL-RUNBOOK.md). Never expose PostgreSQL port 5432 publicly or commit real credentials.

The initial migration creates the invitation, order, payment, payment-event, guest-access-token-hash, and audit-event tables. Customer-facing persistence APIs and payment processing are not implemented by this foundation.
