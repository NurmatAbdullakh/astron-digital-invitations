"use client";

import { useMemo, useState } from "react";

type Locale = "uz" | "ru" | "en";
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
};

const labels = {
  uz: { back: "Bosh sahifa", eyebrow: "ASTRON INVITATION STUDIO", heading: "Taklifnomangizni yarating", intro: "Ma’lumotlarni kiriting — natijani shu zahoti ko‘ring.", event: "Tadbir turi", title: "Tadbir nomi", hosts: "Kim taklif qilmoqda?", date: "Sana", time: "Vaqt", venue: "Maskan nomi", address: "Manzil", message: "Mehmonlarga tilak yoki izoh", theme: "Dizayn rangi", preview: "Jonli ko‘rinish", share: "Havolani yaratish va ulashish", required: "Tadbir nomi va sana kiritilishi kerak", copied: "Havola nusxalandi", copy: "Havolani nusxalash", wedding: "To‘y", birthday: "Tug‘ilgan kun", family: "Oilaviy bayram", corporate: "Korporativ", graduation: "Bitiruv", invitation: "TAKLIF ETAMIZ", dateLabel: "TADBIR SANASI", location: "MANZIL", note: "Sizni kutib qolamiz", placeholder: "Masalan: Aziza va Mirjalolning nikoh oqshomi", hostPlaceholder: "Aziza va Mirjalol", venuePlaceholder: "Navro‘z to‘yxonasi", addressPlaceholder: "Toshkent shahri, ...", messagePlaceholder: "Quvonchimizga sherik bo‘ling!" },
  ru: { back: "Главная", eyebrow: "ASTRON INVITATION STUDIO", heading: "Создайте приглашение", intro: "Заполните детали и сразу увидите результат.", event: "Тип события", title: "Название события", hosts: "Кто приглашает?", date: "Дата", time: "Время", venue: "Название места", address: "Адрес", message: "Пожелание или заметка для гостей", theme: "Цвет дизайна", preview: "Предпросмотр", share: "Создать ссылку и поделиться", required: "Укажите название события и дату", copied: "Ссылка скопирована", copy: "Скопировать ссылку", wedding: "Свадьба", birthday: "День рождения", family: "Семейный праздник", corporate: "Корпоратив", graduation: "Выпускной", invitation: "ПРИГЛАШАЕМ", dateLabel: "ДАТА СОБЫТИЯ", location: "МЕСТО", note: "Будем рады вас видеть", placeholder: "Например: Свадьба Азизы и Мирджалола", hostPlaceholder: "Азиза и Мирджалол", venuePlaceholder: "Ресторан Навруз", addressPlaceholder: "Ташкент, ...", messagePlaceholder: "Разделите с нами этот день!" },
  en: { back: "Home", eyebrow: "ASTRON INVITATION STUDIO", heading: "Create your invitation", intro: "Add your event details and see the preview instantly.", event: "Event type", title: "Event title", hosts: "Who is inviting?", date: "Date", time: "Time", venue: "Venue name", address: "Address", message: "A note for your guests", theme: "Design color", preview: "Live preview", share: "Create link and share", required: "Please add an event title and date", copied: "Link copied", copy: "Copy invitation link", wedding: "Wedding", birthday: "Birthday", family: "Family celebration", corporate: "Corporate", graduation: "Graduation", invitation: "YOU ARE INVITED", dateLabel: "EVENT DATE", location: "LOCATION", note: "We look forward to seeing you", placeholder: "e.g. Aziza & Mirjalol’s wedding", hostPlaceholder: "Aziza & Mirjalol", venuePlaceholder: "Navruz Grand Hall", addressPlaceholder: "Tashkent, ...", messagePlaceholder: "It would mean a lot to celebrate with you!" }
} as const;

const types = ["wedding", "birthday", "family", "corporate", "graduation"] as const;

