"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InvitationArtwork from "@/components/invitations/InvitationArtwork";
import { getInvitationTemplate, isInvitationTemplateId, type InvitationTemplateId } from "@/lib/invitations/templates";

type Locale = "uz" | "ru" | "en";
type StepKey = "hosts" | "title" | "date" | "time" | "venue" | "message" | "review";
type Invitation = { type: string; template: InvitationTemplateId; title: string; hosts: string; date: string; time: string; venue: string; address: string; message: string };
const steps: StepKey[] = ["hosts", "title", "date", "time", "venue", "message", "review"];
const eventTypes = ["wedding", "birthday", "family", "corporate", "graduation"] as const;

const copy = {
  uz: {
    back: "Shablonlarga qaytish", eyebrow: "ASTRON STUDIO", progress: "QADAM", of: "/", next: "Davom etish", previous: "Ortga",
    save: "Qoralamani saqlash", saved: "Qoralama shu qurilmada saqlandi", restored: "Qoralama tiklandi", local: "Ma’lumotlar faqat ushbu brauzerda saqlanadi.",
    preview: "Jonli ko‘rinish", showPreview: "Taklifnomani ko‘rish", hidePreview: "Tahrirga qaytish",
    required: "Iltimos, bu maydonni to‘ldiring.", hostsTitle: "Kimlarni taklif qilamiz?", hostsHelp: "Ismlar taklifnomangizning markazida bo‘ladi.", hostsLabel: "Ismlar", hostsPlaceholder: "Masalan: Aziza va Mirjalol",
    titleTitle: "Bayramingizni qanday ataymiz?", titleHelp: "Taklifnomada ko‘rinadigan sarlavha. Istasangiz, tavsiya qilingan nomni o‘zgartiring.", titleLabel: "Taklifnoma sarlavhasi",
    dateTitle: "Qaysi kuni uchrashamiz?", dateHelp: "Bayramingiz sanasini tanlang.", dateLabel: "Tadbir sanasi",
    timeTitle: "Soat nechada boshlaymiz?", timeHelp: "Boshlanish vaqtini kiriting. Hozircha aniq bo‘lmasa, bu qadamni o‘tkazib yuborishingiz mumkin.", timeLabel: "Boshlanish vaqti",
    venueTitle: "Qayerda uchrashamiz?", venueHelp: "Restoran yoki tadbir joyi va mehmonlar topishi uchun manzilni kiriting.", venueLabel: "Joy nomi", venuePlaceholder: "Masalan: Versal Palace", addressLabel: "Manzil", addressPlaceholder: "Toshkent shahri, Amir Temur ko‘chasi",
    messageTitle: "Mehmonlarga tilak qoldiramizmi?", messageHelp: "Qisqa va samimiy xabar yozing. Bu qadam ixtiyoriy.", messageLabel: "Shaxsiy xabar", messagePlaceholder: "Quvonchimizga sherik bo‘ling!", optional: "Ixtiyoriy", skip: "O‘tkazib yuborish",
    reviewTitle: "Taklifnomangiz tayyor ko‘rinadi", reviewHelp: "Barcha ma’lumotlarni tekshiring. O‘zgartirish kerak bo‘lsa, istalgan qadamga qayting.",
    share: "Havolani yaratish", copy: "Havolani nusxalash", copied: "Havola nusxalandi", shareReady: "Taklifnoma havolasi tayyor.", shareError: "Havolani yaratib bo‘lmadi. Matnni qisqartirib ko‘ring.",
    eventNames: ["To‘y", "Tug‘ilgan kun", "Oilaviy bayram", "Korporativ", "Bitiruv"], templateNames: ["Botanika", "Editorial", "Minimal"],
    invitation: "SIZNI TAKLIF ETAMIZ", dateCaption: "BAХTLI KUNIMIZ", location: "MANZIL", note: "Sizni quvonchli kunimizda kutamiz",
    previewTitle: "Taklifnoma ko‘rinishi", edit: "O‘zgartirish", finish: "Tayyor!", finishHelp: "Havolani yaqinlaringizga yuboring. Ushbu MVP havolasi taklifnoma ma’lumotlarini URL ichida saqlaydi.",
    titleDefault: ["To‘yimiz", "Tug‘ilgan kun", "Oilaviy bayram", "Bayram tadbiri", "Bitiruv kechasi"]
  },
  ru: {
    back: "Вернуться к шаблонам", eyebrow: "ASTRON STUDIO", progress: "ШАГ", of: "ИЗ", next: "Продолжить", previous: "Назад",
    save: "Сохранить черновик", saved: "Черновик сохранён на этом устройстве", restored: "Черновик восстановлен", local: "Данные хранятся только в этом браузере.",
    preview: "Предпросмотр", showPreview: "Посмотреть приглашение", hidePreview: "Вернуться к редактированию",
    required: "Пожалуйста, заполните это поле.", hostsTitle: "Кого приглашаем?", hostsHelp: "Имена будут в центре вашего приглашения.", hostsLabel: "Имена", hostsPlaceholder: "Например: Анна и Михаил",
    titleTitle: "Как назовём ваш праздник?", titleHelp: "Заголовок, который увидят гости. Вы можете изменить предложенный вариант.", titleLabel: "Заголовок приглашения",
    dateTitle: "Когда встречаемся?", dateHelp: "Выберите дату вашего события.", dateLabel: "Дата события",
    timeTitle: "Во сколько начинаем?", timeHelp: "Укажите время начала. Если пока не определились, этот шаг можно пропустить.", timeLabel: "Время начала",
    venueTitle: "Где встретимся?", venueHelp: "Укажите площадку и адрес, чтобы гостям было легко вас найти.", venueLabel: "Название места", venuePlaceholder: "Например: Villa Garden", addressLabel: "Адрес", addressPlaceholder: "Ташкент, улица Амира Темура",
    messageTitle: "Оставим пожелание гостям?", messageHelp: "Добавьте короткое личное сообщение. Этот шаг необязательный.", messageLabel: "Личное сообщение", messagePlaceholder: "Будем рады разделить этот день с вами!", optional: "Необязательно", skip: "Пропустить",
    reviewTitle: "Так будет выглядеть ваше приглашение", reviewHelp: "Проверьте детали. Вы можете вернуться к любому шагу и всё изменить.",
    share: "Создать ссылку", copy: "Скопировать ссылку", copied: "Ссылка скопирована", shareReady: "Ссылка на приглашение готова.", shareError: "Не удалось создать ссылку. Попробуйте сократить текст.",
    eventNames: ["Свадьба", "День рождения", "Семейный праздник", "Корпоратив", "Выпускной"], templateNames: ["Ботаника", "Editorial", "Минимализм"],
    invitation: "ПРИГЛАШАЕМ ВАС", dateCaption: "НАШ ОСОБЕННЫЙ ДЕНЬ", location: "МЕСТО", note: "Будем рады разделить этот день с вами",
    previewTitle: "Предпросмотр приглашения", edit: "Изменить", finish: "Готово!", finishHelp: "Отправьте ссылку близким. В этой версии данные приглашения хранятся прямо в ссылке.",
    titleDefault: ["Наша свадьба", "День рождения", "Семейный праздник", "Праздничное событие", "Выпускной вечер"]
  },
  en: {
    back: "Back to templates", eyebrow: "ASTRON STUDIO", progress: "STEP", of: "OF", next: "Continue", previous: "Back",
    save: "Save draft", saved: "Draft saved on this device", restored: "Draft restored", local: "Your details are stored only in this browser.",
    preview: "Live preview", showPreview: "View invitation", hidePreview: "Back to editing",
    required: "Please complete this field.", hostsTitle: "Who are we celebrating?", hostsHelp: "Your names will be at the heart of the invitation.", hostsLabel: "Names", hostsPlaceholder: "For example: Anna & Michael",
    titleTitle: "What should we call the event?", titleHelp: "This is the headline guests will see. You can edit the suggested title.", titleLabel: "Invitation headline",
    dateTitle: "When is the celebration?", dateHelp: "Choose the date of your event.", dateLabel: "Event date",
    timeTitle: "What time should guests arrive?", timeHelp: "Add the start time. You can skip this step if it is not decided yet.", timeLabel: "Start time",
    venueTitle: "Where will we meet?", venueHelp: "Add the venue and address so guests can find you easily.", venueLabel: "Venue name", venuePlaceholder: "For example: Villa Garden", addressLabel: "Address", addressPlaceholder: "City, street and building",
    messageTitle: "A note for your guests?", messageHelp: "Add a short personal message. This step is optional.", messageLabel: "Personal message", messagePlaceholder: "We would love to celebrate with you!", optional: "Optional", skip: "Skip this step",
    reviewTitle: "Your invitation is coming together", reviewHelp: "Review the details. You can return to any step and make changes.",
    share: "Create share link", copy: "Copy invitation link", copied: "Link copied", shareReady: "Your invitation link is ready.", shareError: "Could not create the link. Try shortening the text.",
    eventNames: ["Wedding", "Birthday", "Family celebration", "Corporate", "Graduation"], templateNames: ["Botanical", "Editorial", "Minimal"],
    invitation: "YOU ARE INVITED", dateCaption: "OUR SPECIAL DAY", location: "LOCATION", note: "We would love to celebrate with you",
    previewTitle: "Invitation preview", edit: "Edit", finish: "All ready!", finishHelp: "Send the link to your guests. In this MVP, invitation details are stored in the link itself.",
    titleDefault: ["Our wedding", "Birthday celebration", "Family celebration", "Celebration", "Graduation party"]
  }
} as const;

