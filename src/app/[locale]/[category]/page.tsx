import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.uz";
const content = {
  wedding: {
    uz: ["To‘y taklifnomalari", "Eng muhim kuningizni yaqinlaringiz bilan chiroyli raqamli taklifnoma orqali baham ko‘ring.", "Nikoh oqshomingiz uchun nafis dizaynlar, tadbir sanasi, manzil va mehmonlar uchun barcha kerakli ma’lumotlar."],
    ru: ["Свадебные приглашения", "Поделитесь самым важным днём с близкими с помощью красивого цифрового приглашения.", "Элегантные дизайны, дата, место проведения и вся важная информация для гостей."],
    en: ["Wedding invitations", "Share your special day with the people you love through a beautiful digital invitation.", "Elegant designs, event date, venue details and everything your guests need to know."]
  },
  birthday: {
    uz: ["Tug‘ilgan kun taklifnomalari", "Yangi yoshingizni o‘zgacha uslubdagi taklifnoma bilan nishonlang.", "Quvnoq va zamonaviy dizaynlar orqali mehmonlaringizga bayram kayfiyatini ulashing."],
    ru: ["Приглашения на день рождения", "Отметьте новый год жизни с приглашением в особенном стиле.", "Яркие и современные дизайны, которые помогут передать настроение вашего праздника."],
    en: ["Birthday invitations", "Celebrate another year with an invitation that feels uniquely yours.", "Fresh, modern designs to share the excitement of your celebration with guests."]
  },
  family: {
    uz: ["Oilaviy bayram taklifnomalari", "Qadrli insonlaringiz bilan unutilmas lahzalarni birga nishonlang.", "Oilaviy yig‘inlar, yubileylar va samimiy uchrashuvlar uchun taklifnomalar."],
    ru: ["Приглашения на семейные праздники", "Разделите особенные моменты с самыми близкими людьми.", "Приглашения для семейных встреч, юбилеев и тёплых торжеств."],
    en: ["Family celebration invitations", "Celebrate meaningful moments with the people closest to you.", "Invitations for family gatherings, anniversaries and special get-togethers."]
  },
  corporate: {
    uz: ["Korporativ taklifnomalar", "Hamkasblar va hamkorlarni professional uslubda taklif qiling.", "Kompaniya tadbirlari, konferensiyalar va jamoaviy bayramlar uchun ixcham taklifnomalar."],
    ru: ["Корпоративные приглашения", "Приглашайте коллег и партнёров в профессиональном стиле.", "Приглашения для мероприятий компании, конференций и командных праздников."],
    en: ["Corporate invitations", "Invite colleagues and partners with a polished, professional touch.", "Thoughtful invitations for company events, conferences and team celebrations."]
  },
  graduation: {
    uz: ["Bitiruv taklifnomalari", "Yangi bosqich boshlanishini do‘stlar va yaqinlar bilan nishonlang.", "Bitiruv marosimi va tantanali uchrashuvlar uchun esda qolarli taklifnomalar."],
    ru: ["Приглашения на выпускной", "Отпразднуйте начало нового этапа вместе с друзьями и близкими.", "Запоминающиеся приглашения на выпускные церемонии и торжества."],
    en: ["Graduation invitations", "Celebrate a new chapter with friends and family.", "Memorable invitations for graduation ceremonies and celebrations."]
  }
} as const;

const locales = ["uz", "ru", "en"] as const;
const categories = Object.keys(content) as (keyof typeof content)[];

export function generateStaticParams() {
  return locales.flatMap((locale) => categories.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  if (!locales.includes(locale as (typeof locales)[number]) || !categories.includes(category as keyof typeof content)) return {};
  const item = content[category as keyof typeof content][locale as keyof typeof content.wedding];
  return {
    title: item[0],
    description: item[1],
    alternates: {
      canonical: `/${locale}/${category}`,
      languages: Object.fromEntries(locales.map((lang) => [lang, `/${lang}/${category}`]))
    },
    openGraph: { title: item[0], description: item[1], url: `/${locale}/${category}`, type: "website" }
  };
}

export default async function EventCategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  if (!locales.includes(locale as (typeof locales)[number]) || !categories.includes(category as keyof typeof content)) notFound();
  const item = content[category as keyof typeof content][locale as keyof typeof content.wedding];
  const home = locale === "ru" ? "Главная" : locale === "en" ? "Home" : "Bosh sahifa";
  const catalog = locale === "ru" ? "Смотреть шаблоны" : locale === "en" ? "Explore templates" : "Shablonlarni ko‘rish";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item[0],
    description: item[1],
    provider: { "@type": "Organization", name: "Astron", url: siteUrl },
    areaServed: "UZ"
  };
  return (
    <main className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="site-header"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><nav className="main-nav"><Link href={`/${locale}`}>{home}</Link><Link href={`/${locale}/templates`}>{catalog}</Link></nav><div className="locale-switch">{locales.map((lang) => <Link key={lang} href={`/${lang}/${category}`}>{lang.toUpperCase()}</Link>)}</div></header>
      <section className="category-hero"><p className="eyebrow">ASTRON DIGITAL INVITATIONS</p><h1>{item[0]}</h1><p className="hero-description">{item[1]}</p><div className="category-panel"><span className="category-flower">✳</span><p>{item[2]}</p><Link className="button button-primary" href={`/${locale}/templates`}>{catalog}<span aria-hidden="true">↗</span></Link></div></section>
      <footer className="site-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><p>{item[1]}</p><span>© {new Date().getFullYear()} Astron</span></footer>
    </main>
  );
}
