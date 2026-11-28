import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InvitationArtwork from "@/components/invitations/InvitationArtwork";
import { invitationTemplates } from "@/lib/invitations/templates";

const copy = {
  uz: {
    title: "Taklifnomalar katalogi", description: "Bayramingizga mos raqamli taklifnoma dizaynini tanlang.",
    eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "Bayramingiz uchun o‘ziga xos taklifnoma",
    intro: "Avval dizaynlarni ko‘ring. Yoqtirganingizni tanlang — qolganini bir necha sodda qadamda tayyorlaymiz.",
    all: "Farqi yo‘q", eventTypeLabel: "Tadbir turi", categories: ["To‘y", "Tug‘ilgan kun", "Oilaviy bayram", "Korporativ", "Bitiruv"],
    preview: "Ko‘rib chiqish", use: "Shablonni tanlash", back: "Bosh sahifa", names: ["Botanika", "Editorial", "Minimal"],
    descriptions: ["Nozik gullar va romantika", "Hashamatli klassika va nafislik", "Zamonaviy va sodda tipografika"],
    invite: "SIZNI TAKLIF ETAMIZ", date: "BAХTLI KUNIMIZ", location: "MANZIL", note: "Sizni quvonchli kunimizda kutamiz",
    wedding: "To‘y", birthday: "Tug‘ilgan kun", family: "Oilaviy bayram", corporate: "Korporativ", graduation: "Bitiruv",
    count: "ta dizayn", chooseHint: "Har bir dizaynni avval ko‘rib chiqishingiz mumkin."
  },
  ru: {
    title: "Каталог приглашений", description: "Выберите дизайн цифрового приглашения для вашего события.",
    eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "Приглашение для вашего особенного дня",
    intro: "Сначала посмотрите дизайны. Выберите понравившийся — остальное подготовим вместе за несколько простых шагов.",
    all: "Неважно", eventTypeLabel: "Тип события", categories: ["Свадьба", "День рождения", "Семейный праздник", "Корпоратив", "Выпускной"],
    preview: "Посмотреть", use: "Выбрать шаблон", back: "Главная", names: ["Ботаника", "Editorial", "Минимализм"],
    descriptions: ["Нежные цветы и романтика", "Элегантная классика и роскошь", "Современная лаконичная типографика"],
    invite: "ПРИГЛАШАЕМ ВАС", date: "НАШ ОСОБЕННЫЙ ДЕНЬ", location: "МЕСТО", note: "Будем рады разделить этот день с вами",
    wedding: "Свадьба", birthday: "День рождения", family: "Семейный праздник", corporate: "Корпоратив", graduation: "Выпускной",
    count: "дизайна", chooseHint: "Откройте любой дизайн, чтобы увидеть его подробнее."
  },
  en: {
    title: "Invitation catalogue", description: "Choose a digital invitation design for your celebration.",
    eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "A beautiful invitation for your special day",
    intro: "Explore the designs first. Choose your favourite and we’ll guide you through the rest in a few simple steps.",
    all: "Any event", eventTypeLabel: "Event type", categories: ["Wedding", "Birthday", "Family celebration", "Corporate", "Graduation"],
    preview: "Preview", use: "Choose template", back: "Home", names: ["Botanical", "Editorial", "Minimal"],
    descriptions: ["Delicate florals and romance", "Timeless elegance and luxury", "Modern, minimal typography"],
    invite: "YOU ARE INVITED", date: "OUR SPECIAL DAY", location: "LOCATION", note: "We would love to celebrate with you",
    wedding: "Wedding", birthday: "Birthday", family: "Family celebration", corporate: "Corporate", graduation: "Graduation",
    count: "designs", chooseHint: "Open any design to see a full preview before choosing."
  }
} as const;

