# Planet Roast: Midterm Meltdown

**Repository:** wi1103-planet-roast  
**Tagline:** Save the planet. Survive the syllabus.  
**Product:** English browser game for WI1103 Principles of Sustainability revision.  
**Audience:** First-year international-class students; initially Rondo.  
**Priority:** A usable study game for the next-day midterm.  
**Status:** Build specification, not an implemented or deployed app.

## 1. Product promise

Turn the supplied 2025/2026 Version A paper into a funny quiz adventure. Fight cartoon sustainability villains by understanding concepts, earning XP, and fixing mistakes. Every wrong answer leads to a useful explanation and another chance. The roast is the wrapper; learning is the product.

The game must work without registration, a backend, paid services, or an AI API. All questions, explanations, and jokes ship with the app. Success means the player can start immediately, complete a short run, understand mistakes, and identify what to revise. Do not promise an exam grade or predict which questions will appear.

## 2. Source facts and content integrity

The supplied PDF, UTS Pengantar Prinsip Keberlanjutan 2025 Versi A.pdf, has 13 pages and states a 60-minute exam duration. It contains **36 questions: 1–7 and 18–46**. Q8–17 are absent. There is no official answer key in the supplied file.

The included content/questions.seed.json contains 36 English study adaptations retaining original question numbers, A–E option correspondence, and page references. Its 32 gradable answers are **provisional inferences**. Four records are ungraded review cards by default: **Q5, Q6, Q7, Q33**. Read CONTENT_REVIEW.md before implementing scoring.

- Never invent the missing ten questions or label generated questions as original material.
- Display “Study key: inferred; not lecturer-verified” in the library, session setup, and results. Each explanation shows its status and source question number.
- Historical NDC targets, country figures, and boundary counts remain historical exam context.
- A blocked record has answerOptionId null. It never changes XP, hearts, accuracy, streak, boss HP, or mastery. Show its issue and concept explanation.
- Never silently repair an original question. A corrected practice item needs a new ID, origin generated-practice, and a parent source ID.
- Separate a likely intended answer, a scientific qualification, and official verification. Web support for a concept does not certify a lecturer's key.
- The PDF is not included in the kit. An optional local copy belongs in ignored private-source/. The seed is sufficient to build; do not wait for the PDF.

## 3. Personality and visual direction

A comic arcade study desk: dark navy, mint highlights, orange warning accents, chunky panels, and readable answer cards. The narrator is **Dr. Trashfire**, a dramatic talking recycling bin with terrible emotional support and useful explanations. An original planet mascot looks less stressed as a run progresses.

All interface text, questions, jokes, explanations, labels, and accessibility text are English. Default player name is “Rondo”; allow editing it or playing anonymously. Never interpolate the name into HTML.

Suggested palette: background #101827, panel #1B273A, mint #86EFAC, orange #FDBA74, white #F8FAFC, error #FDA4AF. Verify contrast. Use a readable system font for body text; display treatments belong only in short headings. Create original SVG/CSS characters; no remote fonts or image services are required.

## 4. MVP and implementation order

| Priority | Capability | Done when |
| --- | --- | --- |
| P0 | Cram Run | Ten distinct eligible items, or every eligible item if fewer; full explanations/results |
| P0 | Points and feedback | Exact scoring below; one resolved submission per attempt |
| P0 | Mistake Rematch | Actual misses, revisit spacing, no XP farming |
| P0 | Content Library | All 36 items, term search, original numbers, review warnings |
| P0 | Settings and persistence | Roast/sound/motion controls, saved progress, reset/export |
| P0 | Mobile and keyboard | Main flow works at 360 px and with keyboard alone |
| P1 | Boss Campaign | Four short themed battles using existing questions |
| P1 | Paper Simulation | Original-order 36-item, 60-minute practice with deferred feedback |
| P1 | Pages preparation | Correct project base, CI, manually triggered deploy workflow |
| Later | Variants and extra levels | Clearly labeled generated practice, after the core works |

