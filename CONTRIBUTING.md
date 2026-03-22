# Contributing to gstack-game

[繁體中文](CONTRIBUTING.zh-TW.md)

gstack-game needs **domain experts** more than it needs programmers.

The engineering backbone (template engine, preamble injection, scoring framework) is solid. What's missing is **game industry experience** — the scoring weights, benchmark numbers, forcing questions, and review criteria that only come from shipping real games.

If you've shipped a game, designed an economy system, led a QA team, or directed art production — your knowledge is exactly what this project needs.

---

## How to contribute

### 1. Pick a skill that matches your expertise

| Your background | Skills you can improve | What's needed |
|-----------------|----------------------|---------------|
| **Game Designer** (5+ years) | `/game-review`, `/game-ideation`, `/player-experience` | Scoring weights, forcing questions, review criteria |
| **Game Producer / Creative Director** | `/game-direction`, `/game-retro` | Cognitive patterns, scope decision frameworks, milestone criteria |
| **Economy / Systems Designer** | `/balance-review` | Difficulty curve benchmarks, Sink/Faucet ratios, pity system thresholds |
| **Game Programmer** (Unity/Godot/Unreal) | `/game-code-review`, `/game-eng-review`, `/game-debug` | Engine-specific review points, frame budget patterns, common pitfalls |
| **UX Researcher / UI Designer** | `/game-ux-review`, `/player-experience`, `/playtest` | Persona parameters, usability benchmarks, test protocols |
| **QA Lead** | `/game-qa`, `/game-visual-qa` | Bug severity definitions, category weights, platform-specific checklists |
| **Technical Artist** | `/asset-review`, `/game-visual-qa` | Performance budgets, naming conventions, style consistency criteria |
| **Producer / PM** | `/game-ship`, `/game-docs` | Platform submission checklists, patch notes best practices |
| **Marketing / Publishing** | `/pitch-review` | LTV/CPI benchmarks, market size data, UA strategy frameworks |

### 2. Read the current skill

Each skill lives in `skills/<name>/SKILL.md.tmpl`. Read the current version to understand the structure.

Every skill follows the same pattern:
- YAML frontmatter → `{{PREAMBLE}}` → Sections → AUTO/ASK/ESCALATE → Anti-Sycophancy → Scoring → Completion Summary → Review Log

### 3. Improve the domain content

