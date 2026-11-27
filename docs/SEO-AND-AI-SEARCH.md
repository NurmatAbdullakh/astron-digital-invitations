# SEO and AI Search Readiness

## Current implementation

- Next.js App Router with server-rendered public pages.
- Uzbek, Russian, and English locale routes: `/uz`, `/ru`, `/en`.
- Locale-specific titles, descriptions, Open Graph metadata, canonical URLs, and alternate-language links.
- XML sitemap generated from `src/app/sitemap.ts`.
- Robots rules generated from `src/app/robots.ts`.
- Public event landing pages for weddings, birthdays, family events, corporate events, and graduations.
- JSON-LD structured data on the home and event category pages.
- OAI-SearchBot is allowed for ChatGPT Search discovery.
- GPTBot is disallowed separately; this does not block OAI-SearchBot.

## Before production

1. Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS domain.
2. Verify the domain in Google Search Console and Bing Webmaster Tools.
3. Submit `https://YOUR_DOMAIN/sitemap.xml` to both services.
4. Test the live robots file and sitemap after deployment.
5. Add real, unique template detail pages with descriptive copy and original images.
6. Add social sharing images with the correct dimensions and localized alt text.
7. Add privacy, terms, contact, pricing, and FAQ pages.
8. Add analytics and consent controls appropriate for the target markets.
9. Ensure private editor, account, and dashboard pages return authentication-protected responses and carry `noindex` metadata; robots.txt alone is not access control.
10. Monitor indexing, Core Web Vitals, structured-data validity, and server errors.

## Important

Technical SEO improves crawlability and eligibility for discovery; it cannot guarantee rankings or inclusion in AI-generated answers. Search visibility depends on useful original content, reputation, links, freshness, and search engine systems.
