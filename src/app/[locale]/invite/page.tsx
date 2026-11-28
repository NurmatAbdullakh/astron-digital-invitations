import type { Metadata } from "next";
import Link from "next/link";
import InvitationArtwork from "@/components/invitations/InvitationArtwork";
import { notFound } from "next/navigation";
import { getInvitationTemplate, isInvitationTemplateId, type InvitationTemplateId } from "@/lib/invitations/templates";

export const metadata: Metadata = { title: "Digital invitation", robots: { index: false, follow: false } };
type Invitation = {
  type: string; title: string; hosts: string; date: string; time: string; venue: string;
  address: string; message: string; theme: "sage" | "rose" | "sand"; template?: string;
};
const eventTypes = ["wedding", "birthday", "family", "corporate", "graduation"] as const;
const translations = {
  uz: { invite: "SIZNI TAKLIF ETAMIZ", date: "TADBIR SANASI", place: "MANZIL", note: "Sizni kutib qolamiz", back: "Siz ham taklifnoma yarating" },
  ru: { invite: "ПРИГЛАШАЕМ ВАС", date: "ДАТА СОБЫТИЯ", place: "МЕСТО ПРОВЕДЕНИЯ", note: "Будем рады вас видеть", back: "Создайте своё приглашение" },
  en: { invite: "YOU ARE INVITED", date: "EVENT DATE", place: "LOCATION", note: "We look forward to seeing you", back: "Create your own invitation" }
} as const;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function isInvitation(value: unknown): value is Invitation {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const stringFields = ["type", "title", "hosts", "date", "time", "venue", "address", "message", "theme"];
  if (!stringFields.every((key) => typeof item[key] === "string")) return false;
  if (!eventTypes.includes(item.type as (typeof eventTypes)[number])) return false;
  if (!["sage", "rose", "sand"].includes(String(item.theme))) return false;
  if (item.template !== undefined && !isInvitationTemplateId(item.template)) return false;
  if (typeof item.template === "string" && getInvitationTemplate(item.template as InvitationTemplateId).theme !== item.theme) return false;
  return String(item.title).length <= 90 && String(item.hosts).trim().length > 0 && String(item.hosts).length <= 70
    && isValidDate(String(item.date)) && (String(item.time) === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.time)))
    && String(item.venue).length <= 80 && String(item.address).length <= 140 && String(item.message).length <= 220;
}

export default async function PublicInvitationPage({
  params, searchParams
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ data?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!(locale in translations) || !query.data || query.data.length > 5000) notFound();
  let parsed: unknown;
  try { parsed = JSON.parse(query.data); } catch { notFound(); }
  if (!isInvitation(parsed)) notFound();
  const invitation = parsed;
  const t = translations[locale as keyof typeof translations];
  const date = new Date(invitation.date + "T12:00:00");
  const formattedDate = new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric", month: "long", year: "numeric"
  }).format(date);
  const template = isInvitationTemplateId(invitation.template) ? invitation.template : "botanical";
  return (
    <main className="public-invitation-page">
      <InvitationArtwork template={template} theme={invitation.theme} invitationLabel={t.invite}
        dateCaption={t.date} hosts={invitation.hosts || invitation.title} title={invitation.title}
        date={formattedDate} time={invitation.time} locationLabel={t.place} venue={invitation.venue}
        address={invitation.address} message={invitation.message || t.note} />
      <footer className="public-invite-footer"><span>Astron · Digital invitations</span><Link href={`/${locale}/templates`}>{t.back} ↗</Link></footer>
    </main>
  );
}