Edit the `.tmpl` file (never edit `SKILL.md` directly — it's generated).

**What "improve" means:**

| Type of improvement | Example |
|--------------------|---------|
| **Calibrate scoring weights** | "Core Loop should be 30% not 25% — in mobile F2P, the loop IS the game" |
| **Add forcing questions** | "You're missing: 'What happens when two players exploit this simultaneously?'" |
| **Fix wrong benchmarks** | "D1 retention 40% is good for premium, but for F2P hyper-casual it should be 50%+" |
| **Add game-type variations** | "This section assumes F2P mobile. Add a Mode for premium PC games." |
| **Add engine-specific checks** | "Unity: check for `FindObjectOfType` in Update — it's an O(n) scan every frame" |
| **Improve anti-sycophancy** | "Add to forbidden list: 'The controls feel tight' — meaningless without specifying input latency" |
| **Add missing categories** | "QA is missing Network Testing for multiplayer games" |

### 4. Build and test

```bash
bun run build    # Regenerate SKILL.md from your .tmpl changes
bun test         # Verify nothing broke (11 validation tests)
```

### 5. Submit a PR

- Title: `improve(skill-name): what you changed`
- Body: Explain **why** — cite your experience, reference shipped games, link industry data
- Tag your expertise: `[Game Designer, 8 years, shipped 3 F2P mobile titles]`

---

## What needs expert help right now

### Critical (these skills work but scoring may be wrong)

**`/game-review` — GDD Health Score weights**
```
Current:  Core Loop 25% | Progression 20% | Economy 20% | Motivation 15% | Risk 10% | Cross-check 10%
Question: Should weights change by game type? Mobile F2P vs premium PC vs competitive PvP?
Need:     Game designer who has reviewed 10+ GDDs professionally
```

**`/balance-review` — Economy health thresholds**
```
Current:  Faucet/Sink ratio 0.9-1.1 = healthy, Gini < 0.3 for co-op, < 0.5 for competitive
Question: Are these numbers right? What about idle games where inflation IS the design?
Need:     Economy designer who has tuned a live game economy
```

**`/game-code-review` — Frame budget thresholds**
```
Current:  60 FPS = 16.6ms budget, generic allocation warnings
Question: What are the real hot-path patterns per engine? Unity GC traps? Godot GDScript bottlenecks?
Need:     Senior game programmer with profiling experience
```

### Important (structure is good, content needs depth)

**`/player-experience` — Persona behavioral parameters**
```
Current:  6 personas with estimated frustration tolerance, reading willingness, etc.
Question: Are these numbers calibrated? "Casual newcomer quits after 2 failures" — is that real?
Need:     UX researcher with playtest observation data
```

**`/game-ideation` — Forcing questions**
```
Current:  6 questions (Fun Reality, Comp Honesty, Session Test, Repeatability, Scope Honesty, Player Observation)
Question: Are there fatal blind spots these don't catch? What do experienced game directors ask first?
Need:     Game director or creative lead who has greenlit/killed projects
```

**`/game-direction` — Producer cognitive patterns**
```
Current:  10 patterns (Player-First, Scope Instinct, Platform Awareness, etc.)
Question: Are these the right 10? Missing: IP strategy? Localization? Age rating? Live ops economics?
Need:     Game producer with 3+ shipped titles
```

**`/pitch-review` — Market benchmarks**
```
Current:  LTV/CPI > 1.5 = viable, generic revenue tiers
Question: These numbers are stale within months. What's the framework for finding current data?
Need:     Publishing/marketing professional or indie with Sensor Tower / AppMagic access
```

### Skeleton skills (need significant content)

| Skill | Quality | What's missing |
|-------|---------|---------------|
| `/asset-review` (35%) | Naming + budget structure only | Art style consistency criteria, per-engine import settings, texture/mesh quality benchmarks |
| `/game-visual-qa` (35%) | Basic checklist | Visual quality thresholds, animation timing standards, what "polish" means quantitatively |
| `/playtest` (40%) | Protocol structure | Validated observation metrics, interview question bank, statistical significance guidance |
| `/game-debug` (40%) | 3-strike structure | Game-specific bug pattern library (physics tunneling, desync, save corruption recipes) |
| `/game-retro` (40%) | Metrics structure | Healthy velocity ranges, bug density benchmarks, milestone confidence calibration |
| `/game-codex` (40%) | Adversarial framing | Game-specific exploit taxonomy, cheat vector catalog, economy abuse patterns |
| `/game-docs` (40%) | Patch notes format | Player communication best practices, balance change explanation templates |

---

## Cross-cutting improvements (apply to multiple skills)

### Game type adaptation

Most skills assume one-size-fits-all. Reality is different:

| Game type | What changes |
|-----------|-------------|
| **F2P Mobile** | Economy + monetization pressure sections are critical, session = 3 min |
| **Premium PC/Console** | Economy section optional, core loop depth + narrative matter more |
| **Competitive PvP** | Balance section is everything, matchmaking + anti-cheat needed |
| **Narrative** | Pacing + branching + emotional arc, progression = story progress |
| **Tabletop/Board** | Physical component budget, rules clarity, session length, no code review |
| **VR** | Comfort rating, motion sickness prevention, interaction paradigm |

**If you know one type deeply, help us add proper mode selection for it.**

### Anti-sycophancy expansion

Every skill has a "forbidden phrases" list. We need more domain-specific examples:

```
Current forbidden:
  ❌ "Players will love this"
  ❌ "The game feel is great"

Need more like:
  ❌ "The art style is cohesive" (without naming which elements match and which don't)
  ❌ "Good use of juice" (without specifying which feedback channel: visual? audio? haptic?)
  ❌ "Solid progression" (without citing time-to-milestone data)
```

**If you notice AI reviewers giving empty praise in your domain, add it to the forbidden list.**

### Shared vocabulary

The preamble has a game design vocabulary list. Is it complete?

```
Current: core loop, FTUE, aha moment, churn point, sink, faucet, retention hook,
         skill gate, content gate, time gate, Bartle types, flow state, whale/dolphin/minnow

Missing? Send suggestions for terms every game designer uses but we forgot.
```

---

## Development setup

```bash
git clone https://github.com/fagemx/gstack-game.git
cd gstack-game
bun run build    # Generate all SKILL.md
bun test         # Run validation (11 tests, <2s)
```

Edit `.tmpl` files, never `.md` files. Run `bun run build` after changes.

## Code style

- Commit messages: `improve(skill-name): what and why`
- One logical change per commit
- Include both `.tmpl` and generated `.md` in the same commit

## Questions?

Open an issue. Tag it with the skill name and your area of expertise.
