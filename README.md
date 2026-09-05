# IsoKidova

**Personalized learning for every child.**

IsoKidova helps private tutors turn a quick child assessment into a professional learning report and a personalized
14-day learning plan, which they can review, edit, and share privately with the child's parent - no parent account
required.

This is **MVP 1**: the foundation (Tutor → Child → Assessment → AI report → Parent share). It intentionally does not
include payments, child/parent accounts, messaging, or analytics - see [What remains unfinished](#what-remains-unfinished).

## Tech stack

- **Vite + React 19 + React Router 7** - single-page app, mobile-first, responsive.
- **Tailwind CSS v4** - warm, modern educational-SaaS visual system (see `src/index.css`).
- **Supabase** (Postgres + Auth) - tutor authentication and all data storage, with Row Level Security scoping every
  table to the tutor who owns it.
- **AI layer** - a small provider abstraction (`src/lib/ai/`) with a **mock provider** wired up by default, so the
  full workflow (assessment → report → 14-day plan) works with zero API keys and zero cost. See
  [AI provider](#ai-provider) below for how to plug in a real one later.
- **Vercel** - static hosting for the SPA (`vercel.json` rewrites all routes to `index.html`).

This mirrors the stack of an existing sibling project (BeautyFlow) intentionally, but IsoKidova is a fully separate
codebase, database, and product - nothing is shared between them.

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes, to use auth/data | Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes, to use auth/data | Project Settings → API → anon public key |
| `VITE_AI_PROVIDER` | No | Which AI provider to use. Defaults to `mock`. |

Without Supabase configured, the app still builds and runs - every screen that needs the database shows a friendly
"this app isn't connected to a database yet" message instead of crashing, so you can preview the UI immediately.

**Never commit real keys.** `.env` is gitignored. The anon key is safe in the browser bundle by design (it only
grants what Row Level Security allows); nothing server-only (a service-role key, a real AI provider's secret key) is
ever referenced from `src/`.

## Database setup

1. Create a Supabase project.
2. Open the SQL Editor and run the contents of `supabase/schema.sql` once. It's idempotent (safe to re-run).
3. Copy the project URL and anon key into `.env`.

This creates: `profiles`, `children`, `assessments`, `learning_reports`, `learning_plan_days`, `parent_share_links`,
and `progress` (unused by the UI yet, reserved for the Child Learning Coach / progress-tracking features described
below). Every table is scoped to the owning tutor via Row Level Security. Parent share links are read through a
single `get_shared_report(token)` Postgres function (SECURITY DEFINER) that returns only child-facing fields - a
parent can never see tutor account info, and there's no RLS policy that lets `anon` query the report tables directly.

## AI provider & curriculum engine

MVP 1 ships with `src/lib/ai/providers/mockProvider.js`: it takes the tutor's own free-text assessment (strengths,
weaknesses, topics assessed, results, observations) and turns it into a structured report - ranked learning gaps, a
"why this matters" explanation, a 14-day goal, and a personalized 14-day plan - with no network call, no API key, no
cost. This is what makes the whole workflow testable today.

The 14-day plan itself is built by `src/lib/ai/curriculum/`, organized by subject:

- `mathematics/multiplicationTables.js`, `mathematics/fractions.js`
- `reading/comprehension.js`
- `english/vocabulary.js`
- `science/scientificMethod.js`
- `genericPhaseBuilder.js` - a concrete, phase-aware fallback for any weakness that doesn't match one of the above (never a vague "practice the skill")

`curriculum/index.js` picks a curriculum by matching the tutor's weaknesses/topics-assessed text; every module follows
the same 14-day progression (foundation days 1-3, guided practice 4-6, checkpoint day 7, application 8-10,
independent/challenge 11-13, final review day 14) and the same day shape (title, learning objective, tutor activity,
child practice, teaching tip, success check, estimated time, difficulty). To add another subject: create a new module
under `curriculum/<subject>/` exporting `subject`, `topic`, `matches(text)`, and `build({child, assessment, score,
focusPool})`, then register it in `curriculum/index.js` - nothing else needs to change.

Every generated report is checked by `src/lib/ai/validate.js` before it's trusted (`generateLearningReport()` in
`src/lib/ai/index.js` rejects anything with an empty required field or fewer than 14 days) - a safety net that matters
more once a real, occasionally-imperfect model is generating content.

To add a real AI provider later:

1. Create `src/lib/ai/providers/yourProvider.js` implementing the `AIProvider` contract documented via JSDoc at the
   top of `src/lib/ai/index.js` - the same `generate({ child, assessment })` shape as `mockProvider.js`.
2. Register it in `PROVIDERS` in `src/lib/ai/index.js` and set `VITE_AI_PROVIDER` to its id. The validation gate
   applies automatically to any provider's output.
3. **If the provider needs a secret API key**, do not call the AI API directly from the browser. Add a Vercel
   serverless function under `api/` (the same pattern as this project would use for any other server-only secret)
   that holds the key and does the generation, and have the provider's `generate()` call that endpoint instead.

## Tests

```bash
npm test    # vitest run - src/lib/ai/curriculum.test.js
```

Deterministic tests (the mock provider has no randomness; its artificial UX delay is skipped under `vitest`) covering:
grade-3 multiplication, reading comprehension, fractions, English vocabulary, science, two children with different
weaknesses producing genuinely different plans, and age-appropriate session-length differences - plus an end-to-end
check that every hand-authored curriculum and the generic fallback pass `validateReport()`.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## How to test the MVP

With Supabase configured (see above):

1. **Sign up** at `/signup` with name/email/password.
2. **Log in** at `/login`.
3. From the dashboard, **Add Child** - fill in child info and the assessment fields (placeholders show example input).
4. Click **Generate Learning Plan** - see the loading state, then the generated report.
5. **Edit** any field (strengths, learning gaps, priority goal, recommended practice, any day's activity/time/difficulty/success criterion).
6. **Save Changes**.
7. **Share with Parent** - copy the generated link.
8. Open the link in a private/incognito window (no login) - confirm the parent sees the report and the disclaimer,
   and cannot reach anything else in the app.
9. Try an invalid share token (e.g. `/share/not-a-real-token`) - confirm the friendly "link isn't available" state.
10. Try submitting the Add Child form with the child name blank - confirm the inline validation message.
11. Resize the browser to a phone width - confirm the layout stays usable (no horizontal scroll, forms and cards stack).

Without Supabase configured, every gated screen shows a clear "not connected to a database" message instead of
crashing - useful for a pure UI/design pass.

## What was built

- Landing page, Sign Up, Login (tutor auth via Supabase).
- Tutor Dashboard (counts, recent reports, empty states).
- Children list + Child detail (past reports for that child).
- Add Child / Assessment form (single flow, per the spec) - also reusable for a new assessment on an existing child.
- AI report generation with a professional loading state, backed by the mock provider.
- Full report review/edit screen (strengths, learning gaps, priority goal, recommended practice, all 14 days), Save
  Changes, and Share with Parent (generates a private, unpredictable share link).
- Public Parent View at `/share/:token` - no account needed, shows only what a parent should see, with the required
  disclaimer.
- Supabase schema with Row Level Security on every table, plus a SECURITY DEFINER function for the parent share path.
- Friendly error states throughout (failed AI generation, empty required fields, database errors, invalid/expired
  share links) - no raw technical errors are ever shown to a user.

## Database schema

See `supabase/schema.sql` for the full, commented definition. Summary:

- `profiles` - one row per tutor (auto-created on sign up).
- `children` - `tutor_id`, name, age, grade, subject.
- `assessments` - free-text tutor input per child (strengths, weaknesses, topics assessed, results, observations, notes).
- `learning_reports` - the generated/edited report; captures a snapshot of the child's name/age/grade/subject at
  generation time so a share link stays stable and self-contained.
- `learning_plan_days` - 14 rows per report: day number, title, focus skill, learning objective, activity (the
  tutor's teaching procedure), child practice, teaching tip, estimated time, difficulty, success criterion (the
  measurable check) - see `src/lib/api/learningPlanDay.js` for the exact column-name mapping.
- `parent_share_links` - `report_id`, unpredictable token (256-bit, generated client-side via Web Crypto), revocable.
- `progress` - reserved for future progress tracking (see below); not used by MVP 1's UI.

## What remains unfinished (by design - see spec section 19)

Not built, on purpose, because MVP 1 is scoped to validate the core tutor workflow first: payments/subscriptions,
child or parent accounts, messaging/email/WhatsApp automation, social login, complex analytics, gamification, an AI
chatbot, multiple languages, and complex roles/permissions.

The schema (and the `progress` table specifically) is deliberately ready for, but does not implement: a Child
Learning Coach (child login, daily activities, scored exercises), a Parent Dashboard (progress over time), and a
richer Tutor Dashboard (alerts, recommended next steps) - adding these should not require touching the tables or
policies that already exist.

## Assumptions made

- "Tutor" is the only account type for MVP 1; a child's identity lives only as a row in `children`, not an auth user.
- Revoking a share link (`revoked_at`) is modeled in the schema, but there's no tutor-facing "revoke" button yet in
  the UI - only creation. Straightforward to add (`revokeShareLink` already exists in `src/lib/api/shareLinks.js`).
- Grade and subject are free text (not a fixed dropdown), since these vary a lot by school system and tutoring
  context, and the spec asked to keep the form simple.
- The mock AI provider is deliberately template-based rather than random, so the same input produces a consistent,
  specific report - useful for demoing and testing, and a fair stand-in for what a real model would need to produce
  (specific, non-vague learning gaps; age-appropriate pacing; a review day at day 7 and day 14).

## Issues that need your decision

- **Live testing**: I don't have a Supabase project's credentials in this environment, so I validated the AI mock
  logic directly (unit-style, via Node) and the full UI (rendering, responsiveness, validation, guard states) via a
  headless browser, but I could not click through the live sign-up → generate → save → share → parent-view chain
  against a real database. Once you add your Supabase URL/anon key, that end-to-end path is the first thing worth
  running through by hand (steps above).
- **Real AI provider**: whenever you're ready to move past the mock, decide which provider and whether generation
  should happen from a Vercel function (recommended, so a secret key never reaches the browser) - the codebase is
  already structured for that swap.