Ship P0 before campaign polish. Complete P1 in the same implementation task if feasible. Report genuine environment blockers precisely; never replace functioning features with mock buttons.

## 5. Core loop

Home → choose mode → answer → submit → feedback/explanation → next → results → rematch.

Foreground **“Cram 10 Questions”** on Home. Secondary actions: Boss Campaign, Mistake Rematch, Paper Simulation, Content Library. Show saved XP and revision priorities. No forced tutorial or intro cinematic.

Practice shows topic, original number, progress, streak, XP, three Study Energy hearts, and five answer buttons. Selecting does not submit. Submit locks the attempt; feedback stays until Next. A–E or 1–5 selects the displayed choice, Enter submits only when selected. Ignore quiz shortcuts while typing or using dialogs.

After practice submission show verdict, a one-line joke if enabled, best answer, short explanation, the selected distractor's explanation when wrong, memory hook, and source/review badge. Jokes never delay or obscure teaching.

## 6. Modes

### Cram Run

Ten distinct gradable questions sampled from selected topics, all topics by default. Shuffle question/option order using an injected RNG; retain stable option IDs. Original A–E identities remain available in feedback. Exclude blocked items and explain that four source items are review-only. No timer or speed bonus.

### Mistake Rematch

A real miss enters an unresolved queue. A Rematch run starts with up to ten distinct unresolved items. Only in Rematch, allow at most one appended retry per source ID per run, after at least three other distinct gradable items have been submitted. If that spacing is impossible, defer the retry to a later run. Cram and Campaign stay fixed-length and do not append retries. A later wrong resets recovery. Two later correct unaided attempts clear the miss. Queue state survives sessions. End the run after its initial items and permitted retries; unresolved items remain for another run. Show a useful empty state.

### Boss Campaign

All chapters are immediately selectable. Each battle draws up to five distinct gradable items. Boss HP = 20 × battle question count. Correct deals 20 damage, wrong deals zero. Finish after each selected item has been attempted once. Show remaining HP if the boss survives and offer a rematch. Review cards do not inflate HP. Run completion and boss defeat are separate outcomes.

| Chapter | Boss | Original pool |
| --- | --- | --- |
| Foundations | The Commons Goblin | 1, 3, 4, 5, 6, 7, 30, 31, 32 |
| Climate and Solutions | The Carbon Goblin | 2, 18, 19, 20, 21, 39, 45, 46 |
| Systems and SDGs | The Nexus Hydra | 22–29 |
| Consumption and Rebound | The Jevons Gremlin | 33–38, 40–44 |

### Paper Simulation

Call it **“2025 Paper Simulation · 36 supplied items”** and visibly state Q8–17 are absent. Never call it a complete 46-question mock.

Preserve source question/option order. Allow navigation, bookmarking, changed selections, and unanswered items until final submission. Hide correctness, explanations, and roasts until then. Persist a 60-minute absolute deadline so refresh/backgrounding cannot restart it. Auto-submit once at expiry. Restoring an expired session opens its result.

Blocked items may collect an ungraded selection labeled “Ungraded source issue.” For the unchanged seed, results show correct / 32 gradable items, unanswered gradable items, and four ungraded review items separately. Calculate counts from data. Unanswered gradable items stay in the denominator. Exam mode awards no arcade XP, changes no hearts/streak, and creates no mastery observations. Incorrect/unanswered gradable items may enter Rematch once on finalization.

## 7. Scoring and progress

Separate arcade performance, study progress, and exam accuracy.

| Practice event | Effect |
| --- | --- |
| Correct unaided | Base 100 XP on the first rewarded correct for this source ID, times multiplier |
| Correct with hint | Base 50 XP, multiplier 1; streak unchanged; no mastery increment |
| Wrong | 0 XP; streak resets; lose one heart; add/update mistake |
| Skip | 0 XP; streak resets; no heart loss; record separately |
| Blocked item | Neutral; no scoring/progress effects |
| Duplicate submit/render | No effect |