const eventTypes = ["wedding", "birthday", "family", "corporate", "graduation"] as const;
const locales = ["uz", "ru", "en"] as const;
type Locale = keyof typeof copy;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const t = copy[locale as Locale];
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${locale}/templates`, languages: { uz: "/uz/templates", ru: "/ru/templates", en: "/en/templates" } },
    openGraph: { title: t.title, description: t.description, type: "website" }
  };
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!locales.includes(locale as Locale)) notFound();
  const lang = locale as Locale;
  const t = copy[lang];
  const category = eventTypes.find((type) => type === query.category) ?? "all";
  const categoryName = (type: string) => t[type as keyof typeof t] as string;
  const dateSample = lang === "ru" ? "12 июня 2027" : lang === "uz" ? "12 · 06 · 2027" : "June 12, 2027";
  const hostSample = lang === "ru" ? "Анна и Михаил" : lang === "uz" ? "Aziza va Mirjalol" : "Anna & Michael";
  return (
    <main className="catalog-page">
      <header className="site-header catalog-header">
        <Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${locale}/templates`} aria-current={category === "all" ? "page" : undefined}>{t.all}</Link>
        </nav>
        <div className="locale-switch" aria-label="Language">
          {(["uz", "ru", "en"] as const).map((code) => <Link key={code} href={`/${code}/templates`} aria-current={lang === code ? "page" : undefined}>{code.toUpperCase()}</Link>)}
        </div>
      </header>

      <section className="catalog-intro">
        <p className="catalog-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.intro}</p>
      </section>

      <section className="catalog-content" aria-label={t.title}>
        <div className="catalog-toolbar">
          <div className="catalog-filter-group">
            <span className="catalog-filter-label">{t.eventTypeLabel}</span>
            <div className="catalog-filters" aria-label={t.eventTypeLabel}>
              <Link className={category === "all" ? "catalog-filter is-active" : "catalog-filter"} href={`/${locale}/templates`} aria-current={category === "all" ? "page" : undefined}>{t.all}</Link>
              {eventTypes.map((type, index) => (
                <Link key={type} className={category === type ? "catalog-filter is-active" : "catalog-filter"}
                  href={`/${locale}/templates?category=${type}`} aria-current={category === type ? "page" : undefined}>{t.categories[index]}</Link>
              ))}
            </div>
          </div>
          <span className="catalog-count">{invitationTemplates.length} {t.count}</span>
        </div>

        <div className="catalog-grid">
          {invitationTemplates.map((template, index) => (
            <article className="catalog-card" key={template.id}>
              <Link className="catalog-art-link" href={`/${locale}/templates/${template.id}?category=${category === "all" ? "wedding" : category}`} aria-label={`${t.preview}: ${t.names[index]}`}>
                <div className={`catalog-art-frame template-mini template-mini-${template.id}`}>
                  <InvitationArtwork template={template.id} theme={template.theme}
                    invitationLabel={t.invite} dateCaption={t.date} hosts={hostSample}
                    title={categoryName(category === "all" ? "wedding" : category)}
                    date={dateSample} time="18:00" locationLabel={t.location}
                    venue={lang === "ru" ? "Villa Garden" : "Villa Garden"} address="Tashkent"
                    message={t.note} compact />
                </div>
                <span className="catalog-preview-overlay">{t.preview} <span aria-hidden="true">↗</span></span>
              </Link>
              <div className="catalog-card-body">
                <div className="catalog-card-copy">
                  <span className="catalog-card-index">0{index + 1} / SIGNATURE</span>
                  <h2>{t.names[index]}</h2>
                  <p>{t.descriptions[index]}</p>
                </div>
                <Link className="catalog-use-link" href={`/${locale}/templates/${template.id}?category=${category === "all" ? "wedding" : category}`}>{t.preview} <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
        <p className="catalog-help">{t.chooseHint}</p>
      </section>

      <footer className="catalog-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><span>© {new Date().getFullYear()} Astron · Digital Invitations</span></footer>
    </main>
  );
}
