import type { Metadata } from "next";
import Link from "next/link";
import InvitationArtwork from "@/components/invitations/InvitationArtwork";
import { notFound } from "next/navigation";
import { isInvitationTemplateId } from "@/lib/invitations/templates";

export const metadata: Metadata = {
  title: "Digital invitation",
  robots: { index: false, follow: false },
};

type Invitation = {
  type: string;
  title: string;
  hosts: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  theme: "sage" | "rose" | "sand";
  template?: string;
};

const translations = {
  uz: { invite: "SIZNI TAKLIF ETAMIZ", date: "TADBIR SANASI", place: "MANZIL", note: "Sizni kutib qolamiz", back: "Siz ham taklifnoma yarating" },
  ru: { invite: "ПРИГЛАШАЕМ ВАС", date: "ДАТА СОБЫТИЯ", place: "МЕСТО ПРОВЕДЕНИЯ", note: "Будем рады вас видеть", back: "Создайте своё приглашение" },
  en: { invite: "YOU ARE INVITED", date: "EVENT DATE", place: "LOCATION", note: "We look forward to seeing you", back: "Create your own invitation" },
} as const;

function isInvitation(value: unknown): value is Invitation {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["type", "title", "hosts", "date", "time", "venue", "address", "message", "theme"].every((key) => typeof item[key] === "string")
    && ["sage", "rose", "sand"].includes(String(item.theme))
    && (item.template === undefined || isInvitationTemplateId(item.template))
    && String(item.title).length <= 90
    && String(item.message).length <= 220;
}

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ data?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!(locale in translations) || !query.data || query.data.length > 5000) notFound();

  let invitation: Invitation;
  try {
    const parsed: unknown = JSON.parse(query.data);
    if (!isInvitation(parsed)) notFound();
    invitation = parsed;
  } catch {
    notFound();
  }

  const t = translations[locale as keyof typeof translations];
  const date = new Date(invitation.date + "T12:00:00");
  const formattedDate = Number.isNaN(date.getTime()) ? invitation.date : new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(date);

  return (
    <main className="public-invitation-page">
      <InvitationArtwork
        template={isInvitationTemplateId(invitation.template) ? invitation.template : "botanical"}
        theme={invitation.theme}
        invitationLabel={t.invite}
        dateCaption={t.date}
        hosts={invitation.hosts || invitation.title}
        title={invitation.title}
        date={formattedDate}
        time={invitation.time}
        locationLabel={t.place}
        venue={invitation.venue}
        address={invitation.address}
        message={invitation.message || t.note}
      />
      <footer className="public-invite-footer"><span>Astron · Digital invitations</span><Link href={`/${locale}/create`}>{t.back} ↗</Link></footer>
    </main>
  );
}
