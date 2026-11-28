# Astron Digital Invitations — Product Requirements Document

**Document status:** Product Owner draft for implementation  
**Version:** 1.0  
**Date:** 2026-11-28  
**Product:** Astron Digital Invitations  
**Repository:** https://github.com/NurmatAbdullakh/astron-digital-invitations

## 1. Product overview

Astron Digital Invitations is a self-service platform where a person chooses a professionally designed digital invitation, personalizes it through a guided wizard, previews the result, and shares a public invitation link with guests.

The experience must feel as straightforward as buying a product from an e-commerce store. Users browse a visual catalogue, inspect a template before committing, choose it, then complete a small number of focused steps. The product—not the user—owns the process guidance.

**Core product promise:** choose a design, answer a few simple questions, and get a beautiful invitation link without technical knowledge.

## 2. Problem and opportunity

People organizing weddings, birthdays, family celebrations, graduations, and corporate events need invitations that look polished and are easy to distribute. Traditional printed invitations require design, printing, and delivery. Generic DIY editors can overwhelm non-technical users with too many controls.

Astron reduces this friction by combining curated designs with a guided creation journey and a mobile-friendly public invitation.

## 3. Goals and success measures

### Product goals
1. Make template discovery the first meaningful experience.
2. Let users inspect a template before selecting it.
3. Reduce cognitive load by asking for one piece of information or one related group at a time.
4. Keep the selected template and event data consistent across editor preview and public invitation.
5. Support Uzbek, Russian, and English.
6. Deliver a mobile-first, accessible experience with clear recovery and progress.

### Proposed MVP metrics
- Catalogue-to-template-preview click-through rate.
- Preview-to-template-selection rate.
- Wizard start-to-completion rate.
- Median time from template selection to completed preview.
- Step-level abandonment rate.
- Share-link copy/share success rate.
- Validation error rate per wizard step.
- Mobile completion rate.

Targets should be set after baseline analytics exist; no numerical conversion target is assumed yet.

## 4. Target users and jobs-to-be-done

### Primary user
A person planning an event who wants a polished invitation but does not know design tools or website builders.

### Secondary user
A small event organizer or service provider preparing invitations for clients.

### User needs
- Browse designs visually rather than understand technical template names.
- See a realistic preview before choosing.
- Understand what information is needed and why.
- Enter information in a comfortable sequence.
- Correct mistakes without losing progress.
- Preview the final invitation before sharing.
- Send a link through messaging apps.

## 5. Product principles

1. **Catalogue first:** the localized entry experience is a visual template marketplace, not a blank editor.
2. **Preview before commitment:** every template has a dedicated preview experience.
3. **Progressive disclosure:** never show the entire data form at once.
4. **One decision per step:** one question or a small group of strongly related fields per screen.
5. **No dead ends:** every step has a clear back/continue action, progress indicator, and helpful empty/error state.
6. **Live result:** preview uses the same template renderer and data model as the public invitation.
7. **Mobile first, desktop restrained:** desktop may use whitespace and a compact preview, but must not turn the wizard into a large multi-column form.
8. **Honest capability:** local drafts and query-string sharing must not be presented as cloud persistence or a permanently hosted invitation.
9. **Accessible by default:** semantic controls, visible focus, labels, keyboard operation, reduced motion, and readable contrast.

## 6. Scope

### MVP in scope
- Localized catalogue at the main entry route.
- Event category filters and template cards.
- Template detail/preview route.
- Desktop/mobile preview mode where practical.
- Template selection that preserves template and event category.
- Guided invitation wizard with focused steps:
  1. Event participants/hosts (e.g. couple names).
  2. Invitation headline/event title.
  3. Event date.
  4. Event time.
  5. Venue and address (related fields).
  6. Optional message for guests.
  7. Final review and share.
- Inline validation and contextual examples.
- Local browser draft save/restore, scoped by locale and draft/template identity.
- Live preview using the selected original template artwork.
- Share URL generation with payload-size guard and clipboard fallback.
- Public invitation rendering with malformed-payload handling.
- SEO metadata and localized routes.
- Product, design, architecture, task, and QA documentation.

