import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.uz";
const locales = ["uz", "ru", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/wedding", "/birthday", "/family", "/corporate", "/graduation", "/templates"];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [
            alternateLocale,
            `${siteUrl}/${alternateLocale}${route}`,
          ]),
        ),
      },
    })),
  );
}
