import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const data = {
  uz: { title: "Taklifnoma shablonlari", description: "Tadbiringiz uchun zamonaviy raqamli taklifnoma dizaynlarini tanlang.", intro: "O‘zingizga mos dizaynni tanlang", body: "Astron shablonlari turli tadbirlar uchun puxta o‘ylangan uslub va qulay taqdimotni birlashtiradi.", back: "Bosh sahifa", categories: [["To‘y", "wedding"], ["Tug‘ilgan kun", "birthday"], ["Oilaviy bayram", "family"], ["Korporativ", "corporate"], ["Bitiruv", "graduation"]] },
  ru: { title: "Шаблоны приглашений", description: "Выберите современный дизайн цифрового приглашения для вашего события.", intro: "Найдите свой стиль", body: "Шаблоны Astron сочетают продуманный дизайн и удобную подачу для разных событий.", back: "Главная", categories: [["Свадьба", "wedding"], ["День рождения", "birthday"], ["Семейный праздник", "family"], ["Корпоратив", "corporate"], ["Выпускной", "graduation"]] },
  en: { title: "Invitation templates", description: "Explore modern digital invitation designs for your special event.", intro: "Find a style that feels like you", body: "Astron templates bring thoughtful design and clear event details together for every occasion.", back: "Home", categories: [["Wedding", "wedding"], ["Birthday", "birthday"], ["Family celebration", "family"], ["Corporate", "corporate"], ["Graduation", "graduation"]] }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in data)) return {};
  const item = data[locale as keyof typeof data];
  return { title: item.title, description: item.description, alternates: { canonical: `/${locale}/templates`, languages: { uz: "/uz/templates", ru: "/ru/templates", en: "/en/templates" } }, openGraph: { title: item.title, description: item.description, type: "website" } };
}

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in data)) notFound();
  const item = data[locale as keyof typeof data];
  return <main><header className="site-header"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><nav className="main-nav"><Link href={`/${locale}`}>{item.back}</Link><Link href={`/${locale}/create`}>{locale === "ru" ? "Создать" : locale === "en" ? "Create" : "Yaratish"}</Link></nav><div className="locale-switch">{(["uz", "ru", "en"] as const).map((lang) => <Link key={lang} href={`/${lang}/templates`}>{lang.toUpperCase()}</Link>)}</div></header><section className="category-hero"><p className="eyebrow">ASTRON COLLECTION</p><h1>{item.intro}</h1><p className="hero-description">{item.body}</p><div className="template-list">{item.categories.map(([name, slug], index) => <Link className="template-row" key={slug} href={`/${locale}/${slug}`}><span>0{index + 1}</span><strong>{name}</strong><span aria-hidden="true">↗</span></Link>)}</div></section><footer className="site-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><p>{item.description}</p><span>© {new Date().getFullYear()} Astron</span></footer></main>;
}
