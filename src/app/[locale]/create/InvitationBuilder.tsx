"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInvitationTemplate,
  invitationTemplates,
  isInvitationTemplateId,
  type InvitationTemplateId,
} from "@/lib/invitations/templates";

type Locale = "uz" | "ru" | "en";
type Invitation = {
  type: string;
  template: InvitationTemplateId;
  title: string;
  hosts: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
};

const labels = {
  uz: {
    back: "Bosh sahifa", eyebrow: "TAKLIFNOMA STUDIYASI", heading: "Taklifnomangizni yarating",
    intro: "Shablonni tanlang, ma’lumotlarni kiriting va natijani darhol ko‘ring.",
    event: "Tadbir turi", title: "Tadbir nomi", hosts: "Kim taklif qilmoqda?", date: "Sana",
    time: "Vaqt", venue: "Maskan nomi", address: "Manzil", message: "Mehmonlarga izoh",
    templates: "Shablonlar", preview: "Jonli ko‘rinish", edit: "Tahrirlash", previewTab: "Ko‘rish",
    save: "Qoralamani saqlash", saved: "Qoralama shu qurilmada saqlandi", restored: "Saqlangan qoralama tiklandi",
    share: "Havolani yaratish", required: "Tadbir nomi va sanani kiriting", copied: "Havola nusxalandi",
    copy: "Havolani nusxalash", shareReady: "Taklifnoma havolasi tayyor", draftError: "Qoralamani saqlab bo‘lmadi",
    wedding: "To‘y", birthday: "Tug‘ilgan kun", family: "Oilaviy bayram", corporate: "Korporativ", graduation: "Bitiruv",
    invitation: "TAKLIF ETAMIZ", dateLabel: "TADBIR SANASI", location: "MANZIL", note: "Sizni kutib qolamiz",
    placeholder: "Masalan: Aziza va Mirjalolning nikoh oqshomi", hostPlaceholder: "Aziza va Mirjalol",
    venuePlaceholder: "Navro‘z to‘yxonasi", addressPlaceholder: "Toshkent shahri, ...",
    messagePlaceholder: "Quvonchimizga sherik bo‘ling!", templateNames: ["Botanika", "Editorial", "Minimal"],
    templateDescriptions: ["Nafis va tabiiy", "Zamonaviy va dadil", "Sodda va ixcham"],
    savedLocal: "Qoralama faqat shu brauzerda saqlanadi.",
  },
  ru: {
    back: "Главная", eyebrow: "СТУДИЯ ПРИГЛАШЕНИЙ", heading: "Создайте приглашение",
    intro: "Выберите шаблон, добавьте детали и сразу посмотрите результат.",
    event: "Тип события", title: "Название события", hosts: "Кто приглашает?", date: "Дата",
    time: "Время", venue: "Название места", address: "Адрес", message: "Заметка для гостей",
    templates: "Шаблоны", preview: "Предпросмотр", edit: "Редактировать", previewTab: "Просмотр",
    save: "Сохранить черновик", saved: "Черновик сохранён на этом устройстве", restored: "Черновик восстановлен",
    share: "Создать ссылку", required: "Укажите название события и дату", copied: "Ссылка скопирована",
    copy: "Скопировать ссылку", shareReady: "Ссылка на приглашение готова", draftError: "Не удалось сохранить черновик",
    wedding: "Свадьба", birthday: "День рождения", family: "Семейный праздник", corporate: "Корпоратив", graduation: "Выпускной",
    invitation: "ПРИГЛАШАЕМ ВАС", dateLabel: "ДАТА СОБЫТИЯ", location: "МЕСТО", note: "Будем рады вас видеть",
    placeholder: "Например: Свадьба Азизы и Мирджалола", hostPlaceholder: "Азиза и Мирджалол",
    venuePlaceholder: "Ресторан Навруз", addressPlaceholder: "Ташкент, ...",
    messagePlaceholder: "Разделите с нами этот день!", templateNames: ["Ботаника", "Editorial", "Минимализм"],
    templateDescriptions: ["Нежный и природный", "Современный и выразительный", "Просто и лаконично"],
    savedLocal: "Черновик хранится только в этом браузере.",
  },
  en: {
    back: "Home", eyebrow: "INVITATION STUDIO", heading: "Create your invitation",
    intro: "Choose a template, add your details and see the result instantly.",
    event: "Event type", title: "Event title", hosts: "Who is inviting?", date: "Date",
    time: "Time", venue: "Venue name", address: "Address", message: "A note for your guests",
    templates: "Templates", preview: "Live preview", edit: "Edit details", previewTab: "Preview",
    save: "Save draft", saved: "Draft saved on this device", restored: "Saved draft restored",
    share: "Create share link", required: "Please add an event title and date", copied: "Link copied",
    copy: "Copy invitation link", shareReady: "Your invitation link is ready", draftError: "Could not save this draft",
    wedding: "Wedding", birthday: "Birthday", family: "Family celebration", corporate: "Corporate", graduation: "Graduation",
    invitation: "YOU ARE INVITED", dateLabel: "EVENT DATE", location: "LOCATION", note: "We look forward to seeing you",
    placeholder: "e.g. Aziza & Mirjalol’s wedding", hostPlaceholder: "Aziza & Mirjalol",
    venuePlaceholder: "Navruz Grand Hall", addressPlaceholder: "Tashkent, ...",
    messagePlaceholder: "It would mean a lot to celebrate with you!", templateNames: ["Botanical", "Editorial", "Minimal"],
    templateDescriptions: ["Soft and natural", "Modern and bold", "Simple and clean"],
    savedLocal: "Drafts are stored in this browser only.",
  },
} as const;

