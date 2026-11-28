# Security Review — TASK-ASTRON-PRODUCT-002

**Status:** Initial static review; runtime verification pending  
**Scope:** Catalogue, guided builder, local drafts, share URL, public invitation route.

## Assets and trust boundaries

- User-entered names, title, date, venue, address, and message.
- Browser-local draft stored in localStorage.
- Share payload serialized into a URL query parameter.
- Public invitation page parses untrusted query data and renders it into React components.

## Findings

### SEC-01 — Personal event data is visible in the share URL
**Severity:** Medium (inherent MVP limitation)  
**Evidence:** The builder serializes invitation fields into the `data` query parameter. Anyone with the URL can inspect the encoded values; browser history, copied messages, and infrastructure logs may retain the URL.

**Impact:** Names, event date, venue, and address may be exposed beyond the intended guest list if the URL is forwarded or logged.

**Mitigation in this PR:** Explicitly disclose in the product copy that the current MVP stores invitation data in the link; cap the complete URL at 5,000 characters.

**Required future mitigation:** Replace query payloads with opaque, high-entropy invitation IDs backed by server-side persistence. Define access/deletion/expiry behavior and privacy terms before public launch. Do not put sensitive information in invitation fields.

### SEC-02 — Untrusted public payload validation
**Severity:** Mitigated in code; runtime tests pending  
**Evidence:** Public route rejects missing/oversized payloads, malformed JSON, unsupported event types, invalid template IDs, theme/template mismatch, invalid dates/times, and overlong strings.

**Mitigation:** Keep strict runtime validation at the public route. Add regression tests for every rejected case listed in the QA plan.

### SEC-03 — User-provided text rendering
**Severity:** No confirmed issue in inspected implementation  
**Evidence:** Invitation fields are passed as React text props; no raw HTML injection is used in the invitation artwork renderer.

**Mitigation:** Continue using normal React escaping. Never render user content through `dangerouslySetInnerHTML`.

### SEC-04 — Browser-local draft privacy
**Severity:** Low to Medium (browser profile dependent)  
**Evidence:** Drafts are stored in same-origin localStorage without encryption or account isolation.

**Impact:** Anyone with access to the same unlocked browser profile can inspect the draft.

**Mitigation:** State that drafts are local to this browser/device. Avoid storing authentication tokens or sensitive documents here. Clear/remove draft controls can be added in a future iteration.

## Not in scope / not assessed

- Authentication and account authorization (not implemented).
- Server-side tenant isolation / IDOR (no backend persistence in this MVP).
- Payments and payment webhook verification (not implemented).
- File uploads, image processing, and storage (not implemented).
- Production headers, CSP, rate limiting, infrastructure logs, and deployment configuration (not available for this review).

## Security recommendation

Do not describe this MVP as permanent/private hosting. Before durable public publishing or payments, introduce server-side invitation records, opaque IDs, ownership authorization, rate limits, privacy controls, and integration-specific threat review.

## Handoff

**Next owner:** Security Reviewer  
**Next action:** Verify payload validation with automated negative tests and review production response headers once a deployable environment is available.
