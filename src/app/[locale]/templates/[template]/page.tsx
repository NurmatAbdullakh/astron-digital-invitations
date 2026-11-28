import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InvitationArtwork from "@/components/invitations/InvitationArtwork";
import { getInvitationTemplate, isInvitationTemplateId } from "@/lib/invitations/templates";

const locales = ["uz", "ru", "en"] as const;
const labels = {
  uz: { title: "Shablon ko‘rinishi", back: "Katalogga qaytish", use: "Shu shablonni tanlash", preview: "NAMUNA", invite: "SIZNI TAKLIF ETAMIZ", date: "BAХTLI KUNIMIZ", location: "MANZIL", note: "Sizni quvonchli kunimizda kutamiz", names: ["Botanika", "Editorial", "Minimal"], descriptions: ["Nozik gullar va romantika", "Hashamatli klassika va nafislik", "Zamonaviy va sodda tipografika"] },
  ru: { title: "Предпросмотр шаблона", back: "Вернуться в каталог", use: "Выбрать этот шаблон", preview: "ПРИМЕР", invite: "ПРИГЛАШАЕМ ВАС", date: "НАШ ОСОБЕННЫЙ ДЕНЬ", location: "МЕСТО", note: "Будем рады разделить этот день с вами", names: ["Ботаника", "Editorial", "Минимализм"], descriptions: ["Нежные цветы и романтика", "Элегантная классика и роскошь", "Современная лаконичная типографика"] },
  en: { title: "Template preview", back: "Back to catalogue", use: "Use this template", preview: "SAMPLE", invite: "YOU ARE INVITED", date: "OUR SPECIAL DAY", location: "LOCATION", note: "We would love to celebrate with you", names: ["Botanical", "Editorial", "Minimal"], descriptions: ["Delicate florals and romance", "Timeless elegance and luxury", "Modern, minimal typography"] }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; template: string }> }): Promise<Metadata> {
  const { locale, template } = await params;
  if (!locales.includes(locale as (typeof locales)[number]) || !isInvitationTemplateId(template)) return {};
  const t = labels[locale as keyof typeof labels];
  const index = ["botanical", "editorial", "minimal"].indexOf(template);
  return { title: `${t.names[index]} — ${t.title}`, description: t.descriptions[index], robots: { index: true, follow: true } };
}

export function generateStaticParams() {
  return locales.flatMap((locale) => ["botanical", "editorial", "minimal"].map((template) => ({ locale, template })));
}

export default async function TemplatePreviewPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; template: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ locale, template }, query] = await Promise.all([params, searchParams]);
  if (!locales.includes(locale as (typeof locales)[number]) || !isInvitationTemplateId(template)) notFound();
  const lang = locale as keyof typeof labels;
  const t = labels[lang];
  const selected = getInvitationTemplate(template);
  const index = ["botanical", "editorial", "minimal"].indexOf(template);
  const category = ["wedding", "birthday", "family", "corporate", "graduation"].includes(query.category ?? "") ? query.category! : "wedding";
  const eventName = {
    uz: ["To‘y", "Tug‘ilgan kun", "Oilaviy bayram", "Korporativ", "Bitiruv"],
    ru: ["Свадьба", "День рождения", "Семейный праздник", "Корпоратив", "Выпускной"],
    en: ["Wedding", "Birthday", "Family celebration", "Corporate", "Graduation"]
  }[lang][["wedding", "birthday", "family", "corporate", "graduation"].indexOf(category)];
  const hosts = lang === "ru" ? "Анна и Михаил" : lang === "uz" ? "Aziza va Mirjalol" : "Anna & Michael";
  const date = lang === "ru" ? "12 июня 2027" : lang === "uz" ? "12 · 06 · 2027" : "June 12, 2027";
  return (
    <main className="template-detail-page">
      <header className="site-header template-detail-header">
        <Link className="brand" href={`/${locale}/templates`}><span className="brand-mark">a.</span><span>astron</span></Link>
        <Link className="template-detail-back" href={`/${locale}/templates?category=${category}`}>← {t.back}</Link>
        <span className="template-detail-locale">{locale.toUpperCase()}</span>
      </header>
      <section className="template-detail-layout">
        <div className="template-detail-artwork">
          <div className="template-detail-sample">{t.preview}</div>
          <InvitationArtwork template={template} theme={selected.theme}
            invitationLabel={t.invite} dateCaption={t.date} hosts={hosts} title={eventName}
            date={date} time="18:00" locationLabel={t.location} venue="Villa Garden"
            address="Tashkent" message={t.note} footerLabel="ASTRON STUDIO" />
        </div>
        <div className="template-detail-copy">
          <span className="catalog-card-index">ASTRON SIGNATURE COLLECTION · 0{index + 1}</span>
          <h1>{t.names[index]}</h1>
          <p>{t.descriptions[index]}</p>
          <div className="template-detail-meta"><span>✦</span><span>{eventName}</span></div>
          <p className="template-detail-helper">{lang === "ru" ? "Это пример оформления. На следующем шаге вы добавите свои имена, дату и место проведения." : lang === "uz" ? "Bu dizayn namunasi. Keyingi bosqichda o‘z ismlaringiz, sana va manzilni kiritasiz." : "This is a design sample. In the next step, you’ll add your names, date and venue."}</p>
          <Link className="template-detail-cta" href={`/${locale}/create?type=${category}&template=${template}`}>{t.use} <span aria-hidden="true">↗</span></Link>
          <Link className="template-detail-secondary" href={`/${locale}/templates?category=${category}`}>{t.back}</Link>
        </div>
      </section>
    </main>
  );
}
