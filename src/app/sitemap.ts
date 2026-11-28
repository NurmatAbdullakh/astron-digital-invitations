import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const locales = ["uz", "ru", "en"] as const;
const templates = ["botanical", "editorial", "minimal"] as const;
const routes = ["/templates", "/wedding", "/birthday", "/family", "/corporate", "/graduation"];

export default function sitemap(): MetadataRoute.Sitemap {
  const catalogueRoutes = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: route === "/templates" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/templates" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((alternateLocale) => [
          alternateLocale, `${siteUrl}/${alternateLocale}${route}`
        ]))
      }
    }))
  );
  const templateRoutes = templates.flatMap((template) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/templates/${template}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((alternateLocale) => [
          alternateLocale, `${siteUrl}/${alternateLocale}/templates/${template}`
        ]))
      }
    }))
  );
  return [...catalogueRoutes, ...templateRoutes];
}
