# Contributing to gstack-game

[繁體中文](CONTRIBUTING.zh-TW.md)

gstack-game needs **domain experts** more than it needs programmers.

The engineering backbone is solid. What's missing is **game industry experience** — the benchmark numbers, common pitfalls, and review criteria that only come from shipping real games.

If you've shipped a game, designed an economy system, led a QA team, or directed art production — your knowledge is exactly what this project needs.

---

## Three Ways to Contribute

### ⚡ 5 Minutes: Open an Issue (no clone needed)

**For:** You spotted a wrong number, know a mistake Claude makes, or have a question that should be asked during review.

Open a GitHub Issue using one of these templates:

- **[Report Wrong Benchmark](../../issues/new?template=benchmark.yml)** — a number is outdated or incorrect
- **[Add Gotcha](../../issues/new?template=gotcha.yml)** — Claude makes a specific mistake on this task
- **[Add Forcing Question](../../issues/new?template=forcing-question.yml)** — a critical question the review should ask but doesn't
- **[Calibrate Scoring](../../issues/new?template=scoring.yml)** — a scoring weight or threshold needs adjustment

Filled issues get converted directly into PRs. No git, no clone, no build required.

**Examples:** See [Contribution Examples](#contribution-examples) below.

---

### 🔧 30 Minutes: Edit references/ Files (clone repo)

**For:** You want to fix several things at once, add a full section, or deeply revise existing content.

Each skill's domain knowledge lives in `skills/<name>/references/` — **all pure markdown**, no skill architecture knowledge needed.

```bash
git clone https://github.com/fagemx/gstack-game.git
cd gstack-game
```

#### Your Expertise → Which Files to Edit

| Your background | Files to edit |
|-----------------|--------------|
| **Economy / Systems Designer** | `skills/balance-review/references/` — gotchas.md, scoring.md, economy-model.md, progression.md |
| **Game Designer** | `skills/game-review/references/` — core-loop.md, progression.md, motivation.md, gotchas.md |
| **UX Researcher** | `skills/player-experience/references/` — personas.md, emotion-vocabulary.md, walkthrough-phases.md |
| **Marketing / Publishing** | `skills/pitch-review/references/` — market-positioning.md, business-case.md, gotchas.md |
| **Game Programmer** | `skills/gameplay-implementation-review/SKILL.md.tmpl`, `skills/game-eng-review/SKILL.md.tmpl` |
| **QA Lead** | `skills/game-qa/SKILL.md.tmpl` |

#### After Editing

```bash
bun run build    # Regenerate SKILL.md (not needed if you only changed references/)
bun test         # Verify nothing broke
```

Submit a PR:
- Title: `improve(balance-review): update F2P economy benchmarks`
- Body: explain **why** — cite your experience or data sources
- Tag your expertise: `[Economy Designer, 6 years, shipped 2 F2P mobile titles]`

---

### 🏗️ Advanced: Write Skill Templates (requires architecture understanding)

**For:** Adding new skills or major skill restructuring.

Read these first:
- `CLAUDE.md` — developer handbook
- `docs/DEVELOPMENT.md` — full project overview, skill map, migration guide
- `.claude/skills/skill-review/references/rubric.md` — 15-dimension quality rubric
- `.claude/skills/skill-review/references/refactor-patterns.md` — refactoring method

Key rules:
- Edit `.tmpl` files, never `.md` directly
- Skills over 300 lines need `references/` split
- All references read upfront before interaction (方案 1, zero interruption)
- Run `bun run build` + `bun test` after changes

---

## Contribution Examples

### Example 1: Add a Gotcha (5 minutes)

**Scenario:** You're an economy designer and noticed `/balance-review` flags inflation as a bug in idle games.

**Open an Issue:**

> **Skill:** /balance-review
> **File:** references/gotchas.md
> **Type:** New Gotcha
>
> **What Claude does wrong:**
> Claude flags inflation rate > 1.2 as a red flag when analyzing idle game economies.
>
> **What's correct:**
> In idle games, inflation IS the design. Currency values growing 10-50% per hour is normal — the player expects "numbers go up." The correct check is whether inflation rate matches prestige reset frequency, not the absolute rate.
>
> **Evidence:** Shipped 2 idle games (5M+ combined downloads), tuned live economy for 6 months.

**Result:** Maintainer adds this to `skills/balance-review/references/gotchas.md`.

---

### Example 2: Fix a Benchmark (5 minutes)

**Scenario:** You work in publishing and the CPI numbers in `/pitch-review` are from 2024.

**Open an Issue:**

> **Skill:** /pitch-review
> **File:** references/scoring.md
> **Type:** Fix Benchmark
>
> **Current value:** LTV/CPI > 1.5 = viable
> **Should be:** 2026 iOS casual game CPI is now $3-5 (post-ATT). LTV/CPI > 2.0 = viable, 1.5-2.0 = risky.
>
> **Source:** Sensor Tower 2026 Q1 report + our UA data from 4 titles

---

### Example 3: Add a Forcing Question (5 minutes)

**Scenario:** You're a game director who thinks `/game-review` misses a key question.

**Open an Issue:**

> **Skill:** /game-review
> **File:** references/core-loop.md
> **Type:** New Forcing Question
>
> **Question:** "Turn off all sound effects and just look at the screen. Is the core loop still fun? Now turn off the screen and just listen. Still fun? If neither works, your game feel is packaging, not design."
>
> **Why it matters:** I've greenlit 20+ projects. The most common false positive is "demo looks cool but plays hollow." Stripping sensory packaging exposes whether the core loop has real juice.
>
> **Suggested placement:** Section 1 Forcing Questions, as Q5

---

### Example 4: Edit a references/ File (30 minutes)

**Scenario:** You're a UX researcher who knows the Casual Newcomer persona is wrong.

**Edit:** `skills/player-experience/references/personas.md`

```diff
 ### Persona 1: Casual Newcomer (FTUE Focus)
 - **Context:** First mobile game session on commute.
-  3 minutes of attention before deciding if it's worth keeping.
+  90 seconds of attention before deciding if it's worth keeping.
+  (Source: our playtest data shows 50% of casual players decide in 90 seconds,
+  not 3 minutes. 3 minutes is "already interested" players.)
 - **Frustration tolerance:** 1-2 failures before quitting.
+  (Note: if the first failure has no feedback — why it happened, how to
+  improve — tolerance drops to 0. They leave without a second attempt.)
```

Submit PR with playtest data source.

---

## What Needs Expert Help Right Now

### 🔴 Critical (affects scoring accuracy)

| Skill | What's needed | Who can help |
|-------|--------------|-------------|
| `/balance-review` | Idle/incremental game economy model adaptation | Economy designer who shipped idle games |
| `/game-review` | GDD weight calibration across game types | Designer who has reviewed 10+ GDDs |
| `/gameplay-implementation-review` | Unity / Godot / Unreal hot-path pitfalls | Game programmer with profiling experience |
| `/pitch-review` | 2026 LTV/CPI/UA benchmarks | Publisher with Sensor Tower or data.ai access |

### 🟡 Important (content exists but needs depth)

| Skill | What's needed | Who can help |
|-------|--------------|-------------|
| `/player-experience` | Playtest-validated persona behavioral parameters | UX researcher with observation data |
| `/game-ideation` | More forcing questions (blind spots in current 6?) | Game director who has greenlit/killed projects |
| `/game-direction` | IP strategy, localization, age rating cognitive patterns | Producer with 3+ shipped titles |

### ⚪ Recently upgraded (expert calibration welcome)

These skills were upgraded in v0.4.0 with initial reference files. The structure and benchmarks are in place but need validation from domain experts:

| Skill | Current | What needs calibration |
|-------|---------|----------------------|
| `/asset-review` | 329L + 5 refs, 70% | Per-asset texture/mesh budgets — are the numbers realistic for your engine/platform? |
| `/game-visual-qa` | 231L + 5 refs, 60% | Animation blend times, frame count guidelines — match your production standards? |
| `/playtest` | 251L + 3 refs, 65% | Observation thresholds marked LOW confidence — need playtest data to validate |
| `/game-codex` | 331L + 4 refs, 70% | Exploit taxonomy — missing categories for your game type? |
| `/game-eng-review` | 462L + 5 refs, 70% | Performance budgets — do the platform numbers match your profiling data? |

---

## For Maintainers: Internal Skill Pipeline

gstack-game has 6 internal maintenance skills in `.claude/skills/` that automate the issue-to-merge workflow. These are for repo maintainers, not game developers.

### The pipeline

```
/issue-create → /issue-plan → /issue-action → PR → /pr-review-loop → merge
```

### How to use each skill

**`/issue-create`** — Create an issue from conversation context.
```
/issue-create skill-gap    — a skill has wrong content or missing knowledge
/issue-create new-skill    — propose a new skill
/issue-create bug          — template bug or build issue
/issue-create              — general (auto-detect type)
```

**`/issue-plan <number>`** — Three-phase deep-dive on an issue.
- **Research:** Reads affected skill templates + references, documents facts only
- **Innovate:** Generates 2-3 approaches at different scales, evaluates trade-offs
- **Plan:** Concrete implementation plan (files to change, verification checklist)
- All three phases posted as comments to the issue, labeled `planned`
- Idempotent: re-run picks up where it left off if conversation breaks

**`/issue-action <number>`** — Implement from approved plan.
- Reads deep-dive artifacts from `.tmp/deep-dive/issue-{id}/`
- Creates feature branch, implements step-by-step following the plan
- Runs `bun run build` + `bun test` after each change
- Creates PR with structured body

**`/pr-review-loop <number>`** — Automated PR review-fix cycle.
- Bash state machine drives REVIEW → COMMENT → FIX → re-REVIEW loop
- Reviews against gstack-game standards (frontmatter, preamble, anti-sycophancy, STOP gates, 300L rule, build/test)
- Classifies issues as P0 (blocks merge) / P1 (should fix) / P2 (nice to have)
- Auto-fixes P0/P1, re-reviews until LGTM or max 3 iterations
- Posts findings as PR comments each round

**`/skill-review <skill-name>`** — Assess skill quality with 15-dimension rubric.

**`/contribute-review <issue-number>`** — Convert a domain expert's Issue into a formatted PR.

### Example: end-to-end workflow

```bash
# 1. You notice /balance-review gives bad advice on idle games
/issue-create skill-gap
# → Creates issue #20 with details

# 2. Plan the fix
/issue-plan 20
# → Posts research, innovate, plan to issue. Adds "planned" label.

# 3. Implement
/issue-action 20
# → Creates feature branch, implements plan, opens PR #21

# 4. Review
/pr-review-loop 21
# → Reviews PR, fixes issues, posts LGTM when clean

# 5. Merge
gh pr merge 21 --squash --delete-branch
```

---

## Questions?

Open an issue. Tag it with the skill name and your area of expertise.

Not sure where your contribution fits? Open an issue saying "I want to contribute XX experience, not sure which skill" — we'll help you find the right place.
