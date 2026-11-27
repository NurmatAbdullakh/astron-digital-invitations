import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvitationBuilder from "./InvitationBuilder";

const locales = ["uz", "ru", "en"] as const;

export const metadata: Metadata = {
  title: "Taklifnoma yaratish",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CreateInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <InvitationBuilder locale={locale as (typeof locales)[number]} initialType={query.type ?? "wedding"} />;
}