export default function InvitationBuilder({ locale, initialType }: { locale: Locale; initialType: string }) {
  const t = labels[locale];
  const [form, setForm] = useState<Invitation>({
    type: types.includes(initialType as (typeof types)[number]) ? initialType : "wedding",
    title: "", hosts: "", date: "", time: "18:00", venue: "", address: "", message: "", theme: "sage"
  });
  const [shareUrl, setShareUrl] = useState("");
  const [notice, setNotice] = useState("");
  const dateLabel = useMemo(() => form.date ? new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(form.date + "T12:00:00")) : t.dateLabel, [form.date, locale, t.dateLabel]);

  function update<K extends keyof Invitation>(key: K, value: Invitation[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setShareUrl("");
    setNotice("");
  }

  async function createLink() {
    if (!form.title.trim() || !form.date) {
      setNotice(t.required);
      return;
    }
    const url = new URL(`/${locale}/invite`, window.location.origin);
    url.searchParams.set("data", JSON.stringify(form));
    setShareUrl(url.toString());
    try {
      if (navigator.share) await navigator.share({ title: form.title, text: form.message || t.note, url: url.toString() });
      else {
        await navigator.clipboard.writeText(url.toString());
        setNotice(t.copied);
      }
    } catch {
      setNotice("");
    }
  }

  return (
    <main className="builder-page">
      <header className="site-header builder-header">
        <a className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></a>
        <a className="builder-back" href={`/${locale}`}>← {t.back}</a>
      </header>
      <div className="builder-intro"><p className="eyebrow">{t.eyebrow}</p><h1>{t.heading}</h1><p>{t.intro}</p></div>
      <div className="builder-layout">
        <section className="builder-form">
          <label>{t.event}<select value={form.type} onChange={(e) => update("type", e.target.value)}>{types.map((type) => <option value={type} key={type}>{t[type]}</option>)}</select></label>
          <label>{t.title}<input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={t.placeholder} maxLength={90} required /></label>
          <label>{t.hosts}<input value={form.hosts} onChange={(e) => update("hosts", e.target.value)} placeholder={t.hostPlaceholder} maxLength={70} /></label>
          <div className="builder-fields"><label>{t.date}<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required /></label><label>{t.time}<input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} /></label></div>
          <label>{t.venue}<input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder={t.venuePlaceholder} maxLength={80} /></label>
          <label>{t.address}<input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder={t.addressPlaceholder} maxLength={140} /></label>
          <label>{t.message}<textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={t.messagePlaceholder} rows={3} maxLength={220} /></label>
          <fieldset><legend>{t.theme}</legend><div className="theme-options">{(["sage", "rose", "sand"] as const).map((theme) => <button type="button" key={theme} aria-label={theme} aria-pressed={form.theme === theme} className={`theme-swatch swatch-${theme} ${form.theme === theme ? "selected" : ""}`} onClick={() => update("theme", theme)} />)}</div></fieldset>
          <button className="button button-primary builder-submit" type="button" onClick={createLink}>{t.share}<span aria-hidden="true">↗</span></button>
          {notice && <p className="builder-notice" role="status">{notice}</p>}
          {shareUrl && <div className="share-result"><p>{shareUrl}</p><button type="button" onClick={async () => { await navigator.clipboard.writeText(shareUrl); setNotice(t.copied); }}>{t.copy}</button></div>}
        </section>
        <aside className="preview-column"><p className="eyebrow">{t.preview}</p><div className={`invitation-preview preview-${form.theme}`}><span className="preview-flower">✳</span><span className="preview-kicker">{t.invitation}</span><h2>{form.hosts || form.title || "Aziza & Mirjalol"}</h2><span className="preview-rule">✧</span><p className="preview-title">{form.title || t[form.type as keyof typeof t]}</p><strong>{dateLabel}</strong><span>{form.time || "18:00"}</span><div className="preview-location"><b>{t.location}</b><span>{form.venue || "Navruz Grand Hall"}</span><small>{form.address || "Tashkent, Uzbekistan"}</small></div><p className="preview-message">{form.message || t.note}</p></div><p className="preview-footnote">Astron · Digital invitations</p></aside>
      </div>
    </main>
  );
}
