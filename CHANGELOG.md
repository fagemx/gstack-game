# Changelog

## 0.3.0 — 2026-03-23

**Bridge Layer + Production Workflow.** The biggest structural change since launch. Five new skills fill the gap between design review and implementation. The back half now runs on game production work units (mechanic, feel, playability), not just software delivery units (diff, PR, build).

### New skills

- `/prototype-slice-plan` — Decide what to build first. Which slice, what hypothesis to test, what to fake, what failure looks like. 5-axis scoring with 6 slice types defined (mechanic prototype through vertical slice).
- `/implementation-handoff` — Translate design intent into a build package. Two-layer acceptance criteria (engineering-done + design-done). MUST/SHOULD/COULD priority tagging. Identifies the "soul" of each mechanic.
- `/feel-pass` — Game feel doctor. Diagnose why a mechanic feels dead: responsiveness, impact, rhythm, clarity, payoff, dead time, overload. 7-dimension /14 scoring. Complete feedback chain model (anticipation → action → impact → resolution). Standardized feel vocabulary (snappy, crunchy, hollow, mushy).
- `/build-playability-review` — "Is this worth playing?" 6-dimension /12 scoring: loop closure, session viability, onboarding clarity, failure recovery, retention signal, peak moment. Validates prototype hypothesis from slice plan.
- `/gameplay-implementation-review` — Evolved from `/game-code-review`. Adds Pass 0: Design Intent Survival — checks whether handoff acceptance criteria survived, soul is protected, scope boundaries respected. Keeps full Pass 1 (critical) + Pass 2 (informational) + adversarial.

### New meta skills

- `/skill-review` — Quality assessment for gstack-game skills. 15-dimension rubric, scan dashboard, refactor mode, auto fix loop (score → fix → re-score).
- `/contribute-review` — Convert GitHub Issues (domain expert contributions) into properly formatted PRs. Reads issue → contradiction check → format conversion → validation → PR creation.

### Progressive disclosure

All 4 B-type skills split into references/ subdirectories:
- `/balance-review` — 265L main + 8 reference files
- `/game-review` — 255L main + 8 reference files
- `/player-experience` — 254L main + 5 reference files
- `/pitch-review` — 283L main + 7 reference files

7 additional skills now have references/ with gotchas.md extracted (game-direction, game-eng-review, game-ideation, game-import, game-qa, game-ship, game-ux-review).

### Strengthened skills (substitution test)

- `/game-retro` — Game-specific metrics (playability/feel/GDD score deltas, design intent survival %, milestone types table)
- `/game-debug` — 6 game-specific bug recipes (physics tunneling, network desync, save corruption, frame spike, softlock, audio desync)
- `/game-docs` — Patch note patterns table (nerf/buff/economy/feel/remove), balance change communication protocol
- `/game-codex` — 10-category exploit taxonomy (speed, duplication, state corruption, progression skip, economy abuse, PvP cheat, save manipulation, determinism break, social exploit, content leak)

### Contributor infrastructure

- CONTRIBUTING.md and CONTRIBUTING.zh-TW.md rewritten with 3-layer model (5min Issue / 30min references/ / advanced template)
- 4 GitHub Issue Templates (gotcha, benchmark, forcing question, scoring calibration)
- 4 contribution examples in both languages

### New workflow

```
design → slice-plan → handoff → build → feel → playability → QA → ship
```

Previously: design → code review → QA → ship (missing the middle).

### Documentation

- `docs/skill-writing-patterns.md` — 7+4 patterns from real skill analysis
- `docs/skill-writing-doctrine-nox.md` — 8 core principles
- `docs/gstack-system-strengths.md` — 7 system-level advantages
- `docs/backend-gap-analysis-nox.md` — Why back-half needs game production work units
- `docs/new-skill-specs-bridge-layer.md` — Specs for bridge layer skills
- `docs/skill-quality-rubric.md` — 15-dimension assessment standard (in guardian/docs/tech/gstack/)

## 0.2.0 — 2026-03-22

**20 skills fully scaffolded.** First complete skill set covering the entire game development workflow.

### Added
- 6 game-specific skills (game-review, balance-review, player-experience, pitch-review, asset-review, playtest)
- 13 skills migrated from gstack and rewritten for game context
- careful + guard safety skills (adapted from gstack)
- `docs/domain-judgment-gaps.md` — expert review checklist
- `docs/source-quality-assessment.md` — quality comparison of 3 source references
- `README.md` with full skill map and quality assessment

### Quality levels
- 5 skills at 70-80% (B-type: full domain theory + scoring formulas)
- 8 skills at 55-65% (A-type: complete structure + game vocabulary)
- 7 skills at 35-40% (Skeleton: structure only, content needs domain experts)

## 0.1.0 — 2026-03-22

### Added
- Initial project setup: template engine, preamble, bin utilities
- 4 skill skeletons (game-review, balance-review, player-experience, pitch-review)
- `bin/install.sh` umbrella installer
- `scripts/gen-skill-docs.ts` template engine
- `skills/shared/preamble.md` shared fragment
