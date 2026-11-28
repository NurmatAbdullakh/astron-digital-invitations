import { redirect } from "next/navigation";

const locales = ["uz", "ru", "en"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supported = locales.includes(locale as (typeof locales)[number]) ? locale : "uz";
  redirect(`/${supported}/templates`);
}
