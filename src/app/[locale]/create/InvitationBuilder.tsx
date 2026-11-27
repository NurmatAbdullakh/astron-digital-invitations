"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInvitationTemplate,
  invitationTemplates,
  isInvitationTemplateId,
  type InvitationTemplateId,
} from "@/lib/invitations/templates";

type Locale = "uz" | "ru" | "en";
type Step = "design" | "details" | "preview";
type Invitation = {
  type: string; template: InvitationTemplateId; title: string; hosts: string;
  date: string; time: string; venue: string; address: string; message: string;
};

const labels = {
  uz: {
    back: "Orqaga", eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "Taklifnomangizni yarating",
    intro: "Bir necha oson qadamda. Dizaynni tanlang, ma’lumotlarni kiriting va natijani ko‘ring.",
    step1: "Dizayn", step2: "Ma’lumotlar", step3: "Ko‘rib chiqish",
    stepHint: "Qaysi uslub sizning bayramingizga mos?", event: "Tadbir turi",
    title: "Taklifnoma nomi", hosts: "Kimning bayrami?", date: "Sana", time: "Vaqt",
    venue: "Tadbir maskani", address: "Manzil", message: "Mehmonlarga tilak",
    templates: "O‘z uslubingizni tanlang", preview: "Jonli preview", edit: "Tahrirlash",
    save: "Qoralamani saqlash", saved: "Qoralama ushbu qurilmada saqlandi",
    restored: "Qoralamangiz tiklandi", share: "Taklifnomani yaratish",
    required: "Taklifnoma nomi va sanasini kiriting", copied: "Havola nusxalandi",
    copy: "Havolani nusxalash", shareReady: "Taklifnomangiz tayyor!",
    draftError: "Saqlash imkoni bo‘lmadi", next: "Davom etish", previous: "Ortga",
    wedding: "To‘y", birthday: "Tug‘ilgan kun", family: "Oilaviy bayram",
    corporate: "Korporativ", graduation: "Bitiruv",
    invitation: "SIZNI TAKLIF ETAMIZ", dateLabel: "BAХTLI KUNIMIZ",
    location: "MANZIL", note: "Sizni ushbu quvonchli kunimizda kutamiz",
    placeholder: "Masalan: Aziza va Mirjalolning nikoh oqshomi",
    hostPlaceholder: "Aziza & Mirjalol", venuePlaceholder: "Versal Palace",
    addressPlaceholder: "Toshkent shahri, Amir Temur ko‘chasi",
    messagePlaceholder: "Quvonchimizga sherik bo‘ling!",
    templateNames: ["Botanika", "The Classic", "Modern Muse"],
    templateDescriptions: ["Nozik gullar va romantika", "Hashamatli klassika", "Zamonaviy va dadil"],
    localOnly: "Qoralama faqat shu brauzerda saqlanadi.",
    optional: "Ixtiyoriy", eventTitle: "Bayramingiz haqida",
    finishTitle: "Hammasi tayyor!", finishText: "Taklifnomangizni tekshiring va yaqinlaringiz bilan ulashing.",
    change: "O‘zgartirish", selected: "Tanlandi", sample: "NAMUNA",
    live: "Jonli ko‘rinish", designHelp: "Har bir shablonni tanlab ko‘ring — preview darhol yangilanadi.",
  },
  ru: {
    back: "Назад", eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "Создайте своё приглашение",
    intro: "Всего несколько шагов. Выберите дизайн, добавьте детали и посмотрите результат.",
    step1: "Дизайн", step2: "Детали", step3: "Просмотр",
    stepHint: "Какой стиль подойдёт вашему празднику?", event: "Тип события",
    title: "Название приглашения", hosts: "Кого поздравляем?", date: "Дата", time: "Время",
    venue: "Место проведения", address: "Адрес", message: "Пожелание гостям",
    templates: "Выберите свой стиль", preview: "Предпросмотр", edit: "Изменить",
    save: "Сохранить черновик", saved: "Черновик сохранён на устройстве",
    restored: "Черновик восстановлен", share: "Создать приглашение",
    required: "Укажите название приглашения и дату", copied: "Ссылка скопирована",
    copy: "Скопировать ссылку", shareReady: "Ваше приглашение готово!",
    draftError: "Не удалось сохранить черновик", next: "Продолжить", previous: "Назад",
    wedding: "Свадьба", birthday: "День рождения", family: "Семейный праздник",
    corporate: "Корпоратив", graduation: "Выпускной",
    invitation: "ПРИГЛАШАЕМ ВАС", dateLabel: "НАШ ОСОБЕННЫЙ ДЕНЬ",
    location: "МЕСТО", note: "Будем счастливы разделить этот день с вами",
    placeholder: "Например: Свадьба Азизы и Мирджалола",
    hostPlaceholder: "Азиза и Мирджалол", venuePlaceholder: "Versal Palace",
    addressPlaceholder: "Ташкент, улица Амира Темура",
    messagePlaceholder: "Разделите с нами этот день!",
    templateNames: ["Ботаника", "The Classic", "Modern Muse"],
    templateDescriptions: ["Нежные цветы и романтика", "Роскошь классики", "Современно и выразительно"],
    localOnly: "Черновик хранится только в этом браузере.",
    optional: "Необязательно", eventTitle: "О вашем событии",
    finishTitle: "Всё готово!", finishText: "Проверьте приглашение и поделитесь им с близкими.",
    change: "Изменить", selected: "Выбрано", sample: "ПРИМЕР",
    live: "Предпросмотр онлайн", designHelp: "Выберите шаблон — предпросмотр обновится сразу.",
  },
  en: {
    back: "Back", eyebrow: "ASTRON · DIGITAL INVITATIONS", heading: "Create your invitation",
    intro: "Just a few easy steps. Pick a design, add your details and see it come to life.",
    step1: "Design", step2: "Details", step3: "Preview",
    stepHint: "Choose the look that feels right for your celebration.", event: "Event type",
    title: "Invitation title", hosts: "Who is celebrating?", date: "Date", time: "Time",
    venue: "Venue", address: "Address", message: "A note for your guests",
    templates: "Choose your signature style", preview: "Live preview", edit: "Edit details",
    save: "Save draft", saved: "Draft saved on this device",
    restored: "Your draft was restored", share: "Create invitation",
    required: "Please add an invitation title and date", copied: "Link copied",
    copy: "Copy invitation link", shareReady: "Your invitation is ready!",
    draftError: "Could not save this draft", next: "Continue", previous: "Back",
    wedding: "Wedding", birthday: "Birthday", family: "Family celebration",
    corporate: "Corporate", graduation: "Graduation",
    invitation: "YOU ARE INVITED", dateLabel: "OUR SPECIAL DAY",
    location: "LOCATION", note: "We would love to celebrate with you",
    placeholder: "e.g. Aziza & Mirjalol’s wedding",
    hostPlaceholder: "Aziza & Mirjalol", venuePlaceholder: "Versal Palace",
    addressPlaceholder: "Tashkent, Amir Temur street",
    messagePlaceholder: "It would mean a lot to celebrate with you!",
    templateNames: ["Botanical", "The Classic", "Modern Muse"],
    templateDescriptions: ["Delicate florals and romance", "Timeless luxury", "Modern and expressive"],
    localOnly: "Drafts are stored only in this browser.",
    optional: "Optional", eventTitle: "About your event",
    finishTitle: "It's ready!", finishText: "Review your invitation and share it with your guests.",
    change: "Make changes", selected: "Selected", sample: "SAMPLE",
    live: "Live preview", designHelp: "Choose a template — the preview updates instantly.",
  },
} as const;