### Explicitly out of scope for this implementation phase
- User registration and account dashboard.
- Server-side invitation persistence and cross-device draft sync.
- Payments, Click/Payme integration, subscriptions, and paid template entitlements.
- Custom domains and permanent slug-based publishing.
- Guest RSVP collection, attendee database, email/SMS notifications.
- Image upload/gallery hosting.
- Admin CMS for managing templates.
- AI-generated designs or copy.
- Analytics vendor integration (events are specified, provider selection deferred).

These are future product capabilities and must not be implied by the MVP UI.

## 7. Information architecture

- `/{locale}` — primary catalogue entry.
- `/{locale}/templates` — catalogue route (may remain a stable alias).
- `/{locale}/templates/{templateId}` — template preview and selection.
- `/{locale}/create?type={eventType}&template={templateId}` — guided builder.
- `/{locale}/invite?data={encodedInvitation}` — shareable public invitation preview for the current MVP.

Supported locales: `uz`, `ru`, `en`.

## 8. Core user journeys

### Journey A — discover and choose
1. User opens the site.
2. User sees a catalogue with event categories and template cards.
3. User can inspect a card's full preview.
4. User chooses “Use this template”.
5. Product opens the wizard with the selected template and event category already applied.

### Journey B — create invitation
1. User sees a short welcome and progress (e.g. “Step 1 of 6”).
2. User enters hosts/participants.
3. User enters or confirms the invitation title.
4. User chooses a date.
5. User chooses a time.
6. User enters venue and address; address may be skipped.
7. User adds an optional message.
8. User reviews the final invitation.
9. User generates a share link and copies it or uses native share.

### Journey C — return to a draft
1. User reopens the builder in the same browser.
2. Product detects a compatible local draft.
3. Product restores fields and the selected template.
4. User can continue or replace the draft intentionally.

### Journey D — guest opens invitation
1. Guest opens the shared URL.
2. Public route parses and validates the payload.
3. Valid payload renders the chosen template.
4. Invalid/missing payload produces a safe localized fallback, never a runtime crash.

## 9. Functional requirements

### Catalogue
- FR-CAT-01: Show available templates as visual product cards.
- FR-CAT-02: Provide event-type filters (wedding, birthday, family, corporate, graduation).
- FR-CAT-03: Cards show preview artwork, localized name, short description, and a clear preview action.
- FR-CAT-04: Selecting preview opens a dedicated template route without requiring account creation or event data.
- FR-CAT-05: Template selection preserves locale, event type, and template ID.
- FR-CAT-06: Empty filters and unknown template IDs have safe states.

### Template preview
- FR-PRE-01: Render the selected template with realistic sample content.
- FR-PRE-02: Explain the visual style and intended use in plain language.
- FR-PRE-03: Provide a primary “Use this template” action and a return-to-catalogue action.
- FR-PRE-04: Provide responsive preview; no misleading interactions that do not work.

### Guided wizard
- FR-WIZ-01: Show only the active step's inputs.
- FR-WIZ-02: Show step title, short helper copy, progress, Back, and Continue.
- FR-WIZ-03: Group only related fields (venue + address); never show all fields together.
- FR-WIZ-04: Validate required values before advancing and associate errors with fields.
- FR-WIZ-05: Optional fields are explicitly marked and can be skipped.
- FR-WIZ-06: Preserve entered values when navigating backward/forward.
- FR-WIZ-07: Persist draft locally and restore safely.
- FR-WIZ-08: Selected template is retained throughout the wizard.
- FR-WIZ-09: Preview updates when values change.
- FR-WIZ-10: On narrow screens, preview may be opened as a separate view; it must not compress the question form into an unusable layout.
- FR-WIZ-11: Desktop must retain the same step sequence and limited field count as mobile.