function eventIndex(type: string) {
  return Math.max(0, eventTypes.indexOf(type as (typeof eventTypes)[number]));
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export default function InvitationBuilder({ locale, initialType, initialTemplate }: { locale: Locale; initialType: string; initialTemplate?: string }) {
  const t = copy[locale];
  const type = eventTypes.includes(initialType as (typeof eventTypes)[number]) ? initialType : "wedding";
  const templateId: InvitationTemplateId = isInvitationTemplateId(initialTemplate) ? initialTemplate : "botanical";
  const selectedTemplate = getInvitationTemplate(templateId);
  const [form, setForm] = useState<Invitation>({ type, template: templateId, title: t.titleDefault[eventIndex(type)], hosts: "", date: "", time: "", venue: "", address: "", message: "" });
  const [stepIndex, setStepIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState("");
  const storageKey = `astron:invitation-draft:v2:${locale}:${type}:${templateId}`;

  useEffect(() => {
    let cancelled = false;
    let restored: Invitation | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const value: unknown = JSON.parse(raw);
        if (value && typeof value === "object") {
          const candidate = value as Partial<Invitation>;
          if (candidate.type === type && candidate.template === templateId
            && typeof candidate.hosts === "string" && typeof candidate.title === "string"
            && typeof candidate.date === "string" && typeof candidate.time === "string"
            && typeof candidate.venue === "string" && typeof candidate.address === "string"
            && typeof candidate.message === "string") {
            restored = { type, template: templateId, title: candidate.title.slice(0, 90), hosts: candidate.hosts.slice(0, 70),
              date: candidate.date.slice(0, 10), time: candidate.time.slice(0, 5), venue: candidate.venue.slice(0, 80),
              address: candidate.address.slice(0, 140), message: candidate.message.slice(0, 220) };
          }
        }
      }
    } catch { /* Ignore invalid or unavailable local drafts. */ }
    queueMicrotask(() => {
      if (cancelled) return;
      if (restored) { setForm(restored); setNotice(t.restored); }
      setDraftLoaded(true);
    });
    return () => { cancelled = true; };
  }, [storageKey, t.restored, templateId, type]);

  const dateLabel = useMemo(() => {
    if (!form.date) return t.dateCaption;
    const value = new Date(`${form.date}T12:00:00`);
    if (Number.isNaN(value.getTime())) return t.dateCaption;
    return new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(value);
  }, [form.date, locale, t.dateCaption]);

  function update<K extends keyof Invitation>(key: K, value: Invitation[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice(""); setError(""); setShareUrl("");
  }
  function saveDraft() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(form)); setNotice(t.saved); }
    catch { setNotice(locale === "ru" ? "Не удалось сохранить черновик." : locale === "uz" ? "Qoralamani saqlab bo‘lmadi." : "Could not save this draft."); }
  }
  function validateStep() {
    if (steps[stepIndex] === "hosts" && !form.hosts.trim()) { setError(t.required); return false; }
    if (steps[stepIndex] === "date" && !validDate(form.date)) { setError(t.required); return false; }
    setError("");
    return true;
  }
  function next() {
    if (!validateStep()) return;
    setNotice("");
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    setPreviewOpen(false);
  }
  function previous() {
    setError(""); setNotice("");
    setStepIndex((current) => Math.max(current - 1, 0));
    setPreviewOpen(false);
  }
  function makeShareUrl() {
    if (!form.hosts.trim() || !validDate(form.date)) {
      setStepIndex(!form.hosts.trim() ? 0 : 2); setError(t.required); return;
    }
    try {
      const url = new URL(`/${locale}/invite`, window.location.origin);
      url.searchParams.set("data", JSON.stringify({ ...form, theme: selectedTemplate.theme }));
      if (url.toString().length > 5000) { setNotice(t.shareError); return; }
      setShareUrl(url.toString()); setNotice(t.shareReady);
    } catch { setNotice(t.shareError); }
  }
  async function copyLink() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setNotice(t.copied); }
    catch { setNotice(shareUrl); }
  }
  async function nativeShare() {
    if (!shareUrl) return;
    if (!navigator.share) { await copyLink(); return; }
    try { await navigator.share({ title: form.title, text: form.message || t.note, url: shareUrl }); }
    catch { /* Keep the copy action available if sharing is cancelled. */ }
  }

  const step = steps[stepIndex];
  const eventName = t.eventNames[eventIndex(type)];
  const hostsValue = form.hosts || (locale === "ru" ? "Анна и Михаил" : locale === "uz" ? "Aziza va Mirjalol" : "Anna & Michael");
  const titleValue = form.title || eventName;
  const dateValue = form.date ? dateLabel : t.dateCaption;
  const isOptional = step === "time" || step === "venue" || step === "message";
  const stepHeading = { hosts: t.hostsTitle, title: t.titleTitle, date: t.dateTitle, time: t.timeTitle, venue: t.venueTitle, message: t.messageTitle, review: t.reviewTitle }[step];
  const stepHelp = { hosts: t.hostsHelp, title: t.titleHelp, date: t.dateHelp, time: t.timeHelp, venue: t.venueHelp, message: t.messageHelp, review: t.reviewHelp }[step];

  return (
    <main className="guided-builder">
      <header className="guided-header">
        <Link className="brand" href={`/${locale}/templates`}><span className="brand-mark">a.</span><span>astron</span></Link>
        <div className="guided-progress" aria-label={`${t.progress} ${stepIndex + 1} ${t.of} ${steps.length}`}>
          <div className="guided-progress-copy"><span>{t.progress} {stepIndex + 1} {t.of} {steps.length}</span><strong>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</strong></div>
          <div className="guided-progress-track"><span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
        </div>
        <Link className="guided-exit" href={`/${locale}/templates`}>← {t.back}</Link>
      </header>
      <div className={`guided-layout ${previewOpen ? "is-preview-open" : ""}`}>
        <section className="guided-form-panel" aria-labelledby="guided-step-title">
          <div className="guided-step-meta"><span>{t.eyebrow}</span><span>0{stepIndex + 1} / 0{steps.length}</span></div>
          <div className="guided-step-copy"><h1 id="guided-step-title">{stepHeading}</h1><p>{stepHelp}</p></div>
          {step === "hosts" && <div className="guided-fields"><label htmlFor="invitation-hosts">{t.hostsLabel}<span className="guided-required">*</span></label><input id="invitation-hosts" autoFocus value={form.hosts} onChange={(e) => update("hosts", e.target.value)} placeholder={t.hostsPlaceholder} maxLength={70} aria-invalid={Boolean(error)} aria-describedby={error ? "guided-error" : undefined} /></div>}
          {step === "title" && <div className="guided-fields"><label htmlFor="invitation-title">{t.titleLabel}</label><input id="invitation-title" autoFocus value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={eventName} maxLength={90} /></div>}
          {step === "date" && <div className="guided-fields"><label htmlFor="invitation-date">{t.dateLabel}<span className="guided-required">*</span></label><input id="invitation-date" autoFocus type="date" value={form.date} onChange={(e) => update("date", e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "guided-error" : undefined} /></div>}
          {step === "time" && <div className="guided-fields"><label htmlFor="invitation-time">{t.timeLabel}</label><input id="invitation-time" autoFocus type="time" value={form.time} onChange={(e) => update("time", e.target.value)} /></div>}
          {step === "venue" && <div className="guided-fields guided-related-fields"><label htmlFor="invitation-venue">{t.venueLabel}</label><input id="invitation-venue" autoFocus value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder={t.venuePlaceholder} maxLength={80} /><label htmlFor="invitation-address">{t.addressLabel}</label><input id="invitation-address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder={t.addressPlaceholder} maxLength={140} /></div>}
          {step === "message" && <div className="guided-fields"><label htmlFor="invitation-message">{t.messageLabel} <span className="guided-optional">· {t.optional}</span></label><textarea id="invitation-message" autoFocus value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={t.messagePlaceholder} maxLength={220} rows={3} /></div>}
          {step === "review" && <div className="guided-review-card">
            <div><span>{t.templateNames[["botanical", "editorial", "minimal"].indexOf(templateId)]}</span><strong>{form.hosts}</strong></div>
            <dl><div><dt>{t.dateLabel}</dt><dd>{form.date ? dateLabel : "—"}</dd></div><div><dt>{t.timeLabel}</dt><dd>{form.time || "—"}</dd></div><div><dt>{t.venueLabel}</dt><dd>{form.venue || "—"}</dd></div></dl>
            {shareUrl && <p className="guided-success" role="status">{notice}</p>}
            {shareUrl && <div className="guided-share-url"><input readOnly aria-label={t.copy} value={shareUrl} onFocus={(e) => e.currentTarget.select()} /><button type="button" onClick={() => void copyLink()}>{t.copy}</button></div>}
          </div>}
          {error && <p className="guided-error" id="guided-error" role="alert">{error}</p>}
          {notice && !shareUrl && <p className="guided-notice" role="status">{notice}</p>}
          <div className="guided-step-footer">
            <div className="guided-footer-left"><button type="button" className="guided-save" onClick={saveDraft}>{t.save}</button>{draftLoaded && <span className="guided-local-note">{t.local}</span>}</div>
            <div className="guided-footer-actions">
              {stepIndex > 0 && <button type="button" className="guided-back" onClick={previous}>← {t.previous}</button>}
              {isOptional && <button type="button" className="guided-skip" onClick={next}>{t.skip}</button>}
              {step !== "review" ? <button type="button" className="guided-next" onClick={next}>{t.next} <span>→</span></button>
                : !shareUrl ? <button type="button" className="guided-next" onClick={makeShareUrl}>{t.share} <span>↗</span></button>
                : <button type="button" className="guided-next" onClick={() => void nativeShare()}>{locale === "ru" ? "Поделиться" : locale === "uz" ? "Ulashish" : "Share"} <span>↗</span></button>}
            </div>
          </div>
          {step === "review" && shareUrl && <button type="button" className="guided-copy-secondary" onClick={() => void copyLink()}>{t.copy}</button>}
        </section>
        <aside className="guided-preview-panel" aria-label={t.preview}>
          <div className="guided-preview-heading"><span>{t.preview}</span><span>✦ ASTRON</span></div>
          <div className="guided-preview-stage"><InvitationArtwork template={templateId} theme={selectedTemplate.theme} invitationLabel={t.invitation} dateCaption={t.dateCaption} hosts={hostsValue} title={titleValue} date={dateValue} time={form.time} locationLabel={t.location} venue={form.venue} address={form.address} message={form.message || t.note} footerLabel="ASTRON STUDIO" compact /></div>
          <p className="guided-preview-caption">{t.previewTitle}</p>
        </aside>
      </div>
      <button type="button" className="guided-mobile-preview-toggle" onClick={() => setPreviewOpen((open) => !open)}>{previewOpen ? t.hidePreview : t.showPreview}</button>
    </main>
  );
}