const types = ["wedding", "birthday", "family", "corporate", "graduation"] as const;
const steps: Step[] = ["design", "details", "preview"];
const emptyInvitation = (type: string): Invitation => ({
  type: types.includes(type as (typeof types)[number]) ? type : "wedding",
  template: "botanical", title: "", hosts: "", date: "", time: "18:00",
  venue: "", address: "", message: "",
});

export default function InvitationBuilder({ locale, initialType, initialTemplate }: {
  locale: Locale; initialType: string; initialTemplate?: string;
}) {
  const t = labels[locale];
  const [form, setForm] = useState<Invitation>(() => ({
    ...emptyInvitation(initialType),
    template: isInvitationTemplateId(initialTemplate) ? initialTemplate : "botanical",
  }));
  const [activeStep, setActiveStep] = useState<Step>("design");
  const [shareUrl, setShareUrl] = useState("");
  const [notice, setNotice] = useState("");
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
  const currentIndex = steps.indexOf(activeStep);

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
    if (!form.title.trim() || !form.date) {
      setNotice(t.required); setActiveStep("details"); return;
    }
    const url = new URL(`/${locale}/invite`, window.location.origin);
    url.searchParams.set("data", JSON.stringify({ ...form, theme: selectedTemplate.theme }));
    if (url.toString().length > 5000) {
      setNotice(locale === "uz" ? "Ma’lumotlar hajmi katta. Matnni qisqartiring." : locale === "ru" ? "Слишком много данных. Сократите текст." : "Invitation is too large. Please shorten the text.");
      return;
    }
    setShareUrl(url.toString());
    setNotice(t.shareReady);
    setActiveStep("preview");
    if (navigator.share) {
      try { await navigator.share({ title: form.title, text: form.message || t.note, url: url.toString() }); }
      catch { /* Keep the link available for manual copy. */ }
    }
  }

  const stepNames = [t.step1, t.step2, t.step3];
  const stepIcons = ["✦", "02", "03"];

  return (
    <main className="builder-page studio-premium studio-wizard">
      <header className="site-header builder-header wizard-header">
        <a className="brand" href={`/${locale}`}><span className="brand-mark">a.</span><span>astron</span></a>
        <div className="wizard-brand-center"><span className="wizard-status-dot" /> {t.eyebrow}</div>
        <a className="builder-back" href={`/${locale}`}>← {t.back}</a>
      </header>

      <div className="wizard-topline">
        <div className="wizard-heading">
          <span className="wizard-eyebrow">{t.eyebrow}</span>
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
        </div>
        <nav className="wizard-tabs" role="tablist" aria-label={t.heading}>
          {steps.map((step, index) => (
            <button key={step} type="button" role="tab" aria-selected={activeStep === step}
              aria-controls={`wizard-panel-${step}`} id={`wizard-tab-${step}`}
              className={`wizard-tab ${activeStep === step ? "is-active" : ""} ${currentIndex > index ? "is-complete" : ""}`}
              onClick={() => setActiveStep(step)}>
              <span className="wizard-tab-number">{currentIndex > index ? "✓" : `0${index + 1}`}</span>
              <span>{stepNames[index]}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className={`wizard-workspace wizard-step-${activeStep}`}>
        <section className="wizard-main-panel" role="tabpanel" id={`wizard-panel-${activeStep}`} aria-labelledby={`wizard-tab-${activeStep}`}>
          {activeStep === "design" && (
            <div className="wizard-step-content design-step">
              <div className="wizard-section-title">
                <span className="wizard-kicker">01 / THE LOOK</span>
                <h2>{t.templates}</h2>
                <p>{t.designHelp}</p>
              </div>
              <div className="wizard-event-picker">
                <span>{t.event}</span>
                <div className="event-chips">
                  {types.map((type) => (
                    <button key={type} type="button" className={form.type === type ? "is-selected" : ""}
                      aria-pressed={form.type === type} onClick={() => update("type", type)}>
                      {t[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="wizard-template-grid">
                {invitationTemplates.map((template, index) => (
                  <button type="button" key={template.id}
                    className={`wizard-template template-card-${template.id} ${form.template === template.id ? "is-selected" : ""}`}
                    aria-pressed={form.template === template.id} onClick={() => update("template", template.id)}>
                    <span className={`wizard-template-art template-mini template-mini-${template.id}`} aria-hidden="true">
                      <i>{template.marker}</i><b>{form.hosts || "Aziza & Mirjalol"}</b><small>12 · 06 · 2027</small><em>{t.sample}</em>
                    </span>
                    <span className="wizard-template-meta"><strong>{t.templateNames[index]}</strong><small>{t.templateDescriptions[index]}</small></span>
                    <span className="wizard-template-check">{form.template === template.id ? "✓" : "+"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStep === "details" && (
            <div className="wizard-step-content details-step">
              <div className="wizard-section-title">
                <span className="wizard-kicker">02 / THE DETAILS</span>
                <h2>{t.eventTitle}</h2>
                <p>{t.intro}</p>
              </div>
              <div className="wizard-fields">
                <label className="field-wide">{t.title}
                  <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={t.placeholder} maxLength={90} required />
                </label>
                <label>{t.hosts}
                  <input value={form.hosts} onChange={(e) => update("hosts", e.target.value)} placeholder={t.hostPlaceholder} maxLength={70} />
                </label>
                <label>{t.date}
                  <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
                </label>
                <label>{t.time}
                  <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
                </label>
                <label>{t.venue}
                  <input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder={t.venuePlaceholder} maxLength={80} />
                </label>
                <label>{t.address}
                  <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder={t.addressPlaceholder} maxLength={140} />
                </label>
                <label className="field-wide wizard-message-field">{t.message} <small>{t.optional}</small>
                  <input value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={t.messagePlaceholder} maxLength={220} />
                </label>
              </div>
              {notice && <p className="wizard-notice" role="status">{notice}</p>}
              <p className="wizard-local-note"><span>↗</span>{t.localOnly}</p>
            </div>
          )}

          {activeStep === "preview" && (
            <div className="wizard-step-content finish-step">
              <span className="wizard-finish-icon">✦</span>
              <span className="wizard-kicker">03 / READY TO SHARE</span>
              <h2>{t.finishTitle}</h2>
              <p>{t.finishText}</p>
              <div className="wizard-finish-summary">
                <span>{t.templateNames[invitationTemplates.findIndex((item) => item.id === form.template)]}</span>
                <b>{form.title || eventName}</b>
                <small>{form.date ? dateLabel : t.dateLabel} · {form.time}</small>
              </div>
              {notice && <p className="wizard-notice" role="status">{notice}</p>}
              {shareUrl ? (
                <div className="wizard-share-result">
                  <label htmlFor="invitation-share-url">{t.shareReady}</label>
                  <input id="invitation-share-url" readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
                  <button type="button" onClick={() => void copyLink(shareUrl)}>{t.copy} ↗</button>
                </div>
              ) : (
                <button type="button" className="wizard-create-button" onClick={() => void createLink()}>{t.share} <span>↗</span></button>
              )}
              <button type="button" className="wizard-edit-link" onClick={() => setActiveStep("details")}>← {t.change}</button>
            </div>
          )}
        </section>

        <aside className="wizard-preview-panel" aria-label={t.preview}>
          <div className="wizard-preview-head">
            <div><span className="wizard-kicker">YOUR DESIGN, LIVE</span><h2>{t.preview}</h2></div>
            <span className="wizard-live-pill"><i /> LIVE</span>
          </div>
          <div className="wizard-preview-canvas">
            <div className={`wizard-invitation invitation-preview preview-${selectedTemplate.theme} invitation-${form.template}`}>
              <span className="wizard-invitation-ornament">{selectedTemplate.marker}</span>
              <span className="preview-kicker">{t.invitation}</span>
              <h3>{form.hosts || form.title || "Aziza & Mirjalol"}</h3>
              <span className="wizard-invitation-divider">✳</span>
              <p className="preview-title">{form.title || eventName}</p>
              <strong>{dateLabel}</strong>
              <span>{form.time || "18:00"}</span>
              <div className="preview-location"><b>{t.location}</b><span>{form.venue || "Versal Palace"}</span><small>{form.address || "Tashkent, Uzbekistan"}</small></div>
              <p className="preview-message">{form.message || t.note}</p>
            </div>
          </div>
          <div className="wizard-preview-footer"><span>✦ {t.live}</span><span>ASTRON STUDIO</span></div>
        </aside>
      </div>

      <footer className="wizard-actionbar">
        <div className="wizard-action-left">
          <button type="button" className="wizard-save-button" onClick={saveDraft}>{t.save}</button>
          {draftLoaded && notice && activeStep !== "details" && activeStep !== "preview" && <span role="status">{notice}</span>}
        </div>
        <div className="wizard-action-right">
          {currentIndex > 0 && <button type="button" className="wizard-back-button" onClick={() => setActiveStep(steps[currentIndex - 1])}>← {t.previous}</button>}
          {activeStep !== "preview" ? (
            <button type="button" className="wizard-next-button" onClick={() => {
              if (activeStep === "details" && (!form.title.trim() || !form.date)) { setNotice(t.required); return; }
              setNotice(""); setActiveStep(steps[currentIndex + 1]);
            }}>{t.next} <span>→</span></button>
          ) : !shareUrl ? (
            <button type="button" className="wizard-next-button" onClick={() => void createLink()}>{t.share} <span>↗</span></button>
          ) : (
            <button type="button" className="wizard-next-button" onClick={() => void copyLink(shareUrl)}>{t.copy} <span>↗</span></button>
          )}
        </div>
      </footer>
    </main>
  );
}
