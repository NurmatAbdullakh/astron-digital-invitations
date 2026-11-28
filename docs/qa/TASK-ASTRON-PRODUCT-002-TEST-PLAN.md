# QA Plan — TASK-ASTRON-PRODUCT-002

**Status:** Test plan prepared; execution evidence pending  
**Target:** `feat/catalog-first-guided-invitation-flow` / PR #5

## Test scope

Verify the catalogue-first journey from localized entry through template selection, guided data entry, final review, share URL, and public invitation rendering.

## Acceptance test matrix

| ID | Scenario | Expected result | Priority |
|---|---|---|---|
| CAT-01 | Open `/ru`, `/uz`, `/en` | Redirects to matching localized catalogue | P1 |
| CAT-02 | Open catalogue without category | All three original templates are visible | P1 |
| CAT-03 | Choose each event category | Selected category remains active and is preserved in preview URL | P1 |
| CAT-04 | Open each template preview | Correct artwork, localized copy, and category sample render | P1 |
| CAT-05 | Use template | Builder opens with selected template and event type | P1 |
| WIZ-01 | Continue from empty names step | Progress is blocked and accessible error appears | P1 |
| WIZ-02 | Enter names and continue | Only next question appears; entered names remain | P1 |
| WIZ-03 | Leave headline blank | Localized event title fallback is used in preview/share payload | P1 |
| WIZ-04 | Continue with invalid/missing date | Progress is blocked | P1 |
| WIZ-05 | Enter a valid date | Localized date is shown in preview | P1 |
| WIZ-06 | Skip time | Time remains empty in the invitation | P2 |
| WIZ-07 | Skip venue/address | Builder advances without losing other fields | P2 |
| WIZ-08 | Skip optional message | Default invitation note is rendered | P2 |
| WIZ-09 | Navigate Back repeatedly | Previously entered values remain intact | P1 |
| WIZ-10 | Save and reload same browser | Compatible local draft is restored | P1 |
| WIZ-11 | Load malformed localStorage value | Builder remains usable and starts with safe defaults | P1 |
| WIZ-12 | Use mobile preview toggle | Preview opens without covering wizard action controls | P1 |
| WIZ-13 | Resize to 320px, 375px, tablet, desktop | No horizontal overflow; one-step form remains focused | P1 |
| SHARE-01 | Generate share URL with valid required data | URL is created and final review remains visible | P1 |
| SHARE-02 | Payload exceeds 5,000 characters | Link is not created; localized error is shown | P1 |
| SHARE-03 | Clipboard API works | URL is copied and confirmation appears | P1 |
| SHARE-04 | Clipboard API unavailable | Read-only URL remains selectable for manual copy | P2 |
| PUB-01 | Open valid share URL | Same selected template and invitation data render | P1 |
| PUB-02 | Missing/malformed JSON | Safe 404, no server crash | P1 |
| PUB-03 | Unsupported event type/template/theme | Safe 404 | P1 |
| PUB-04 | Overlong fields / invalid date or time | Safe 404 | P1 |
| A11Y-01 | Keyboard-only navigation | Links, inputs, and actions are reachable with visible focus | P1 |
| A11Y-02 | Screen reader form inspection | Inputs have labels; validation is announced | P1 |
| A11Y-03 | Reduced motion enabled | Non-essential transitions are disabled | P2 |

## Automated checks

Run in the repository root:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

The GitHub Actions workflow currently runs these checks for pull requests targeting `main`. PR #5 is a draft and its workflow status must be checked after the base/commit update. Local execution was unavailable in this environment because the GitHub host could not be resolved from the shell.

## Current verification evidence

- Static diff compared against PRD and task acceptance criteria.
- Repository scripts confirmed: `typecheck`, `lint`, `build`.
- GitHub Actions run `46105035506` (head `9d1946f6d92cd0bdf4c30dade2757b54e4acb58d`) executed dependency installation successfully, then TypeScript failed at `src/app/[locale]/templates/page.tsx:115` because the selected category could be `undefined`.
- Fixed the category narrowing in commit `61c8f9f9530f0b7ae80e09f768576ac75996fdfa` using a typed `find(...) ?? "all"` fallback.
- Follow-up GitHub Actions run `46105227121` completed successfully for PR #5 (merge commit `17cceb360093fe70dcaf96a0220e21043d635a53`, built from head `346eb4773ae1f9e659992933cf853f4ff95987e6` against `main`). Dependency installation, TypeScript typecheck, ESLint, and production build all passed.
- The typecheck fix is included in the tested head. No source changes were made after this successful run; remaining commits after it are documentation-only.
- Real-browser QA, viewport screenshots, and screen-reader testing have not been executed.
- Do not mark the task DONE until CI and browser QA evidence are recorded.

## QA handoff

**Next owner:** QA Engineer  
**Next action:** Run the automated checks and execute CAT/WIZ/SHARE/PUB/A11Y scenarios at 320px, 375px, tablet, and desktop. File defects with reproduction steps and severity.