For an unaided correct answer increment streak first, then multiplier = min(3, 1 + floor((streak - 1) / 3)). Streaks 1–3 earn ×1, 4–6 ×2, 7+ ×3. Hints show the supplied concept clue before submission; they never remove options.

Lifetime XP is awarded at most once per original source question ID per local profile. A hinted first reward consumes reward eligibility. Subsequent correct attempts can improve learning records but add zero XP. Rematch can award XP only if the item has never been rewarded. Future variants share their original parent's reward eligibility. Refresh, mode changes, and run restart cannot bypass the guard. These local scores are not secure or competitive; no global leaderboard.

Study Energy starts at 3 per practice run and floors at zero. At zero: “You are cooked. The explanation is still free.” Offer **Continue Learning** and **Review Mistakes**. Continue preserves the run at zero energy; no paywall, waiting period, or forced restart.

Primary practice accuracy uses only the first submitted attempt for each source ID in that run: correct / submitted gradable items, including hinted answers and excluding skips. Show retries separately; they never replace that first-attempt result. Also show unaided-correct and skip counts. An item is “Recalled twice” after two correct unaided attempts in different runs; any later wrong resets its count. “Practised” means each gradable item in that topic has been answered. Never present these as proof of exam readiness.

No speed scoring. XP is fictional, not actual CO2 avoided.

## 8. Roast system

**Off / Mild / Spicy**, default Mild; Spicy requires explicit selection. The control is visible before play and takes effect immediately, including current feedback. Sound off by default.

Use local authored pools tagged by topic/event; avoid the last three lines where possible. After three consecutive wrong answers give a corrective nudge and reduce roasting for the next question. Roast the answer or fictional situation, not the person's identity or worth. No identity slurs, threats, self-harm jokes, body/health mockery, sexual humiliation, or actual-failure taunts. Snark and mild profanity in Spicy are fine.

| Trigger | Tone | Example |
| --- | --- | --- |
| Wrong | Mild | That answer needs a recycling bin and a second draft. |
| Wrong | Spicy | Bro selected that with the confidence of a coal company sustainability report. |
| Wrong, future IPAT variant | Spicy | Your arithmetic just applied for a fossil-fuel subsidy. |
| Wrong, nexus | Mild | You disconnected food, water, and energy. The Hydra has filed a complaint. |
| Wrong, rebound | Spicy | You made the wrong answer more efficient and somehow produced more of it. |
| Correct | Mild | The planet unclenched. Correct. |
| Three correct | Spicy | Three correct. The distractors are filing for unemployment. |
| Recovery | Mild | Good recovery. Efficiency means less input per unit of service. |
| Zero hearts | Spicy | You are cooked. Fortunately, learning is a renewable resource. |
| Blocked source | Any | No roast. The question itself needs maintenance. |

Ship at least 12 Mild wrong lines, 12 Spicy wrong lines, and eight celebrations. No runtime AI.

## 9. Content contract

Import and validate content/questions.seed.json. Each record has:

id, sourceQuestionNumber, sourcePage, origin, chapter, topics, stem, options[{id,text,explanation}], answerOptionId, gradingStatus, answerBasis, explanation, memoryHook, hint, reviewNotes, referenceIds, diagram.

Allowed gradingStatus: provisional, blocked, verified. The seed has **no verified records**. Each graded answer matches exactly one option. Every option has its own explanation. Blocked records have null answers and at least one issue. Validate duplicates, fields, references, expected source numbers, page mapping, and answer mappings.

Q38 needs a conceptual inverted-U EKC SVG. Q41 needs a qualitative two-line SVG: refrigerator size rises then flattens while energy use rises then falls. No usable numeric series is supplied. Label both “Conceptual illustration, not measured data,” use English labels and text alternatives, and invent no observations or scientific units.

Library filters: chapter, mistakes, bookmarks, content issues. Search English terms. Show source page, study-key status, explanation, and review notes.

## 10. Screens and accessibility

