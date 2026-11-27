import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { invitationTemplates } from "@/lib/invitations/templates";

const data = {
  uz: { title: "Taklifnoma shablonlari", description: "Muhim kuningiz uchun nafis, esda qolarli va o‘ziga xos raqamli taklifnomani tanlang.", intro: "Har bir lahzaga munosib dizayn", body: "Nafis kompozitsiyalar, chiroyli tipografika va mayda detallargacha o‘ylangan uslublar. O‘zingizga yoqqanini tanlang — taklifnomangizni jonli ko‘rinishda darhol sozlang.", back: "Bosh sahifa", create: "Shu shablonni tanlash", category: "Tadbir turi", names: ["To‘y", "Tug‘ilgan kun", "Oilaviy bayram", "Korporativ", "Bitiruv"], selected: "Tanlash" },
  ru: { title: "Шаблоны приглашений", description: "Выберите элегантное цифровое приглашение, которое задаст настроение вашему особому дню.", intro: "Дизайн для особенных мгновений", body: "Элегантные композиции, выразительная типографика и внимание к каждой детали. Выберите стиль и сразу настройте своё приглашение.", back: "Главная", create: "Выбрать шаблон", category: "Тип события", names: ["Свадьба", "День рождения", "Семейный праздник", "Корпоратив", "Выпускной"], selected: "Выбрать" },
  en: { title: "Invitation templates", description: "Discover an elegant digital invitation that sets the mood for your special day.", intro: "Choose a style that feels right", body: "Preview each template before choosing. Add your event details and make the invitation your own.", back: "Home", create: "Use this template", category: "Event type", names: ["Wedding", "Birthday", "Family celebration", "Corporate", "Graduation"], selected: "Choose" },
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
    uz: ["Nozik gullar va romantik kayfiyat", "Hashamatli klassika va nafislik", "Zamonaviy uslub va dadil tipografika"],
    ru: ["Нежные цветы и романтика", "Роскошь классики и элегантность", "Современный стиль и выразительная типографика"],
    en: ["Delicate florals and romance", "Timeless luxury and elegance", "Modern style and expressive type"],
  }[lang];
  return (
    <main className="templates-page">
      <header className="site-header">
        <Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link>
        <nav className="main-nav"><Link href={`/${locale}`}>{item.back}</Link><Link href={`/${locale}/create`}>{locale === "ru" ? "Создать" : locale === "en" ? "Create" : "Yaratish"}</Link></nav>
        <div className="locale-switch">{(["uz", "ru", "en"] as const).map((langCode) => <Link key={langCode} href={`/${langCode}/templates`}>{langCode.toUpperCase()}</Link>)}</div>
      </header>
      <section className="templates-hero">
        <p className="eyebrow">✦ &nbsp; ASTRON SIGNATURE COLLECTION</p>
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
              <form className="gallery-actions" action={`/${locale}/create`}>
                <label htmlFor={`event-${template.id}`}>{item.category}</label>
                <select id={`event-${template.id}`} name="type" defaultValue="wedding" aria-label={item.category}>
                  {categories.map((category, categoryIndex) => <option key={category} value={category}>{item.names[categoryIndex]}</option>)}
                </select>
                <input type="hidden" name="template" value={template.id} />
                <button className="button button-primary" type="submit">{item.create}<span aria-hidden="true">↗</span></button>
              </form>
            </article>
          ))}
        </div>
      </section>
      <footer className="site-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><p>{item.description}</p><span>© {new Date().getFullYear()} Astron</span></footer>
    </main>
  );
}