const types = ["wedding", "birthday", "family", "corporate", "graduation"] as const;
const emptyInvitation = (type: string): Invitation => ({
  type: types.includes(type as (typeof types)[number]) ? type : "wedding",
  template: "botanical", title: "", hosts: "", date: "", time: "18:00", venue: "", address: "", message: "",
});

export default function InvitationBuilder({ locale, initialType, initialTemplate }: {
  locale: Locale;
  initialType: string;
  initialTemplate?: string;
}) {
  const t = labels[locale];
  const [form, setForm] = useState<Invitation>(() => ({
    ...emptyInvitation(initialType),
    template: isInvitationTemplateId(initialTemplate) ? initialTemplate : "botanical",
  }));
  const [shareUrl, setShareUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [activeView, setActiveView] = useState<"edit" | "preview">("edit");
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`astron:invitation-draft:${locale}`);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const candidate = parsed as Partial<Invitation>;
          if (typeof candidate.title === "string" && typeof candidate.type === "string") {
            setForm({
              ...emptyInvitation(candidate.type),
              ...candidate,
              template: isInvitationTemplateId(initialTemplate) ? initialTemplate : isInvitationTemplateId(candidate.template) ? candidate.template : "botanical",
            });
            setNotice(t.restored);
          }
        }
      }
    } catch {
      // Ignore unavailable or malformed local drafts and keep the clean builder.
    } finally {
      setDraftLoaded(true);
    }
  }, [initialTemplate, initialType, locale, t.restored]);

  const dateLabel = useMemo(() => {
    if (!form.date) return t.dateLabel;
    const date = new Date(`${form.date}T12:00:00`);
    if (Number.isNaN(date.getTime())) return t.dateLabel;
    return new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    }).format(date);
  }, [form.date, locale, t.dateLabel]);

  const selectedTemplate = getInvitationTemplate(form.template);\n  const eventName = form.type === "birthday" ? t.birthday : form.type === "family" ? t.family : form.type === "corporate" ? t.corporate : form.type === "graduation" ? t.graduation : t.wedding;

  function update<K extends keyof Invitation>(key: K, value: Invitation[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setShareUrl("");
    setNotice("");
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(`astron:invitation-draft:${locale}`, JSON.stringify(form));
      setNotice(t.saved);
    } catch {
      setNotice(t.draftError);
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.copied);
    } catch {
      setNotice(url);
    }
  }

  async function createLink() {
    if (!form.title.trim() || !form.date) {
      setNotice(t.required);
      setActiveView("edit");
      return;
    }
    const url = new URL(`/${locale}/invite`, window.location.origin);
    url.searchParams.set("data", JSON.stringify({ ...form, theme: selectedTemplate.theme }));
    if (url.toString().length > 5000) {
      setNotice(locale === "uz" ? "Ma’lumotlar hajmi juda katta. Matnni qisqartiring." : locale === "ru" ? "Слишком много данных. Сократите текст." : "Invitation is too large. Please shorten the text.");
      return;
    }
    setShareUrl(url.toString());
    setNotice(t.shareReady);
    if (navigator.share) {
      try {
        await navigator.share({ title: form.title, text: form.message || t.note, url: url.toString() });
      } catch {
        // The URL remains visible so users can still copy it after dismissing the share sheet.
      }
    } else {
      await copyLink(url.toString());
    }
  }

  return (
    <main className="builder-page">
      <header className="site-header builder-header">
        <a className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></a>
        <a className="builder-back" href={`/${locale}`}>← {t.back}</a>
      </header>

      <section className="builder-intro">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.intro}</p>
      </section>

      <div className="studio-toolbar" role="tablist" aria-label={t.preview}>
        <button type="button" role="tab" aria-selected={activeView === "edit"} className={activeView === "edit" ? "active" : ""} onClick={() => setActiveView("edit")}>{t.edit}</button>
        <button type="button" role="tab" aria-selected={activeView === "preview"} className={activeView === "preview" ? "active" : ""} onClick={() => setActiveView("preview")}>{t.previewTab}</button>
      </div>

      <div className={`builder-layout studio-layout view-${activeView}`}>
        <section className="builder-form" aria-label={t.edit}>
          <div className="studio-section-heading"><div><p className="eyebrow">{t.templates}</p><h2>{t.templates}</h2></div><span>0{invitationTemplates.length}</span></div>
          <div className="template-picker">
            {invitationTemplates.map((template, index) => (
              <button type="button" key={template.id} className={`template-choice ${form.template === template.id ? "selected" : ""}`}
                aria-pressed={form.template === template.id} onClick={() => update("template", template.id)}>
                <span className={`template-mini template-mini-${template.id}`} aria-hidden="true">
                  <i>{template.marker}</i><b>{form.hosts || "A & M"}</b><small>12 · 06 · 2027</small>
                </span>
                <span className="template-choice-copy"><strong>{t.templateNames[index]}</strong><small>{t.templateDescriptions[index]}</small></span>
                {form.template === template.id && <span className="template-check" aria-label="Selected">✓</span>}
              </button>
            ))}
          </div>

          <div className="studio-section-heading details-heading"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.event}</h2></div></div>
          <label>{t.event}
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              {types.map((type) => <option value={type} key={type}>{t[type]}</option>)}
            </select>
          </label>
          <label>{t.title}
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={t.placeholder} maxLength={90} required />
          </label>
          <label>{t.hosts}
            <input value={form.hosts} onChange={(e) => update("hosts", e.target.value)} placeholder={t.hostPlaceholder} maxLength={70} />
          </label>
          <div className="builder-fields">
            <label>{t.date}<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required /></label>
            <label>{t.time}<input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} /></label>
          </div>
          <label>{t.venue}<input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder={t.venuePlaceholder} maxLength={80} /></label>
          <label>{t.address}<input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder={t.addressPlaceholder} maxLength={140} /></label>
          <label>{t.message}<textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={t.messagePlaceholder} rows={3} maxLength={220} /></label>
          <p className="draft-hint">{t.savedLocal}</p>
          {draftLoaded && notice && <p className="builder-notice" role="status">{notice}</p>}
          {shareUrl && <div className="share-result"><p>{t.shareReady}</p><a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a><button type="button" onClick={() => void copyLink(shareUrl)}>{t.copy}</button></div>}
        </section>

        <aside className="preview-column" aria-label={t.preview}>
          <div className="preview-panel-heading"><p className="eyebrow">{t.preview}</p><span>LIVE</span></div>
          <div className={`invitation-preview preview-${selectedTemplate.theme} invitation-${form.template}`}>
            <span className="preview-flower">{selectedTemplate.marker}</span>
            <span className="preview-kicker">{t.invitation}</span>
            <h2>{form.hosts || form.title || "Aziza & Mirjalol"}</h2>
            <span className="preview-rule">✧</span>
            <p className="preview-title">{form.title || eventName}</p>
            <strong>{dateLabel}</strong>
            <span>{form.time || "18:00"}</span>
            <div className="preview-location"><b>{t.location}</b><span>{form.venue || "Navruz Grand Hall"}</span><small>{form.address || "Tashkent, Uzbekistan"}</small></div>
            <p className="preview-message">{form.message || t.note}</p>
          </div>
          <p className="preview-footnote">Astron · Digital invitations</p>
        </aside>
      </div>

      <div className="studio-bottom-bar">
        <button className="studio-save" type="button" onClick={saveDraft}>{t.save}</button>
        <button className="button button-primary studio-share" type="button" onClick={() => void createLink()}>{t.share}<span aria-hidden="true">↗</span></button>
      </div>
    </main>
  );
}
