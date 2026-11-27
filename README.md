# Astron Digital Invitations

SEO-first digital invitation platform built with Next.js App Router and TypeScript.

## Product direction

A multilingual digital invitation platform for weddings, birthdays, family events, corporate events, graduations, and other occasions.

## Stack

- Next.js App Router
- React 19 and TypeScript
- Server Components and statically generated public pages
- CSS with responsive layouts

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

- `/uz`, `/ru`, `/en` — localized homepages
- `/[locale]/wedding`
- `/[locale]/birthday`
- `/[locale]/family`
- `/[locale]/corporate`
- `/[locale]/graduation`
- `/[locale]/templates`

## MVP features

- Multilingual public pages in Uzbek, Russian, and English
- Five event categories: wedding, birthday, family, corporate, graduation
- Mobile-first invitation studio with live preview and compact template selector
- Three distinct invitation templates: Botanical, Editorial, and Minimal
- Event detail fields with localized Uzbek, Russian, and English labels
- Explicit local draft save/restore in the same browser/device
- Shareable public invitation URL
- Invitation payload is encoded in the URL query string; there is no database persistence in this MVP
- Local drafts are stored in browser localStorage and are not synced across devices or accounts
- Payments, accounts, and server-side invitation management are not included yet

## SEO baseline

- Localized title and description metadata
- Canonical URLs and language alternates
- Open Graph metadata
- XML sitemap at `/sitemap.xml`
- Robots directives at `/robots.txt`
- JSON-LD structured data
- OAI-SearchBot allowed for ChatGPT Search discovery
- GPTBot configured separately from search crawling

Read [SEO and AI Search Readiness](docs/SEO-AND-AI-SEARCH.md) for production requirements.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS domain before deployment. The development fallback is localhost. Set the final HTTPS origin in the hosting environment before launch.