### Share and public page
- FR-SHR-01: Final review shows the actual invitation, not a generic success message alone.
- FR-SHR-02: Share action validates required data.
- FR-SHR-03: Share URL is generated with a strict maximum length.
- FR-SHR-04: Clipboard copy is available when native share is absent or cancelled.
- FR-SHR-05: Public route validates payload shape, lengths, enum values, and template ID.
- FR-SHR-06: The same template renderer is used for editor preview and public invitation.

### Localization and accessibility
- FR-I18N-01: All user-facing catalogue, preview, wizard, error, and share strings are available in Uzbek, Russian, and English.
- FR-A11Y-01: Every form control has an accessible label.
- FR-A11Y-02: Progress is exposed in text, not color alone.
- FR-A11Y-03: Keyboard navigation and visible focus are supported.
- FR-A11Y-04: Reduced-motion preferences are respected.
- FR-A11Y-05: Responsive layouts work at 320px, 375px, tablet, and desktop widths.

## 10. Business rules and validation

- BR-01: Supported event types are wedding, birthday, family, corporate, and graduation.
- BR-02: Supported templates are only IDs present in the typed template catalogue.
- BR-03: Hosts/participants and event date are required for the initial MVP share action.
- BR-04: Event title may have a safe localized default based on event type if left blank; user can edit it.
- BR-05: Time, venue, address, and guest message are optional unless a future product decision changes this.
- BR-06: Text fields have explicit maximum lengths; values are trimmed before URL generation.
- BR-07: Dates must be valid date-only values and not malformed strings.
- BR-08: Local draft content is untrusted and must be parsed defensively.
- BR-09: Public URL query payload is untrusted; malformed or oversized payloads must be rejected safely.
- BR-10: Local browser draft is not a cloud backup and may be unavailable on another device/browser.
- BR-11: The current share URL is a preview/share mechanism, not guaranteed permanent hosting. Durable publication requires backend persistence and is a later milestone.

## 11. UX specification

### Catalogue layout
- Header: Astron mark, concise navigation, locale switch.
- Intro: clear title and one-sentence promise.
- Category chips: horizontally scrollable on mobile, wrap on desktop.
- Template grid: large portrait artwork cards; title, description, Preview and Use actions.
- Card previews must use the actual reusable invitation artwork.
- No mandatory sign-up before preview.

### Template detail
- Back to catalogue.
- Large, legible invitation rendering with realistic sample data.
- Template title, short style description, and category compatibility.
- Desktop/mobile toggle only if it changes the actual preview frame.
- Primary CTA: “Use this template”.

### Wizard shell
- Header with Astron brand, “Back to templates”, and step progress.
- Main content: one clear question, short helper line, one input or related input group.
- Action footer anchored to viewport bottom.
- Desktop may show a compact live invitation preview beside the form; it must not increase the number of visible form fields.
- Mobile shows the question as primary and preview via an explicit preview action or compact panel.
- Avoid page-level horizontal scrolling. If content exceeds viewport height, the content region—not the whole shell—may scroll.

### Step copy examples (Russian primary)
1. “Кого приглашаем?” — “Например, Анна и Михаил”.
2. “Как назовём событие?” — default title suggested based on event type.
3. “Когда состоится праздник?” — date picker.
4. “Во сколько начнём?” — time picker, skip allowed.
5. “Где встретимся?” — venue and address in one related group.
6. “Добавим пожелание гостям?” — optional short message.
7. “Проверьте приглашение” — full final preview and share.

## 12. Data model (MVP client contract)

```ts
type EventType = "wedding" | "birthday" | "family" | "corporate" | "graduation";
type InvitationTemplateId = "botanical" | "editorial" | "minimal";

type InvitationDraft = {
  schemaVersion: 1;
  eventType: EventType;
  templateId: InvitationTemplateId;
  title: string;
  hosts: string;
  date: string;       // YYYY-MM-DD
  time?: string;      // HH:mm
  venue?: string;
  address?: string;
  message?: string;
  updatedAt: string;  // ISO timestamp
};
```

The existing public invitation contract may retain compatible field names (`type`, `template`) during this UI iteration to avoid breaking existing share links. Any schema migration must be explicit.

