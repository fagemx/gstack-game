# Phase 1: Research — `/triage` Entry Point Skill

## Issue Summary

Issue #1 proposes a new `/triage` skill to solve the onboarding problem: 26 published skills exist with no guided entry point. New users must read README and self-select from the skill map. The issue suggests 3-5 questions that route users to the right starting skill.

**Workflow position:** Meta layer (above Layers A/B/C). No upstream. Downstream routes to `/game-import`, `/game-ideation`, `/game-review`, `/game-direction`, `/game-qa`, `/feel-pass`, `/build-playability-review`, `/prototype-slice-plan`, `/game-ship`.

**Priority:** P0 — labeled as biggest onboarding barrier.

## Skill Analysis

### Current Entry Points (de facto)

Two skills currently serve as entry points, but neither is designed for routing:

1. **`/game-import`** (Layer A, Scaffolding) — Imports and standardizes GDDs from any format into `docs/gdd.md`. Has a Phase 1 context-gathering step that detects existing docs and source files. Includes a routing table at the end (Phase 6) that recommends next skills based on GDD completeness. **Key detail:** Already asks "What do you have?" with options including "Nothing yet — let's start from scratch with `/game-ideation`."

2. **`/game-ideation`** (Layer A, Design) — Interactive brainstorming. Phase 0 performs a maturity assessment (5 levels: no idea → playtest feedback). Routes internally based on maturity but does not route to other skills at entry. Recommends next skills only at completion.

### All 26 Published Skills (Routing Table)

| Layer | Skills | Count |
|-------|--------|-------|
| A — Design | game-import, game-ideation, game-direction, game-review, game-eng-review, balance-review, player-experience, game-ux-review, pitch-review | 9 |
| B — Bridge + Production | prototype-slice-plan, implementation-handoff, gameplay-implementation-review, feel-pass | 4 |
| C — Validation + Release | build-playability-review, game-qa, game-ship, game-docs, game-retro, game-codex, game-visual-qa, asset-review, playtest, game-debug | 10 |
| Safety | careful, guard, unfreeze | 3 |

### Skill Map Flow (from DEVELOPMENT.md)

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
```

Full workflow: `design → slice-plan → handoff → build → feel-pass → impl-review → playability → QA → ship`

## Codebase Findings

### Template System
- All skills use `SKILL.md.tmpl` with `{{PREAMBLE}}` and `{{SKILL_NAME}}` placeholders.
- Template engine: `scripts/gen-skill-docs.ts` compiles `.tmpl` → `.md`.
- YAML frontmatter required: `name`, `description`, `user_invocable`.
- Build: `bun run build`, test: `bun test` (11 tests must pass).

### Preamble (shared across all skills)
- Session tracking (slug, branch, user, session ID)
- Shared artifact storage at `~/.gstack/projects/{slug}/`
- Telemetry logging
- AskUserQuestion format (4-part: re-ground, simplify, recommend, options)
- Game-specific vocabulary list
- Completion status protocol (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)

### Artifact Discovery Pattern
Existing skills check `~/.gstack/projects/{slug}/` for prior work at startup. Examples:
- `game-import` checks for `*-gdd-import-*.md`, `*-concept-*.md`, `*-game-review-*.md`
- `game-ideation` checks for `*-concept-*.md`, `*-game-review-*.md`

### Quality Rubric (15 dimensions, /30)
Key dimensions relevant to `/triage`:
- **A1 Trigger Description** — needs when-to-use AND when-NOT-to-use
- **A3 Mode Routing** — explicit routing at entry, locked after selection
- **B5 STOP Gates** — every section ends with STOP
- **E13 Artifact Discovery** — searches for upstream artifacts
- **E15 Workflow Position** — reads upstream + writes for downstream + recommends next step

Grade targets: 24-30 = Production, 18-23 = Usable, 12-17 = Draft.

### Gstack Methodology (6 things every skill needs)
1. Classification system (review dimensions)
2. Scoring formula (weights and deductions)
3. Action triage (AUTO/ASK/ESCALATE)
4. Forcing questions (anti-sycophancy)
5. Multi-dimensional pass (Critical vs Informational)
6. Completion status definition

## Key Findings

1. **`/game-import` already partially triages.** Its Phase 1 detects what exists and its Phase 6 routing table recommends next skills based on GDD state. However, it only activates AFTER the user has already chosen `/game-import`.

2. **`/game-ideation` has maturity assessment.** Phase 0 classifies the user into 5 maturity levels and adjusts the session accordingly. But it assumes the user already wants ideation.

3. **The issue's suggested logic covers 3 dimensions:** document state, build state, shipping readiness. This maps to Layers A/B/C respectively.

4. **The skill map has clear phase boundaries.** A user is always in one of: no idea, has idea, has GDD, has build, has tested build, preparing to ship. Each maps to a different entry skill.

5. **Artifact discovery is the existing mechanism for detecting project state.** The bash-based checks in preamble and individual skills already scan for GDDs, concepts, builds, and prior review artifacts.

6. **No scoring formula applies.** `/triage` is a routing skill, not a review skill. The 6-methodology items that apply are: classification system (project phase), action triage (AUTO/ASK/ESCALATE), and completion status.

7. **Safety skills (careful/guard/unfreeze) should NOT be routed to by triage.** These are invoked contextually, not as workflow steps.

## Constraints & Open Questions

### Constraints
- Must follow template format: YAML frontmatter + `{{PREAMBLE}}` + content.
- Must use AskUserQuestion format (4-part structure) for every decision point.
- Must include anti-sycophancy section, AUTO/ASK/ESCALATE, completion summary.
- Must end with review log bash block.
- Must write artifact to `~/.gstack/projects/{slug}/` for downstream discovery.
- Must work with `bun run build` and pass `bun test`.

### Open Questions
1. **Should `/triage` read existing artifacts to auto-detect project state, or ask the user?** Artifact discovery can detect GDDs, concepts, prior reviews, and build artifacts. This could reduce questions from 3-5 to 1-2 confirmations.
2. **How many skills should `/triage` be able to route to?** The issue lists 5 downstream targets. The full skill map has 23 non-safety skills. Should triage cover all of them or just the primary entry points per layer?
3. **Should `/triage` produce an artifact?** A "project state assessment" artifact could be useful for downstream skills, or it could be unnecessary overhead for a routing skill.
4. **What happens on repeat invocations?** If the user runs `/triage` again mid-project, should it detect progress and recommend the next workflow step?
5. **Quality tier target?** Given this is a routing skill (not a review skill), the rubric dimensions for scoring (C8, C9) are less relevant. Target should be A-type (Usable) or B-type (Production) on the applicable dimensions.
