import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { invitationTemplates } from "@/lib/invitations/templates";

const data = {
  uz: { title: "Taklifnoma shablonlari", description: "Tadbiringiz uchun sodda, zamonaviy raqamli taklifnoma dizaynini tanlang.", intro: "Sizga mos uslubni tanlang", body: "Har bir shablonni tanlashdan oldin ko‘rib chiqing. Keyin tadbir ma’lumotlarini qo‘shib, o‘zingizga moslang.", back: "Bosh sahifa", create: "Shu shablonni tanlash", category: "Tadbir turi", names: ["To‘y", "Tug‘ilgan kun", "Oilaviy bayram", "Korporativ", "Bitiruv"], selected: "Tanlash" },
  ru: { title: "Шаблоны приглашений", description: "Выберите лаконичный современный дизайн цифрового приглашения.", intro: "Выберите свой стиль", body: "Посмотрите каждый шаблон перед выбором. Затем добавьте детали события и настройте приглашение.", back: "Главная", create: "Выбрать шаблон", category: "Тип события", names: ["Свадьба", "День рождения", "Семейный праздник", "Корпоратив", "Выпускной"], selected: "Выбрать" },
  en: { title: "Invitation templates", description: "Choose a clean, modern digital invitation design for your event.", intro: "Choose a style that feels right", body: "Preview each template before choosing. Add your event details and make the invitation your own.", back: "Home", create: "Use this template", category: "Event type", names: ["Wedding", "Birthday", "Family celebration", "Corporate", "Graduation"], selected: "Choose" },
} as const;

const categories = ["wedding", "birthday", "family", "corporate", "graduation"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in data)) return {};
  const item = data[locale as keyof typeof data];
  return { title: item.title, description: item.description, alternates: { canonical: `/${locale}/templates`, languages: { uz: "/uz/templates", ru: "/ru/templates", en: "/en/templates" } }, openGraph: { title: item.title, description: item.description, type: "website" } };
}

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in data)) notFound();
  const lang = locale as keyof typeof data;
  const item = data[lang];
  const templateNames = {
    uz: ["Botanika", "Editorial", "Minimal"],
    ru: ["Ботаника", "Editorial", "Минимализм"],
    en: ["Botanical", "Editorial", "Minimal"],
  }[lang];
  const templateDescriptions = {
    uz: ["Nafis, tabiiy va sokin", "Zamonaviy tipografika", "Sodda va ixcham"],
    ru: ["Нежный природный стиль", "Современная типографика", "Просто и лаконично"],
    en: ["Soft, natural and calm", "Modern typography", "Simple and compact"],
  }[lang];
  return (
    <main className="templates-page">
      <header className="site-header">
        <Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link>
        <nav className="main-nav"><Link href={`/${locale}`}>{item.back}</Link><Link href={`/${locale}/create`}>{locale === "ru" ? "Создать" : locale === "en" ? "Create" : "Yaratish"}</Link></nav>
        <div className="locale-switch">{(["uz", "ru", "en"] as const).map((langCode) => <Link key={langCode} href={`/${langCode}/templates`}>{langCode.toUpperCase()}</Link>)}</div>
      </header>
      <section className="templates-hero">
        <p className="eyebrow">ASTRON COLLECTION</p>
        <h1>{item.intro}</h1>
        <p className="hero-description">{item.body}</p>
        <div className="template-gallery">
          {invitationTemplates.map((template, index) => (
            <article className="gallery-card" key={template.id}>
              <div className={`gallery-preview preview-${template.theme} invitation-${template.id}`}>
                <span>{template.marker}</span><small>{locale === "ru" ? "ПРИГЛАШАЕМ ВАС" : locale === "en" ? "YOU ARE INVITED" : "TAKLIF ETAMIZ"}</small>
                <strong>Aziza <i>&</i> Mirjalol</strong><em>12 · 06 · 2027</em>
                <b>{templateNames[index]}</b>
              </div>
              <div className="gallery-card-copy"><div><h2>{templateNames[index]}</h2><p>{templateDescriptions[index]}</p></div><span>0{index + 1}</span></div>
              <div className="gallery-actions">
                <label htmlFor={`event-${template.id}`}>{item.category}</label>
                <select id={`event-${template.id}`} defaultValue="wedding" aria-label={item.category}>
                  {categories.map((category, categoryIndex) => <option key={category} value={category}>{item.names[categoryIndex]}</option>)}
                </select>
                <Link className="button button-primary" href={`/${locale}/create?template=${template.id}`}>{item.create}<span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="site-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><p>{item.description}</p><span>© {new Date().getFullYear()} Astron</span></footer>
    </main>
  );
}