## 13. Architecture constraints

- Keep the current Next.js App Router, React 19, TypeScript, and CSS stack.
- Keep template metadata in one typed catalogue.
- Keep template data independent of user invitation content.
- Use one shared `InvitationArtwork` component for catalogue cards, template preview, wizard preview, and public invitation.
- Do not add dependencies unless justified by a recorded decision.
- Do not invent a backend, database, payment integration, or cloud persistence in this frontend MVP.
- Preserve locale-aware routes and existing SEO metadata where possible.

## 14. Non-functional requirements

- Performance: no unnecessary client-side bundles on catalogue/preview pages; avoid heavy animation libraries.
- Reliability: invalid query parameters and localStorage values must fail safely.
- Privacy: no personal invitation data sent to third-party analytics in this phase.
- Security: escape user-provided content through React rendering; never inject invitation text as raw HTML.
- Accessibility: semantic landmarks, labelled inputs, focus-visible styles, reduced motion.
- Compatibility: current evergreen desktop and mobile browsers; graceful fallback for clipboard/share APIs.
- Maintainability: typed domain models, reusable components, localized copy, no duplicated template rendering logic.

## 15. Acceptance criteria / Definition of Done

- [ ] Main locale entry opens the template catalogue.
- [ ] Event filters update the visible template list.
- [ ] Every template card can open its own preview route.
- [ ] Preview route displays the selected actual artwork and a working selection CTA.
- [ ] Selecting a template opens the wizard with the chosen template and event type.
- [ ] Wizard asks one focused question per step; no full-form screen exists.
- [ ] Back/Continue preserve values and progress.
- [ ] Required fields are validated with visible and accessible feedback.
- [ ] Optional fields can be skipped.
- [ ] Draft save/restore is scoped and defensive.
- [ ] Live preview reflects the current draft.
- [ ] Final review shows the invitation and share actions.
- [ ] Share URL respects payload limit and clipboard fallback works.
- [ ] Public invitation safely handles malformed data.
- [ ] Uzbek, Russian, and English are complete for changed flows.
- [ ] Layout is usable at 320px, 375px, tablet, and desktop.
- [ ] Typecheck, lint, production build, and available browser QA are recorded.
- [ ] Security and Team Lead reviews are documented.
- [ ] PR is open for human review; no merge or production deployment without owner approval.

## 16. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Query-string share URLs are long and expose event details in the URL | Link failure / privacy concern | Strict size guard; explain limitation; plan server-side opaque IDs |
| Local drafts are device-specific | User may lose progress | Explicit save notice; defensive restore; future account-backed persistence |
| User mistakes sample preview for a published invitation | Confusion | Label preview/share state accurately |
| Template catalogue grows | Harder browsing | Category filters, search/sort later, consistent metadata |
| Public invitation data is untrusted | Broken page / XSS risk | Runtime validation, React text rendering, payload size cap |
| Payment/publication assumptions creep into MVP | False promises | Keep payment and durable publishing out of current scope |

## 17. Delivery plan

1. Product/BA: approve this PRD and record assumptions.
2. PM: create implementation task and dependency order.
3. UI/UX: implement catalogue, template preview, and guided-step interaction specification.
4. Architect: record client data contract and URL/draft limitations.
5. Frontend: implement routes, catalogue, preview, wizard, localization, and responsive styles.
6. QA: run acceptance and responsive regression checks.
7. Security: review URL payload, localStorage, and user-generated content handling.
8. Team Lead: integration review and handoff.
9. Product Owner: accept/reject PR; merge remains a human approval gate.

## 18. Open decisions for later milestones

- Whether invitations become durable public pages with opaque slugs and server persistence.
- Whether account creation is required before or after the first invitation.
- Free/paid template model and pricing.
- Click/Payme payment provider and refund/entitlement rules.
- RSVP fields, guest management, and notifications.
- Image upload, storage provider, and moderation policy.
- Template CMS and release workflow.
- Analytics provider and privacy/consent model.