- Home: Cram CTA, chapter actions, progress, roast setting.
- Play: stable layout, selection state, explicit Submit/Next, visible hint state.
- Feedback: verdict text/icon, useful teaching, expandable source details.
- Results: correct/attempted, unaided correct, skips, XP earned, misses, up to three actual revision priorities. Never invent weaknesses.
- Library: all source items, including four blocked issues.
- Settings: roast, sound, motion, progress JSON export/import, confirmed reset.

Use semantic buttons, visible focus, 44 px targets, readable 16 px body text, and an ARIA live verdict region. Correctness cannot rely only on color. Honor prefers-reduced-motion. Avoid screen shake, strobing, and mandatory animation. Move focus to feedback after submit and the question heading after Next.

## 11. Implementation

Use React, TypeScript, Vite, plain CSS, a session reducer, and small pure scoring/selection/progress functions. Reuse an existing compatible repo stack. Keep dependencies modest. Use Vitest for critical rules and an available browser test tool, or Playwright if installable.

Suggested structure:

~~~text
content/questions.seed.json
src/components/
src/screens/
src/game/{reducer,scoring,selection,progress}.ts
src/content/{types,validate}.ts
src/storage/progress.ts
src/styles.css
tests/
docs/{PRD,CODEX_PROMPTS,CONTENT_REVIEW}.md
.github/workflows/{ci,pages}.yml
README.md
~~~

Use versioned localStorage with bank version, stable IDs, reward eligibility, settings, attempts, bookmarks, unresolved misses, and active session. Persist option order, submission IDs, and feedback so reload cannot award twice or reshuffle a live question. Catch corrupt JSON, unavailable storage, schema mismatches, and quota failures. Fall back to in-memory play with a small message. Validate imports; never render imported text as HTML. Confirm reset and clear all profile keys together.

No service worker is required. A loaded session needs no API; fresh offline launch is not guaranteed. Do not claim PWA support unless implemented and verified.

For GitHub Pages use project base /wi1103-planet-roast/ and hash/in-app navigation. Assets must respect base; a repo rename requires a base update. Follow current official Vite deployment instructions, with a lockfile and compatible Node version. Checks run on pushes/PRs. Keep production deployment **workflow_dispatch only** until the owner chooses to publish. Public hosting exposes the bundled questions. Keep the raw PDF out of deployed assets. Never call a Pages URL live without observing deployment success.

## 12. Acceptance criteria

1. Exactly 36 source records load; Q8–17 are absent and Q5/Q6/Q7/Q33 visibly ungraded.
2. A complete Cram run uses real content and explanations, with no dead buttons.
3. Shuffling preserves option mappings. Double clicks/reloads cannot duplicate rewards.
4. Streak boundaries 3/4/6/7, hint rules, zero hearts, and reward eligibility match this spec.
5. Blocked cards change no scoring, accuracy, streak, boss HP, or mastery.
6. Real misses are spaced and clear after two later correct unaided attempts.
7. Exam ordering, deadline restoration, one-time finalization, unanswered denominator, and issue counts work.
8. Corrupt/imported/unavailable storage cannot crash play or inject HTML.
9. Roast Off suppresses jokes immediately; Spicy is opt-in; mute/reduced motion work.
10. Main flows work at 360 px and desktop width, keyboard alone, without console errors.
11. npm ci, content validation, typecheck, relevant tests, and production build pass; report unavailable checks honestly.
12. Production output loads/navigates under the project base and README deployment steps match actual behavior.

Write focused tests for these behavioral risks, not cosmetic constants. Finish the implementation report with actual commands/outcomes and material source limitations.

## 13. Out of scope

Multiplayer, accounts, global leaderboards, payments, runtime LLM tutoring, a platformer engine, city-building systems, social notifications, and generated “official” keys.

## 14. Evidence

The supplied PDF grounds all adaptations. CONTENT_REVIEW.md records the per-question study key. content/references.json contains primary-source concept checks and official deployment documentation. These checks support concepts, not a lecturer's grading decisions.
