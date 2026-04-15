# Changelog

## 0.5.0 — 2026-04-15

**Sharper reviews, richer player personas, community-aware shipping.** Two upstream syncs bring behavioral UX testing, anti-slop detection, and multi-agent methodology to the game review pipeline.

### Upstream sync: gstack (v0.15.7 → v0.17.0)

- **6 game UX behavioral tests** in `/game-ux-review` and `/plan-design-review` — HUD Clarity Test, First Frame Test, Tutorial Bloat Detection, Player Patience Meter, Mindless Choice Audit, Dead Input Test. Each produces a concrete PASS/PARTIAL/FAIL.
- **First-person narration mode** in `/player-experience`, `/feel-pass`, and `/game-ux-review` — reviews must name specific elements and describe moment-by-moment experience. "I tap the screen and... nothing" instead of "the UI lacks feedback."
- **Game Design Slop Blacklist** in `/game-review` — 10 common design anti-patterns (stat-inflation skill trees, meaningless daily logins, tooltip-bombardment tutorials, etc.) with challenge questions and severity classification.
- **Expanded anti-sycophancy** — 12 new banned AI filler phrases, 5 forbidden postures ("That's an interesting approach" → must take a position), punchier writing rules.
- **Confusion Protocol** — all T2+ skills now stop and ask when facing high-stakes design ambiguity instead of guessing.
- **Scope Drift Detection upgrade** — T3 skills now detect both scope creep (analyzed more than requested) and missing requirements (didn't cover what was requested).
- **Token ceiling warning** — template engine warns when any generated SKILL.md exceeds 100KB (~25K tokens).

### Upstream sync: hakoniwa methodology

- **4-dimensional player personas** in `/player-experience` — each persona now has profile, stance spectrum (-1.0 to +1.0), MBTI-informed behavior type, and influence weight (0.1 lurker to 0.9 KOL). New Persona 7: Genre Critic. Stance distribution guide for 5 common launch scenarios.
- **ReACT evidence standards** for T3 skills — every HIGH/CRITICAL finding requires 2+ data points, 1+ direct quote, comparison context, and explicit confidence calibration (HIGH/MEDIUM/LOW).
- **Design consistency evaluator** in `/game-review` — 3 dimensions: voice consistency (do systems match design pillars?), boundary behavior (does design hold under extreme conditions?), environmental storytelling density (how many channels communicate?).
- **Community Reception Forecast** in `/pitch-review` — stakeholder spectrum analysis, amplification timeline prediction, top 2 controversy risk scenarios with mitigation.
- **Launch Window Risk** (Phase 8) in `/game-ship` — audience reaction quick-scan, segment-by-segment risk assessment, timing check against competitor releases.
- **Event injection testing** in `/playtest` — 5 categories of deliberate disruptions (difficulty spikes, economy shocks, social disruptions, UX interruptions, information reveals) with observation framework. Optional Section 1B in playtest protocol.

### Infrastructure

- Shell injection fix in `gstack-review-log` (echo → printf)
- Version sync: package.json now matches VERSION file

## 0.4.0 — 2026-03-25

**Self-guiding workflow.** Skills now tell you what to do next. New entry point skill, deep domain knowledge for 6 skills, and a complete internal maintenance pipeline.

### New skills

- `/triage` — Entry point for new users. Detects project state from artifacts and project files, classifies into 6 states (BLANK/IDEA/DOCUMENTED/REVIEWED/BUILDING/SHIPPING), routes to the right skill. Run this when you don't know where to start.

### Next Step routing

Every skill now ends with a **Next Step** recommendation based on results:
- Score-conditional routing (e.g., Economy < 5 → `/balance-review`)
- Backtrack rules (core loop broken → `/game-ideation`)
- Forward pipeline through all three layers (Design → Production → Validation)
- 27 skills connected into a self-guiding workflow

### Skill depth upgrades

Six skills upgraded from skeleton/thin to production quality with reference files:

| Skill | Before | After |
|-------|--------|-------|
| `/game-codex` | 123L, 40% | 331L + 4 refs (544L). 3-pass adversarial methodology, threat scoring formula, exploit taxonomy, design fallacies |
| `/asset-review` | 128L, 35% | 329L + 5 refs (380L). Pipeline QA role, 7-dimension /14 scoring, per-asset benchmarks |
| `/game-visual-qa` | 140L, 35% | 231L + 5 refs (341L). Animation standards, visual thresholds, deduction scoring, AI confidence disclaimers |
| `/playtest` | 176L, 40% | 251L + 3 refs (238L). Observation metrics with confidence labels, interview question bank, analysis framework |
| `/game-eng-review` | 589L, 0 refs | 462L + 5 refs (587L). Scoring, gotchas, performance budgets, networking patterns, engine framework |
| `/game-debug` | 182L, 55% | Promoted from skeleton table — has full bug recipes |

### Artifact visibility

Every skill now shows existing artifacts on startup (preamble compact summary). Users can see what prior skills produced without manual `ls`.

### Internal maintenance pipeline (for contributors)

Six internal skills in `.claude/skills/` (not published to users):

```
/issue-create → /issue-plan → /issue-action → PR → /pr-review-loop → merge
```

- `/issue-create` — Create GitHub issues from conversation (skill-gap, new-skill, bug)
- `/issue-plan` — Three-phase deep-dive (research → innovate → plan) with TodoWrite tracking
- `/issue-action` — Implement from approved plan, create PR
- `/pr-review-loop` — Automated PR review-fix cycle (bash state machine, max 3 iterations)
- `/skill-review` — 15-dimension quality rubric (moved from published to internal)
- `/contribute-review` — Domain knowledge integration (moved from published to internal)

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
