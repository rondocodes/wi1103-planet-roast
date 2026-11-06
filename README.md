# Planet Roast: Midterm Meltdown

**Save the planet. Survive the syllabus.** An English WI1103 sustainability revision game with original SVG characters, local authored humor, and useful explanations. React + TypeScript + Vite; no backend, account, paid services, or AI API.

## Develop

Use Node 24 (`nvm use` if available), then run from this checkout:

```sh
npm ci
npm run dev
```

Vite serves the application under `/wi1103-planet-roast/`. There are no required credentials or environment variables. Use the existing isolated checkout; no Git worktree is needed.

```sh
npm run validate:content
npm run typecheck
npm test
npm run build
npm run preview
```

The production build is in `dist/`. Only that directory belongs in deployment. Dependency versions and integrity hashes are fixed by `package-lock.json`.

## What works

- Cram: ten distinct eligible items, optionally filtered by topic; shuffled choices preserve original identities.
- Four immediately available boss chapters, up to five questions each, with real HP outcomes.
- Mistake Rematch: actual unresolved misses, one spaced retry after three other distinct submissions when possible, and two later unaided correct responses to resolve a miss.
- 2025 Paper Simulation: 36 original-order supplied items, changeable answers, bookmarks, an absolute persisted 60-minute deadline, deferred explanations, and one-time finalization. Incorrect and unanswered gradable items enter Rematch. No arcade XP or mastery is awarded.
- A searchable 36-item library, chapter/mistake/bookmark/issue filters, original option explanations and source notes. Q38 and Q41 have qualitative conceptual illustrations.
- Lifetime per-source XP reward guards, hint rules, streak multipliers, nonblocking Study Energy, and first-attempt run accuracy.
- Versioned local progress, validated JSON import/export, confirmed reset, editable/anonymous name, immediate Off/Mild/Spicy controls, optional sound, reduced-motion support, keyboard controls, and responsive layout.

A–E or 1–5 selects displayed options while focus is on the question or page; Enter submits. Buttons also work with normal Tab/Space/Enter controls. Shortcuts do not intercept form fields, dialogs, or focused buttons. Selecting an answer never submits it automatically.

XP is fictional, not actual CO₂ avoided. Local scores are editable and are not competitive or secure. Recall records do not predict an exam grade. Loaded sessions require no API; a fresh offline launch is not guaranteed. No service worker/PWA is included. Progress belongs to one browser profile; export it for a backup. Avoid editing the same profile in multiple tabs simultaneously.

## Source integrity

**Study key: inferred; not lecturer-verified.** The bank has exactly 36 English adaptations: Q1–7 and Q18–46. Q8–17 are absent. It is not a complete 46-question mock. There is no official answer key.

32 answers are provisional; Q5/Q6/Q7/Q33 are ungraded source issues, included in review and simulation but excluded from scoring and mastery. Historical statistics remain historical exam context. Read [CONTENT_REVIEW.md](CONTENT_REVIEW.md), [PRD.md](PRD.md), and [content/references.json](content/references.json). Supporting references explain concepts; they do not certify lecturer grading. The optional original PDF is not bundled. Put any local copy in ignored `private-source/` and never deploy it.

## Validation

`npm test` covers content mappings, shuffling, streak boundaries, hints, duplicate submits/reload, reward eligibility, blocked neutrality, energy/skip behavior, rematch spacing/recovery, recall across runs, exam finalization/deadlines, and storage recovery.

A browser regression script uses an installed Chromium:

```sh
# With the dev server running (default port 5173):
node scripts/browser-check.mjs
# Or against the production preview server:
TEST_URL=http://127.0.0.1:4173/wi1103-planet-roast/ node scripts/browser-check.mjs
```

It expects `/usr/bin/chromium`; override `CHROMIUM_PATH` if needed. It completes real Cram, Rematch, boss and simulation flows, checks keyboard/reload/settings/library behavior, and inspects desktop and 360 px layouts. Screenshots are written to `/tmp/planet-roast-*.png`. Use a disposable browser context; the script resets its own profile.

## GitHub Pages (prepared, not published)

Push/PR checks run in `.github/workflows/ci.yml`. Production publication is **manual only** through `pages.yml` (`workflow_dispatch`). The fixed Vite base is `/wi1103-planet-roast/`; update it if the repository is renamed. Navigation stays within the application and does not require server rewrites.

When you choose to publish, select **GitHub Actions** as the repository's Pages source, then run **Publish to GitHub Pages (manual)**. Only `dist/` is uploaded. Public hosting exposes the bundled English question bank even when the repository is private. Do not put private source PDFs in public assets. Hosting availability/permissions depend on the repository/account plan. A prepared workflow is not a deployed website; observe a successful run before sharing a live URL.

Official guidance: https://vite.dev/guide/static-deploy#github-pages and https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
