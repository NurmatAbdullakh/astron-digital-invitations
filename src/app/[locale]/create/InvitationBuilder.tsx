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
  type: string; template: InvitationTemplateId; title: string; hosts: string;
  date: string; time: string; venue: string; address: string; message: string;
};

const labels = {
  uz: {
    back: "Orqaga", eyebrow: "ASTRON INVITATION STUDIO", heading: "Unutilmas lahzalar uchun o‘zgacha taklifnoma",
    intro: "Bir necha daqiqada o‘zingizga xos taklifnoma yarating. Dizaynni tanlang, ma’lumotlarni kiriting — qolganini Astron chiroyli ko‘rsatadi.",
    step1: "Dizaynni tanlang", step2: "Tadbir ma’lumotlari", step3: "Tayyor taklifnoma",
    stepHint: "O‘zingizga yoqqan uslubni tanlang. Keyin istalgan vaqtda almashtirishingiz mumkin.",
    event: "Tadbir turi", title: "Taklifnoma sarlavhasi", hosts: "Kimning bayrami?", date: "Sana",
    time: "Boshlanish vaqti", venue: "Tadbir maskani", address: "To‘liq manzil", message: "Mehmonlarga tilak yoki izoh",
    templates: "Dizayn kolleksiyasi", preview: "Jonli ko‘rinish", edit: "Tahrirlash", previewTab: "Ko‘rish",
    save: "Saqlab qo‘yish", saved: "Qoralama ushbu qurilmada saqlandi", restored: "Qoralamangiz qayta tiklandi",
    share: "Taklifnomani ulashish", required: "Taklifnoma nomi va sanasini kiriting", copied: "Havola nusxalandi",
    copy: "Havolani nusxalash", shareReady: "Taklifnomangiz tayyor!", draftError: "Saqlash imkoni bo‘lmadi",
    wedding: "To‘y", birthday: "Tug‘ilgan kun", family: "Oilaviy bayram", corporate: "Korporativ", graduation: "Bitiruv",
    invitation: "SIZNI TAKLIF ETAMIZ", dateLabel: "BAХTLI KUNIMIZ", location: "MANZIL", note: "Sizni ushbu quvonchli kunimizda kutamiz",
    placeholder: "Masalan: Aziza va Mirjalolning nikoh oqshomi", hostPlaceholder: "Aziza & Mirjalol",
    venuePlaceholder: "Versal Palace", addressPlaceholder: "Toshkent shahri, Amir Temur ko‘chasi, 12",
    messagePlaceholder: "Quvonchimizga sherik bo‘ling!", templateNames: ["Botanika", "The Classic", "Modern Muse"],
    templateDescriptions: ["Nozik gullar va romantik kayfiyat", "Hashamatli klassika va nafislik", "Zamonaviy uslub va dadil tipografika"],
    savedLocal: "Qoralama faqat shu brauzerda saqlanadi.", live: "O‘zgarishlar darhol aks etadi",
    sample: "NAMUNA", choose: "Tanlandi", optional: "Ixtiyoriy", yourDetails: "Sizning tadbiringiz",
  },
  ru: {
    back: "Назад", eyebrow: "ASTRON INVITATION STUDIO", heading: "Приглашение, которое запомнится",
    intro: "Создайте особенное приглашение за несколько минут. Выберите стиль, добавьте детали — Astron позаботится о красоте.",
    step1: "Выберите дизайн", step2: "Детали события", step3: "Готовое приглашение",
    stepHint: "Выберите стиль по душе. Его можно изменить в любой момент.",
    event: "Тип события", title: "Заголовок приглашения", hosts: "Кого поздравляем?", date: "Дата",
    time: "Время начала", venue: "Место проведения", address: "Полный адрес", message: "Пожелание гостям",
    templates: "Коллекция дизайнов", preview: "Предпросмотр", edit: "Редактировать", previewTab: "Просмотр",
    save: "Сохранить", saved: "Черновик сохранён на устройстве", restored: "Черновик восстановлен",
    share: "Поделиться приглашением", required: "Укажите название приглашения и дату", copied: "Ссылка скопирована",
    copy: "Скопировать ссылку", shareReady: "Ваше приглашение готово!", draftError: "Не удалось сохранить черновик",
    wedding: "Свадьба", birthday: "День рождения", family: "Семейный праздник", corporate: "Корпоратив", graduation: "Выпускной",
    invitation: "ПРИГЛАШАЕМ ВАС", dateLabel: "НАШ ОСОБЕННЫЙ ДЕНЬ", location: "МЕСТО", note: "Будем счастливы разделить этот день с вами",
    placeholder: "Например: Свадьба Азизы и Мирджалола", hostPlaceholder: "Азиза и Мирджалол",
    venuePlaceholder: "Versal Palace", addressPlaceholder: "Ташкент, улица Амира Темура, 12",
    messagePlaceholder: "Разделите с нами этот день!", templateNames: ["Ботаника", "The Classic", "Modern Muse"],
    templateDescriptions: ["Нежные цветы и романтика", "Роскошная классика и элегантность", "Современный стиль и выразительная типографика"],
    savedLocal: "Черновик хранится только в этом браузере.", live: "Изменения видны сразу",
    sample: "ПРИМЕР", choose: "Выбрано", optional: "Необязательно", yourDetails: "Ваше событие",
  },
  en: {
    back: "Back", eyebrow: "ASTRON INVITATION STUDIO", heading: "An invitation made for your special moment",
    intro: "Create a beautiful invitation in minutes. Pick a style, add your details, and let Astron bring it to life.",
    step1: "Choose a design", step2: "Event details", step3: "Your invitation",
    stepHint: "Choose the style you love. You can change it any time.",
    event: "Event type", title: "Invitation title", hosts: "Who is celebrating?", date: "Date",
    time: "Start time", venue: "Venue", address: "Full address", message: "A note for your guests",
    templates: "The design collection", preview: "Live preview", edit: "Edit details", previewTab: "Preview",
    save: "Save draft", saved: "Draft saved on this device", restored: "Your draft was restored",
    share: "Share invitation", required: "Please add an invitation title and date", copied: "Link copied",
    copy: "Copy invitation link", shareReady: "Your invitation is ready!", draftError: "Could not save this draft",
    wedding: "Wedding", birthday: "Birthday", family: "Family celebration", corporate: "Corporate", graduation: "Graduation",
    invitation: "YOU ARE INVITED", dateLabel: "OUR SPECIAL DAY", location: "LOCATION", note: "We would love to celebrate with you",
    placeholder: "e.g. Aziza & Mirjalol’s wedding", hostPlaceholder: "Aziza & Mirjalol",
    venuePlaceholder: "Versal Palace", addressPlaceholder: "Tashkent, Amir Temur street, 12",
    messagePlaceholder: "It would mean a lot to celebrate with you!", templateNames: ["Botanical", "The Classic", "Modern Muse"],
    templateDescriptions: ["Delicate florals and romance", "Timeless luxury and elegance", "Modern style and expressive type"],
    savedLocal: "Drafts are stored only in this browser.", live: "Changes appear instantly",
    sample: "SAMPLE", choose: "Selected", optional: "Optional", yourDetails: "Your event",
  },
} as const;

