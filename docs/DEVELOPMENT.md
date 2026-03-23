# gstack-game Development Guide

## What is this?

A **complete game production workflow** for Claude Code — 27 skills from concept to shipped build. Standalone, no gstack dependency.

## Skill Map (v0.3.0)

### Three Layers

```
LAYER A — Design (think + plan + review)
  /game-import → /game-ideation → /game-direction → /game-review → /game-eng-review
  /balance-review    /player-experience    /game-ux-review    /pitch-review

LAYER B — Bridge + Production (slice → build → verify)
  /prototype-slice-plan → /implementation-handoff → build →
  /gameplay-implementation-review → /feel-pass

LAYER C — Validation + Release (test → ship → reflect)
  /build-playability-review → /game-qa → /game-ship → /game-docs → /game-retro
  /playtest    /game-visual-qa    /asset-review    /game-debug    /game-codex

META — Self-maintenance
  /skill-review    /contribute-review

SAFETY
  /careful    /guard    /unfreeze
```

### Full Workflow

```
design → slice-plan → handoff → build → feel-pass → impl-review → playability → QA → ship
```

### All 27 Skills

| Skill | Layer | Type | references/ |
|-------|-------|------|-------------|
| `/game-import` | A | Scaffolding | — |
| `/game-ideation` | A | Design | gotchas |
| `/game-direction` | A | Review | gotchas |
| `/game-review` | A | Review | 8 files |
| `/game-eng-review` | A | Review | gotchas + scoring |
| `/balance-review` | A | Review | 8 files |
| `/player-experience` | A | Walkthrough | 5 files |
| `/game-ux-review` | A | Review | gotchas + scoring |
| `/pitch-review` | A | Review | 7 files |
| `/prototype-slice-plan` | B | Bridge | 4 files |
| `/implementation-handoff` | B | Bridge | 3 files |
| `/gameplay-implementation-review` | B | Review | 4 files |
| `/feel-pass` | B | Diagnosis | 4 files |
| `/build-playability-review` | C | Review | 2 files |
| `/game-qa` | C | QA + Fix Loop | gotchas + scoring |
| `/game-ship` | C | Release | gotchas |
| `/game-debug` | C | Investigation | — |
| `/game-retro` | C | Retrospective | — |
| `/game-codex` | C | Adversarial | — |
| `/game-docs` | C | Documentation | — |
| `/game-visual-qa` | C | QA | — |
| `/asset-review` | C | Review | — |
| `/playtest` | C | Protocol | — |
| `/skill-review` | Meta | Self-review | 3 files |
| `/contribute-review` | Meta | Integration | 3 files |
| `/careful` | Safety | Guard | — |
| `/guard` | Safety | Guard | — |
| `/unfreeze` | Safety | Unlock | — |

### Core Mechanisms

All scoring skills share three mechanisms:

1. **Artifact Storage** — Save results to `~/.gstack/projects/{slug}/`. Downstream skills discover upstream artifacts automatically.
2. **Regression Delta** — Compare current score to prior run. WARN if score decreased.
3. **Fix Loop** (game-qa) — Baseline → triage → fix → atomic commit → re-test → classify → WTF check → final re-score.

## Architecture

### Template Engine
```
skills/game-review/SKILL.md.tmpl   ← source (edit this)
         ↓
scripts/gen-skill-docs.ts          ← compiler
         ↓
skills/game-review/SKILL.md        ← generated (don't edit)
```

### Progressive Disclosure (方案 1)
Skills with references/ read ALL reference files upfront before any user interaction. Zero mid-flow interruption.

### Preamble Injection
All skills share `skills/shared/preamble.md` — session tracking, telemetry, AskUserQuestion format, game design vocabulary.

## Migration Guide: gstack → gstack-game

When adapting a gstack skill for game development:

1. **Read the original** from gstack
2. **Keep the structure**: Preamble → Sections → AUTO/ASK/ESCALATE → Scoring → Summary → Artifact → Log
3. **Replace vocabulary**: user→player, feature→mechanic, API→game system, deployment→platform submission, MRR→ARPDAU
4. **Add game-specific criteria** that gstack doesn't cover
5. **Add references/** with gotchas, scoring rubric, domain benchmarks

## Development

```bash
bun run build                    # generate all SKILL.md
bun run gen:skill-docs:check     # check for drift (CI)
bun test                         # run validation tests
```

### Adding a skill
1. Create `skills/my-skill/SKILL.md.tmpl` with `{{PREAMBLE}}`
2. Add `references/` if >300 lines
3. Run `bun run build` + `bun test`
4. Commit both `.tmpl` and `.md`

### File structure
```
gstack-game/
├── CLAUDE.md                       ← AI agent handoff
├── README.md / README.zh-TW.md    ← User-facing docs
├── CONTRIBUTING.md / .zh-TW.md    ← Contributor guide (3-layer)
├── ETHOS.md                        ← Game dev philosophy
├── CHANGELOG.md                    ← Version history
├── VERSION                         ← 0.3.0
├── package.json                    ← Build scripts
├── .github/ISSUE_TEMPLATE/         ← 4 contribution templates
├── bin/                            ← 7 utilities
├── scripts/gen-skill-docs.ts       ← Template engine
├── skills/                         ← 27 skills + shared/
│   ├── shared/preamble.md
│   ├── game-review/
│   │   ├── SKILL.md.tmpl           ← source
│   │   ├── SKILL.md                ← generated
│   │   └── references/             ← 8 files
│   └── ... (26 more skills)
├── test/                           ← Validation tests
└── docs/
    ├── DEVELOPMENT.md              ← This file
    └── domain-judgment-gaps.md     ← Expert calibration checklist
```

## Reference Sources

- **gstack**: `C:\ai_project\gstack` — methodology patterns
- **guardian**: `C:\ai_project\guardian` — PlayerSimulatorAgent prompts, Iceberg framework
- **Process notes archive**: `C:\ai_project\guardian\docs\tech\gstack\` — analysis docs from development
