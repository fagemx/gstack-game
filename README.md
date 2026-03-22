# gstack-game

**Complete game development workflow skills for Claude Code**

[繁體中文](README.zh-TW.md)

21 interactive AI review skills covering the entire game development pipeline — from concept brainstorming to shipping. Built on [gstack](https://github.com/garrytan/gstack)'s engineering architecture and review methodology, fully rewritten for game development.

gstack is Garry Tan's AI engineering workflow for Web/SaaS. gstack-game ports that same methodology to game dev: game design theory (MDA, SDT, Flow State) replaces SaaS metrics (MRR, churn). Core loop, retention hooks, and Sink/Faucet economy models replace API endpoints and database schemas. The engineering backbone (template engine, preamble injection, anti-sycophancy) maintains gstack-level quality.

**Who this is for:**
- **Solo indie developers** — structured design review and QA even as a one-person team
- **Small teams (2-5)** — AI skills fill missing specialist roles (economy designer, UX researcher, QA lead)
- **Game design students** — structured design thinking framework with game design theory built into every skill

---

## Quick start: your first 10 minutes

1. Install gstack-game (30 seconds — see below)
2. Run `/game-ideation` — describe your game idea. It structures it into Fantasy/Loop/Twist, then challenges your assumptions with 6 forcing questions.
3. Run `/game-review` — design review any GDD
4. Run `/player-experience` — simulate a player walkthrough
5. Run `/game-code-review` — game-aware code review on any branch with changes
6. Stop there. You'll know if this is for you.

---

## Install — 30 seconds

**Requirements:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Git](https://git-scm.com/), [Bun](https://bun.sh/) v1.0+

### Option A: Paste to Claude (recommended)

Open Claude Code and paste this. Claude does the rest.

> Install gstack-game: run **`git clone <repo-url> ~/.claude/skills/gstack-game && cd ~/.claude/skills/gstack-game && bun run build`** then add a "gstack-game" section to CLAUDE.md that lists the available skills: /game-ideation, /game-direction, /game-review, /game-eng-review, /balance-review, /player-experience, /game-ux-review, /pitch-review, /game-code-review, /game-qa, /game-ship, /game-debug, /game-retro, /game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest, /careful, /guard, /unfreeze. Then ask the user if they also want to add gstack-game to the current project.

### Option B: Add to your repo so teammates get it

> Add gstack-game to this project: run **`cp -Rf ~/.claude/skills/gstack-game .claude/skills/gstack-game && rm -rf .claude/skills/gstack-game/.git && cd .claude/skills/gstack-game && bun run build`** then add a "gstack-game" section to this project's CLAUDE.md listing all available skills.

Real files get committed to your repo (not a submodule), so `git clone` just works. Everything lives inside `.claude/`. Nothing touches your PATH or runs in the background.

### Option C: Manual install

```bash
# Install a single skill:
cp -r /path/to/gstack-game/skills/game-review your-project/.claude/skills/

# Or install everything:
/path/to/gstack-game/bin/install.sh .
```

---

## See it work

```
You:    I want to make an idle mobile game where the player runs a dungeon
You:    /game-ideation

Claude: First — what stage are you at? Do you have a prototype, or just the concept?
        → Level 1: one-line pitch. Let's go deeper.

        Fantasy: What should the player FEEL? "Run a dungeon" is a mechanic,
        not a feeling. Is it "the satisfaction of watching your empire grow
        from nothing"? Or "the evil joy of watching adventurers fall into
        your traps"?
        → You pick: evil joy + strategic satisfaction

        Core Loop: Describe it in one sentence:
        "Place traps → watch adventurers trigger them → collect loot → upgrade → repeat"
        Is the 30-second micro-loop fun on its own? Or only fun because of upgrades?
        → Forcing Q: If you remove all upgrades, is "place → trigger" still fun?

        Twist: Name the 3 most similar games. How are you different?
        Is the difference in mechanics (hard to copy) or art (easy to copy)?
        → Outputs Concept One-Pager

You:    /game-review
Claude: [Reads Concept One-Pager]
        Mode A (Mobile/Casual) — weights adjusted

        Core Loop: 7/10 — micro-loop clear but meso-loop undefined
        Progression: 5/10 — D7 retention hook not defined (-3)
        Economy: 4/10 — faucets only, no sinks (inflation risk)

        GDD Health Score: 5.8/10
        STATUS: DONE_WITH_CONCERNS
        [Walks through each issue one at a time via AskUserQuestion]

You:    /player-experience
Claude: Persona: Casual Newcomer (3-min commute session)

        0:00  Open app          Curious
        0:05  Loading done      Tutorial text   ⚠️ Wall of text, 3+ lines = skipped
        0:12  First trap placed Engaged         ✅ Aha moment
        0:30  First adventurers Excited         ✅ Seeing results
        1:30  Waiting for wave  Bored           🔴 60s dead time, churn risk

        EMOTION ARC: Curious → Excited → Bored
        Issue: 1:30 dead time will kill D1 retention

You:    /game-code-review
Claude: Diff: 847 LOC, 12 files
        [Pass 1 — Critical]
        🔴 DungeonManager.Update() — new List<>() every frame, GC pressure
        🔴 TrapData serialization has no version field — save upgrades will break
        ⚠️ Damage calc on client side — cheat vector in multiplayer
        [Pass 2 — Informational]
        Hardcoded magic number: trap_damage = 15

        AUTO-FIXED: 2 issues
        ASK: 3 issues (one at a time)
```

Six commands. Concept to code review. Each step's output feeds the next.

---

## The sprint

gstack-game is a process, not a collection of tools. Skills are ordered the way a game dev sprint runs:

**Think → Plan → Review → Build → Test → Ship → Reflect**

Each skill feeds the next. `/game-ideation` writes a concept doc that `/game-review` reads. `/game-code-review` catches bugs that `/game-ship` verifies are fixed.

| Skill | Your specialist | What they do |
|-------|----------------|--------------|
| `/game-ideation` | **Game Design Mentor** | Structure concepts with Fantasy/Loop/Twist, challenge assumptions with 6 forcing questions, plan next validation step with Iceberg framework |
| `/game-direction` | **Producer / Creative Director** | Challenge "why build this game?", 10 cognitive patterns for strategic review, scope decisions (ADD/KEEP/DEFER/CUT) |
| `/game-review` | **Senior Game Designer** | GDD review: Core Loop, Progression, Economy, Motivation, Risk. Quantified GDD Health Score |
| `/game-eng-review` | **Technical Director** | Engine choice, rendering pipeline, networking architecture, asset pipeline, platform adaptation |
| `/balance-review` | **Economy Designer** | Difficulty curves (Flow State), Sink/Faucet economy, Gini coefficient, pity systems, reward psychology |
| `/player-experience` | **UX Researcher** | First-person player walkthrough, 6 personas, emotion model, repeat play simulation |
| `/game-ux-review` | **UI/UX Designer** | HUD readability, menu flow, shop UI, tutorial, controller/touch adaptation, accessibility |
| `/pitch-review` | **Investor / Publisher Lens** | Market positioning, differentiation, feasibility, business case, Iceberg validation level |
| `/game-code-review` | **Senior Game Programmer** | Two-pass review: frame budget, memory, state sync, serialization, adversarial pass for large diffs |
| `/game-qa` | **QA Lead** | 8-dimension testing: functional, visual, performance, audio, input, compatibility, localization, progression. Quantified Health Score |
| `/game-ship` | **Release Engineer** | Build → Test → Changelog → PR → platform submission (Steam/App Store/Google Play/Web) |
| `/game-debug` | **Debug Specialist** | 3-strike hypothesis testing + root cause analysis. No guessing. |
| `/game-retro` | **Scrum Master** | Delivery rate, bug density trends, velocity, milestone health. Max 3 action items. |
| `/game-codex` | **Chaos Engineer** | Independent-context adversarial review. Finds exploits, desync, save corruption. |
| `/game-docs` | **Technical Writer** | Player-friendly patch notes + internal changelog + doc sweep |
| `/game-visual-qa` | **Art QA** | Style consistency, UI alignment, animation quality, screen adaptation |
| `/asset-review` | **Technical Artist** | Naming conventions, format specs, performance budget, style consistency |
| `/playtest` | **UX Researcher** | Test plans, observation metrics, interview questions, data analysis framework |

### Safety tools

| Skill | What it does |
|-------|-------------|
| `/careful` | Warns before destructive commands (rm -rf, force push, DROP TABLE) |
| `/guard` | `/careful` + restricts file edits to a specific directory |
| `/unfreeze` | Removes `/guard` scope restriction |

---

## Relationship to gstack

| | gstack | gstack-game |
|---|--------|-------------|
| **Domain** | Web / SaaS products | Game development |
| **Vocabulary** | user, feature, API, MRR, churn | player, mechanic, core loop, retention, ARPDAU |
| **Dependency** | Standalone | Standalone (no gstack required) |

**Borrowed from gstack:**
- Template Engine (SKILL.md.tmpl → gen-skill-docs.ts → SKILL.md)
- Preamble Injection (shared session tracking, telemetry, AskUserQuestion format across all skills)
- 6 review methodology principles (classify-before-judge, explicit scoring, AUTO/ASK/ESCALATE, structured questions, multi-dim cross-check, anti-sycophancy)
- Completion Protocol (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)

**Fully rewritten:**
- All review dimensions, scoring criteria, and forcing questions → game domain
- 6 game-specific skills that gstack doesn't have
- Game theory integration (MDA Framework, SDT, Flow State, Nested Loop Model, Sink/Faucet economy)

---

## Quality assessment

Each skill's percentage indicates **domain judgment completeness**, not code quality.

| Score | Meaning |
|-------|---------|
| 70-80% | Full structure + domain theory + quantitative scoring. **Ready to use, expert fine-tuning only** |
| 55-65% | Full structure + game vocabulary + AUTO/ASK/ESCALATE. **Usable but lacks domain depth** |
| 35-40% | Structural skeleton + basic flow. **Needs domain expert input** |

The engineering backbone matches gstack quality. What's missing is **game industry domain judgment** — scoring weights, benchmark numbers, engine-specific review points. These need calibration from experienced game professionals. See `docs/domain-judgment-gaps.md` for the full checklist.

### Theory sources

| Source | What we took |
|--------|-------------|
| **[gstack](https://github.com/garrytan/gstack)** | Engineering architecture + 6 review methodology principles |
| **Claude-Code-Game-Studios** | MDA/SDT/Flow theory, Nested Loop, Pillar methodology, economy frameworks |
| **guardian** (PlayerSimulatorAgent) | Player simulation prompts, Iceberg validation framework, Fantasy/Loop/Twist |

---

## Development

```bash
bun run build                        # Generate all SKILL.md from templates
bun run gen:skill-docs:check         # Check for drift (CI use)
bun test                             # Run 11 validation tests
```

### Adding a new skill

1. Create `skills/my-skill/SKILL.md.tmpl`
2. Use `{{PREAMBLE}}` for shared behavior injection
3. Use `{{SKILL_NAME}}` for auto-filled skill name
4. Run `bun run build`

### File structure

```
gstack-game/
├── CLAUDE.md                           ← Full technical docs
├── README.md                           ← This file
├── README.zh-TW.md                     ← 繁體中文版
├── ETHOS.md                            ← Game dev philosophy (Boil the Lake, game edition)
├── CHANGELOG.md                        ← Version history
├── VERSION                             ← 0.2.0
├── package.json                        ← Build scripts
├── bin/                                ← 7 utilities (config, diff-scope, telemetry...)
├── scripts/gen-skill-docs.ts           ← Template engine
├── skills/                             ← 21 skills + shared preamble
├── test/                               ← Tier 1 validation tests
└── docs/                               ← Domain judgment docs
```

---

## Privacy & Telemetry

gstack-game includes **opt-in** usage telemetry, disabled by default.

- **Default is off.** Nothing is sent anywhere unless you explicitly opt in.
- **What's recorded (if enabled):** skill name, duration, success/fail. That's it.
- **Never recorded:** code, file paths, repo names, prompt content.
- **Change anytime:** `gstack-config set telemetry off`
- **Local only:** All data stored in `~/.gstack/analytics/skill-usage.jsonl`, never leaves your machine.

---

## Troubleshooting

**Skill not showing up?** Make sure SKILL.md files are generated: `cd .claude/skills/gstack-game && bun run build`

**Template drift?** `bun run gen:skill-docs:check` — if it reports DRIFT, run `bun run build` to regenerate.

**Windows users:** Run under Git Bash or WSL. The shell scripts in bin/ require bash.

**Claude doesn't see the skills?** Add this to your project's CLAUDE.md:

```
## gstack-game
Available skills: /game-ideation, /game-direction, /game-review, /game-eng-review,
/balance-review, /player-experience, /game-ux-review, /pitch-review,
/game-code-review, /game-qa, /game-ship, /game-debug, /game-retro,
/game-codex, /game-docs, /game-visual-qa, /asset-review, /playtest,
/careful, /guard, /unfreeze.
```

---

## Docs

| Doc | What it covers |
|-----|---------------|
| [Builder Ethos](ETHOS.md) | Game dev philosophy: Boil the Lake, Search Before Building, Player Time is Sacred |
| [Domain Judgment Gaps](docs/domain-judgment-gaps.md) | Expert review checklist — what needs calibration |
| [Source Quality Assessment](docs/source-quality-assessment.md) | Quality comparison of 3 reference sources |
| [Changelog](CHANGELOG.md) | Version history |
| [CLAUDE.md](CLAUDE.md) | Full technical docs and skill map |

---

## License

MIT
