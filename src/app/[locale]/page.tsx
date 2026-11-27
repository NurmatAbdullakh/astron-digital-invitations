import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.uz";

const copy = {
  uz: {
    title: "Har bir taklif — unutilmas taassurot",
    description: "To‘y, tug‘ilgan kun va oilaviy bayramlar uchun zamonaviy raqamli taklifnomalar. Dizaynni tanlang, ma’lumotlarni kiriting va mehmonlaringizga yuboring.",
    eyebrow: "MUHIM KUNLAR UCHUN",
    headline: "Taklifnomangiz ham bayramingiz kabi go‘zal bo‘lsin",
    intro: "Bir necha daqiqada o‘zingizga xos raqamli taklifnoma yarating. Chiroyli dizayn, barcha muhim ma’lumotlar va mehmonlar uchun qulay havola — bir joyda.",
    cta: "Taklifnomalarni ko‘rish",
    secondary: "Qanday ishlaydi?",
    eventsTitle: "Har qanday tadbir uchun",
    eventsIntro: "Bayramingizga mos uslubni tanlang — qolganini oson hal qilamiz.",
    stepsTitle: "Uch qadamda tayyor",
    steps: [["Dizayn tanlang", "Tadbir kayfiyatiga mos shablonni tanlang."], ["Ma’lumot kiriting", "Sana, manzil va shaxsiy tilaklaringizni qo‘shing."], ["Ulashib yuboring", "Tayyor taklifnomani havola orqali mehmonlarga yuboring."]],
    footer: "Yaxshi kunlar chiroyli taklifdan boshlanadi."
  },
  ru: {
    title: "Цифровые приглашения для особенных событий",
    description: "Создавайте современные цифровые приглашения на свадьбу, день рождения и семейные праздники. Выберите дизайн, добавьте детали и отправьте гостям.",
    eyebrow: "ДЛЯ ВАЖНЫХ МОМЕНТОВ",
    headline: "Пусть ваше приглашение будет таким же прекрасным, как праздник",
    intro: "Создайте персональное цифровое приглашение за несколько минут. Элегантный дизайн, важная информация и удобная ссылка для гостей — в одном месте.",
    cta: "Смотреть приглашения",
    secondary: "Как это работает?",
    eventsTitle: "Для любого события",
    eventsIntro: "Выберите стиль для своего праздника — остальное просто.",
    stepsTitle: "Готово за три шага",
    steps: [["Выберите дизайн", "Подберите шаблон под настроение события."], ["Добавьте детали", "Укажите дату, место и личное пожелание."], ["Поделитесь", "Отправьте готовое приглашение гостям по ссылке."]],
    footer: "Хорошие моменты начинаются с красивого приглашения."
  },
  en: {
    title: "Digital invitations for life's special moments",
    description: "Create beautiful digital invitations for weddings, birthdays and family celebrations. Choose a design, add event details and share with guests.",
    eyebrow: "MADE FOR MEANINGFUL MOMENTS",
    headline: "An invitation as special as the day itself",
    intro: "Create a personal digital invitation in minutes. Thoughtful designs, all the important details and one easy link to share with your guests.",
    cta: "Explore invitations",
    secondary: "How it works",
    eventsTitle: "Made for every occasion",
    eventsIntro: "Find a style that feels right for your celebration.",
    stepsTitle: "Ready in three simple steps",
    steps: [["Choose a design", "Pick a template that fits your event."], ["Add your details", "Include the date, venue and a personal note."], ["Share with guests", "Send your finished invitation with one link."]],
    footer: "Every beautiful day deserves a beautiful invitation."
  }
} as const;

const eventItems = [
  { slug: "wedding", icon: "✳", name: { uz: "To‘y", ru: "Свадьба", en: "Wedding" } },
  { slug: "birthday", icon: "✷", name: { uz: "Tug‘ilgan kun", ru: "День рождения", en: "Birthday" } },
  { slug: "family", icon: "♡", name: { uz: "Oilaviy bayram", ru: "Семейный праздник", en: "Family celebration" } },
  { slug: "corporate", icon: "◇", name: { uz: "Korporativ", ru: "Корпоратив", en: "Corporate" } },
  { slug: "graduation", icon: "✧", name: { uz: "Bitiruv", ru: "Выпускной", en: "Graduation" } }
] as const;

type Locale = keyof typeof copy;

export function generateStaticParams() {
  return Object.keys(copy).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!(rawLocale in copy)) return {};
  const locale = rawLocale as Locale;
  const data = copy[locale];
  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: "/uz",
        ru: "/ru",
        en: "/en",
        "x-default": "/uz"
      }
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `/${locale}`,
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website"
    }
  };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!(rawLocale in copy)) notFound();
  const locale = rawLocale as Locale;
  const data = copy[locale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Astron Digital Invitations",
    url: siteUrl,
    inLanguage: ["uz", "ru", "en"],
    description: data.description
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="site-header">
        <Link className="brand" href={`/${locale}`} aria-label="Astron home"><span className="brand-mark">a.</span><span>astron</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#occasions">{data.eventsTitle}</a>
          <a href="#how-it-works">{data.secondary}</a>
        </nav>
        <div className="locale-switch" aria-label="Language">
          {(["uz", "ru", "en"] as const).map((item) => <Link key={item} aria-current={locale === item ? "page" : undefined} href={`/${item}`}>{item.toUpperCase()}</Link>)}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span />{data.eyebrow}</p>
          <h1>{data.headline}</h1>
          <p className="hero-description">{data.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/templates`}>{data.cta}<span aria-hidden="true">↗</span></Link>
            <a className="button button-quiet" href="#how-it-works">{data.secondary}<span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note"><span className="note-icon">✳</span><span>{data.footer}</span></div>
        </div>
        <div className="hero-art" aria-label="Decorative preview of a digital wedding invitation">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="invite-card invite-back"><span className="invite-small">SAVE THE DATE</span><span className="invite-script">A & M</span><span className="invite-date">12 · 06 · 2027</span></div>
          <div className="invite-card invite-front">
            <span className="invite-kicker">YOU ARE INVITED</span>
            <span className="invite-script">Aziza <i>&</i> Mirjalol</span>
            <span className="invite-divider">✳</span>
            <span className="invite-detail">12 IYUN · 2027</span>
            <span className="invite-location">TOSHKENT, O‘ZBEKISTON</span>
          </div>
          <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✧</span><span className="art-spark spark-three">✳</span>
          <div className="art-caption">A little moment, beautifully shared.</div>
        </div>
      </section>

      <section className="occasion-section section-wrap" id="occasions">
        <div className="section-heading"><div><p className="eyebrow">YOUR MOMENT, YOUR STYLE</p><h2>{data.eventsTitle}</h2></div><p>{data.eventsIntro}</p></div>
        <div className="occasion-grid">
          {eventItems.map((item, index) => <Link className="occasion-card" href={`/${locale}/${item.slug}`} key={item.slug}><span className="occasion-index">0{index + 1}</span><span className="occasion-icon">{item.icon}</span><span className="occasion-name">{item.name[locale]}</span><span className="occasion-arrow">↗</span></Link>)}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-wrap">
          <div className="section-heading"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2>{data.stepsTitle}</h2></div></div>
          <div className="steps-grid">{data.steps.map(([title, description], index) => <article className="step-card" key={title}><span className="step-number">0{index + 1}</span><div className="step-line" /><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <footer className="site-footer"><Link className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></Link><p>{data.footer}</p><span>© {new Date().getFullYear()} Astron</span></footer>
    </main>
  );
}