const types = ["wedding", "birthday", "family", "corporate", "graduation"] as const;
const emptyInvitation = (type: string): Invitation => ({
  type: types.includes(type as (typeof types)[number]) ? type : "wedding",
  template: "botanical", title: "", hosts: "", date: "", time: "18:00", venue: "", address: "", message: "",
});

export default function InvitationBuilder({ locale, initialType, initialTemplate }: {
  locale: Locale; initialType: string; initialTemplate?: string;
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
    let cancelled = false;
    let restored: Invitation | undefined;
    try {
      const raw = window.localStorage.getItem(`astron:invitation-draft:${locale}`);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const candidate = parsed as Partial<Invitation>;
          if (typeof candidate.title === "string" && typeof candidate.type === "string") {
            restored = {
              ...emptyInvitation(candidate.type), ...candidate,
              type: types.includes(initialType as (typeof types)[number]) ? initialType : candidate.type,
              template: isInvitationTemplateId(initialTemplate) ? initialTemplate : isInvitationTemplateId(candidate.template) ? candidate.template : "botanical",
            };
          }
        }
      }
    } catch { /* Keep the clean builder if a local draft is unavailable. */ }
    queueMicrotask(() => {
      if (cancelled) return;
      if (restored) { setForm(restored); setNotice(t.restored); }
      setDraftLoaded(true);
    });
    return () => { cancelled = true; };
  }, [initialTemplate, initialType, locale, t.restored]);

  const dateLabel = useMemo(() => {
    if (!form.date) return t.dateLabel;
    const date = new Date(`${form.date}T12:00:00`);
    if (Number.isNaN(date.getTime())) return t.dateLabel;
    return new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    }).format(date);
  }, [form.date, locale, t.dateLabel]);

  const selectedTemplate = getInvitationTemplate(form.template);
  const eventName = form.type === "birthday" ? t.birthday : form.type === "family" ? t.family : form.type === "corporate" ? t.corporate : form.type === "graduation" ? t.graduation : t.wedding;

  function update<K extends keyof Invitation>(key: K, value: Invitation[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setShareUrl(""); setNotice("");
  }
  function saveDraft() {
    try {
      window.localStorage.setItem(`astron:invitation-draft:${locale}`, JSON.stringify(form));
      setNotice(t.saved);
    } catch { setNotice(t.draftError); }
  }
  async function copyLink(url: string) {
    try { await navigator.clipboard.writeText(url); setNotice(t.copied); }
    catch { setNotice(url); }
  }
  async function createLink() {
    if (!form.title.trim() || !form.date) { setNotice(t.required); setActiveView("edit"); return; }
    const url = new URL(`/${locale}/invite`, window.location.origin);
    url.searchParams.set("data", JSON.stringify({ ...form, theme: selectedTemplate.theme }));
    if (url.toString().length > 5000) {
      setNotice(locale === "uz" ? "Ma’lumotlar hajmi katta. Matnni qisqartiring." : locale === "ru" ? "Слишком много данных. Сократите текст." : "Invitation is too large. Please shorten the text.");
      return;
    }
    setShareUrl(url.toString()); setNotice(t.shareReady);
    if (navigator.share) {
      try { await navigator.share({ title: form.title, text: form.message || t.note, url: url.toString() }); }
      catch { /* Keep the link available for manual copy. */ }
    } else { await copyLink(url.toString()); }
  }

  return (
    <main className="builder-page studio-premium">
      <header className="site-header builder-header">
        <a className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></a>
        <div className="studio-header-center"><span className="studio-live-dot" /> {t.live}</div>
        <a className="builder-back" href={`/${locale}`}>← {t.back}</a>
      </header>

      <section className="builder-intro studio-hero">
        <div className="studio-hero-copy">
          <p className="eyebrow"><span />{t.eyebrow}</p>
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
          <div className="studio-progress" aria-label="Creation steps">
            <span className="is-current"><i>01</i>{t.step1}</span><b />
            <span><i>02</i>{t.step2}</span><b />
            <span><i>03</i>{t.step3}</span>
          </div>
        </div>
        <div className="studio-hero-art" aria-hidden="true">
          <div className="studio-art-glow" />
          <div className="studio-art-card studio-art-card-back"><span>THE ART OF CELEBRATING</span><strong>Save<br />the date</strong><i>✳</i></div>
          <div className="studio-art-card studio-art-card-front"><small>AN INVITATION</small><strong>Aziza <em>&</em><br />Mirjalol</strong><span>12 · 06 · 2027</span><i>✦</i></div>
          <span className="studio-art-spark studio-spark-one">✦</span><span className="studio-art-spark studio-spark-two">✧</span>
        </div>
      </section>

      <div className="studio-toolbar" role="tablist" aria-label={t.preview}>
        <button type="button" role="tab" aria-selected={activeView === "edit"} className={activeView === "edit" ? "active" : ""} onClick={() => setActiveView("edit")}>{t.edit}</button>
        <button type="button" role="tab" aria-selected={activeView === "preview"} className={activeView === "preview" ? "active" : ""} onClick={() => setActiveView("preview")}>{t.previewTab}</button>
      </div>

      <div className={`builder-layout studio-layout view-${activeView}`}>
        <section className="builder-form studio-form" aria-label={t.edit}>
          <div className="studio-step-heading"><span>01</span><div><p className="eyebrow">{t.step1}</p><h2>{t.templates}</h2><small>{t.stepHint}</small></div></div>
          <div className="template-picker studio-template-picker">
            {invitationTemplates.map((template, index) => (
              <button type="button" key={template.id} className={`template-choice studio-template-card template-card-${template.id} ${form.template === template.id ? "selected" : ""}`}
                aria-pressed={form.template === template.id} onClick={() => update("template", template.id)}>
                <span className={`template-mini template-mini-${template.id}`} aria-hidden="true">
                  <i>{template.marker}</i><b>{form.hosts || "Aziza & Mirjalol"}</b><small>12 · 06 · 2027</small><em>{t.sample}</em>
                </span>
                <span className="template-choice-copy"><strong>{t.templateNames[index]}</strong><small>{t.templateDescriptions[index]}</small></span>
                {form.template === template.id && <span className="template-check" aria-label={t.choose}>✓</span>}
              </button>
            ))}
          </div>

          <div className="studio-step-heading studio-details-heading"><span>02</span><div><p className="eyebrow">{t.step2}</p><h2>{t.yourDetails}</h2><small>{t.intro.split(".")[0]}.</small></div></div>
          <div className="studio-form-card">
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
            <label>{t.message}<span className="studio-optional">{t.optional}</span><textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={t.messagePlaceholder} rows={3} maxLength={220} /></label>
            <p className="draft-hint"><span>↳</span> {t.savedLocal}</p>
            {draftLoaded && notice && <p className="builder-notice" role="status">{notice}</p>}
            {shareUrl && <div className="share-result"><p>{t.shareReady}</p><a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a><button type="button" onClick={() => void copyLink(shareUrl)}>{t.copy}</button></div>}
          </div>
        </section>

        <aside className="preview-column studio-preview-column" aria-label={t.preview}>
          <div className="preview-panel-heading"><div><p className="eyebrow">{t.step3}</p><h2>{t.preview}</h2></div><span><i /> LIVE</span></div>
          <div className="studio-preview-stage">
            <div className={`invitation-preview preview-${selectedTemplate.theme} invitation-${form.template}`}>
              <span className="preview-flower">{selectedTemplate.marker}</span>
              <span className="preview-kicker">{t.invitation}</span>
              <h2>{form.hosts || form.title || "Aziza & Mirjalol"}</h2>
              <span className="preview-rule">✧</span>
              <p className="preview-title">{form.title || eventName}</p>
              <strong>{dateLabel}</strong>
              <span>{form.time || "18:00"}</span>
              <div className="preview-location"><b>{t.location}</b><span>{form.venue || "Versal Palace"}</span><small>{form.address || "Tashkent, Uzbekistan"}</small></div>
              <p className="preview-message">{form.message || t.note}</p>
            </div>
            <span className="preview-stage-caption">ASTRON · DIGITAL INVITATIONS</span>
          </div>
          <div className="preview-trust-row"><span>✦ {t.live}</span><span>♡ Made with care</span></div>
        </aside>
      </div>

      <div className="studio-bottom-bar">
        <button className="studio-save" type="button" onClick={saveDraft}>{t.save}</button>
        <button className="button button-primary studio-share" type="button" onClick={() => void createLink()}>{t.share}<span aria-hidden="true">↗</span></button>
      </div>
    </main>
  );
}
