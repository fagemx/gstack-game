# Phase 3: Implementation Plan — `/triage` (Approach C: Hybrid)

## Files to Create

| File | Purpose |
|------|---------|
| `skills/triage/SKILL.md.tmpl` | Template source (~300 lines) |
| `skills/triage/SKILL.md` | Generated output (via `bun run build`) |

No `references/` directory needed — `/triage` is a routing skill, not a review skill. All content fits in the main template.

## Template Structure

```yaml
---
name: triage
description: "Entry point for new users. Detects project state from existing artifacts, asks 0-2 targeted questions, and routes to the right skill. Run this when you don't know which gstack-game skill to start with."
user_invocable: true
---
```

### Section Outline

#### 1. Role Identity
```
You are a **game project navigator**. Your job is to figure out where
the user is in their game development process and point them to the
right gstack-game skill. You do NOT review, critique, brainstorm, or
build anything. You route.
```

#### 2. HARD GATE
```
Do NOT start doing the work of the recommended skill. Route only.
If the user says "just do it," respond: "Let me point you there —
run /[skill-name] and it will pick up from here."
```

#### 3. Phase 1: Silent Detection (AUTO)

Bash block that scans for project artifacts:

```bash
echo "=== Project State Detection ==="

# Layer A: Design artifacts
_HAS_GDD=0; _HAS_CONCEPT=0; _HAS_REVIEWS=0
for f in docs/gdd.md docs/game-design.md docs/GDD.md; do
  [ -f "$f" ] && _HAS_GDD=1 && echo "GDD: $f ($(wc -l < "$f") lines)"
done
for f in docs/concept.md docs/idea.md; do
  [ -f "$f" ] && _HAS_CONCEPT=1 && echo "CONCEPT: $f"
done

# Shared artifacts from prior skill runs
_PRIOR_SKILLS=""
for pattern in "*-gdd-import-*" "*-concept-*" "*-game-review-*" "*-balance-review-*" \
               "*-direction-*" "*-player-exp-*" "*-eng-review-*" "*-pitch-review-*" \
               "*-slice-plan-*" "*-impl-handoff-*" "*-impl-review-*" "*-feel-pass-*" \
               "*-playability-*" "*-qa-*" "*-ship-*"; do
  FOUND=$(ls -t $_PROJECTS_DIR/$pattern.md 2>/dev/null | head -1)
  [ -n "$FOUND" ] && _PRIOR_SKILLS="$_PRIOR_SKILLS $pattern" && echo "PRIOR: $FOUND"
done

# Layer B/C: Build artifacts
_HAS_BUILD=0
for marker in "project.godot" "*.unity" "*.uproject" "Cargo.toml" "package.json" \
              "*.sln" "CMakeLists.txt" "Makefile"; do
  FOUND=$(find . -maxdepth 2 -name "$marker" -not -path "./.claude/*" \
    -not -path "./node_modules/*" 2>/dev/null | head -1)
  [ -n "$FOUND" ] && _HAS_BUILD=1 && echo "BUILD: $FOUND"
done

# Prior triage artifact
_PREV_TRIAGE=$(ls -t $_PROJECTS_DIR/*-triage-*.md 2>/dev/null | head -1)
[ -n "$_PREV_TRIAGE" ] && echo "PRIOR TRIAGE: $_PREV_TRIAGE"

echo "---"
echo "HAS_GDD=$_HAS_GDD"
echo "HAS_CONCEPT=$_HAS_CONCEPT"
echo "HAS_BUILD=$_HAS_BUILD"
echo "PRIOR_SKILLS=$_PRIOR_SKILLS"
```

#### 4. Phase 2: State Classification (AUTO)

Classify into one of 6 states based on detection results. Present as prose instructions to Claude:

| Detected State | Classification | Signals |
|---------------|----------------|---------|
| Nothing found | **BLANK** | No GDD, no concept, no build, no prior skills |
| Concept only | **IDEA** | Concept doc exists OR prior `/game-ideation` artifact |
| GDD exists | **DOCUMENTED** | GDD file found OR prior `/game-import` artifact |
| Reviews exist | **REVIEWED** | Prior review artifacts from any Layer A skill |
| Build + reviews | **BUILDING** | Build artifacts + some Layer A/B skill history |
| QA/ship artifacts | **SHIPPING** | Prior `/game-qa`, `/game-ship`, or `/build-playability-review` |

If prior triage exists, also read it and note the previous state for progress comparison.

#### 5. Phase 3: State-Specific Routing (ASK)

One AskUserQuestion per state. Each follows the 4-part format.

**BLANK state:**
> **[Re-ground]** Starting triage for `{project}` on `{branch}`. No game design artifacts found.
>
> **[Simplify]** Think of this like walking into a game studio on day one. I need to know if you're starting from a blank page or if you already have something in mind.
>
> Where are you?
> A) **No idea yet** — I want to brainstorm a game concept from scratch → `/game-ideation`
> B) **I have an idea in my head** — not written down, but I know what I want → `/game-ideation`
> C) **I have a document somewhere** — GDD, pitch doc, notes in Notion/Google Docs → `/game-import`
> D) **I have a playable build** — just no docs in this repo yet → `/game-import` (to document what exists)
>
> RECOMMENDATION: Choose A or B if you're still figuring out the game. Choose C if you've already written things down elsewhere.

**IDEA state:**
> **[Re-ground]** Found concept doc: `{filename}`. No standardized GDD yet.
>
> **[Simplify]** You have a concept but no formal design document. Like having a movie pitch but no screenplay.
>
> What would you like to do?
> A) **Formalize into a GDD** — turn this concept into a structured design doc → `/game-import`
> B) **Still exploring** — the concept needs more brainstorming before formalizing → `/game-ideation`
> C) **Get a design review** — I want feedback on this concept as-is → `/game-review`
>
> RECOMMENDATION: Choose A if the concept feels solid. Choose B if you're not sure about the core loop yet.

**DOCUMENTED state:**
> **[Re-ground]** Found GDD: `{filename}` ({N} lines, {X}/8 sections).
>
> **[Simplify]** You have a design document. The question is what to do with it.
>
> A) **Design review** — check for gaps, risks, and design issues → `/game-review`
> B) **Player walkthrough** — simulate a player's first experience → `/player-experience`
> C) **Plan the build** — scope a prototype or vertical slice → `/prototype-slice-plan`
> D) **Check the pitch** — evaluate this as a pitch to publishers/investors → `/pitch-review`
> E) **Something else** — tell me what you're trying to accomplish
>
> RECOMMENDATION: Choose A if no review has been done yet. The design review surfaces issues before you invest build time.

**REVIEWED state:**
> **[Re-ground]** Found prior reviews: {list}. Design phase appears complete.
>
> **[Simplify]** Reviews are done. Next question is whether to start building or address review findings first.
>
> A) **Plan the build** — scope a prototype slice → `/prototype-slice-plan`
> B) **Review the direction** — strategic assessment before committing to build → `/game-direction`
> C) **Address review findings** — go back and fix issues found in reviews → `/game-review` (re-run)
> D) **Balance deep-dive** — economy and progression need specific attention → `/balance-review`
>
> RECOMMENDATION: Choose A if reviews came back clean. Choose C if reviews flagged critical issues.

**BUILDING state:**
> **[Re-ground]** Build artifacts detected: {engine/framework}. Prior reviews exist.
>
> **[Simplify]** You have code and you have design docs. The question is what stage the build is at.
>
> A) **Playability check** — is the build fun to play right now? → `/build-playability-review`
> B) **Game feel pass** — controls, feedback, juice — does it FEEL right? → `/feel-pass`
> C) **Code review** — review implementation quality of recent changes → `/gameplay-implementation-review`
> D) **QA sweep** — systematic bug and quality check → `/game-qa`
> E) **Playtest protocol** — set up a structured playtest with real players → `/playtest`
>
> RECOMMENDATION: Choose A or B if this is a first playable. Choose D if you're past prototype.

**SHIPPING state:**
> **[Re-ground]** QA/ship artifacts detected. You appear to be in the release phase.
>
> A) **Continue QA** — more testing needed → `/game-qa`
> B) **Ship it** — release checklist and process → `/game-ship`
> C) **Release docs** — patch notes, store listing, marketing copy → `/game-docs`
> D) **Retrospective** — the build shipped, time to reflect → `/game-retro`
>
> RECOMMENDATION: Choose B if QA is green. Choose A if there are known issues.

**STOP.** Wait for user's choice. Then confirm the routing.

#### 6. Phase 4: Routing Confirmation (ASK)

After the user picks an option:

> **Routing to `/{skill-name}`.**
>
> What it does: {one-line description from the skill's frontmatter}
> Expected duration: {estimate based on skill complexity}
> What it needs from you: {what input the skill will ask for}
>
> A) Go — run `/{skill-name}` now
> B) Tell me more — what exactly will it ask me?
> C) Different skill — I changed my mind

**STOP.** If A, the session is complete. User runs the recommended skill.

#### 7. Anti-Sycophancy

**Forbidden phrases — NEVER say these:**
- "Great choice!"
- "You're in a good position"
- "Your project looks promising"
- "You've made great progress"
- "That's the right skill for you"

**Instead — state facts:**
- "Your project has a GDD with 5/8 sections and no prior reviews. `/game-review` is the standard next step."
- "No artifacts detected. You're starting from zero — `/game-ideation` builds the foundation."
- "Three review artifacts exist but no build plan. The gap between design and implementation is where `/prototype-slice-plan` fits."

**Calibrated acknowledgment (OK to say):**
- "Moving from IDEA to DOCUMENTED in one session is a concrete step forward — the GDD gives downstream skills something to work with."
- "Having QA artifacts means you've been through most of the pipeline. The remaining question is whether the QA findings are addressed."

#### 8. AUTO / ASK / ESCALATE

- **AUTO:** Artifact detection, state classification, prior triage comparison, skill description lookup.
- **ASK:** State confirmation (Phase 3), skill selection, routing confirmation (Phase 4).
- **ESCALATE:** Contradictory signals (e.g., QA artifacts but no GDD — something is out of order). User cannot describe what they need after 2 attempts — suggest reading the README skill map.

#### 9. Completion Summary

```
Triage Summary:
  Project: {slug}
  Detected State: {BLANK/IDEA/DOCUMENTED/REVIEWED/BUILDING/SHIPPING}
  Prior Triage: {yes — was {state}, now {state} / no — first run}
  Artifacts Found: {count and types}
  Questions Asked: {0-2}
  Routed To: /{skill-name}
  Reason: {one line}
  STATUS: DONE
```

#### 10. Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-triage-${_DATETIME}.md"
```

Write project state assessment to shared storage. Format:
```markdown
# Triage — {project} ({date})

State: {BLANK/IDEA/DOCUMENTED/REVIEWED/BUILDING/SHIPPING}
Routed to: /{skill-name}

## Detected Artifacts
- {list}

## Prior Triage
{previous state if exists, or "First run"}

Supersedes: {prior triage filename if exists}
```

#### 11. Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"triage","timestamp":"TIMESTAMP","status":"STATUS","detected_state":"STATE","routed_to":"SKILL","artifacts_found":N,"questions_asked":N}' 2>/dev/null || true
```

#### 12. Telemetry (from preamble)

Standard telemetry block.

## Anti-Sycophancy Phrases (Complete List)

**Forbidden:**
- "Great choice!"
- "You're in a good position"
- "Your project looks promising"
- "You've made great progress"
- "That's the right skill for you"
- "Smart move"
- "Good instinct"

**Forcing questions (for contradictory states):**
- "Your repo has build files but no design document. Did you start coding before designing, or is the GDD stored somewhere else?"
- "I found review artifacts but no GDD. Were these reviews done on a document that's since been removed?"

## AUTO / ASK / ESCALATE Classification

| Action | Classification | Rationale |
|--------|---------------|-----------|
| Scan for artifacts | AUTO | No user input needed |
| Classify project state | AUTO | Deterministic from artifact presence |
| Read prior triage artifact | AUTO | Context gathering |
| Present detected state | ASK | User must confirm accuracy |
| Skill recommendation | ASK | User chooses from options |
| Routing confirmation | ASK | Final go/no-go |
| Contradictory signals | ESCALATE | Cannot auto-resolve |
| User cannot articulate need | ESCALATE | After 2 attempts, suggest README |

## Verification Checklist

Before merging:

- [ ] `skills/triage/SKILL.md.tmpl` exists with valid YAML frontmatter
- [ ] `name: triage`, `user_invocable: true` in frontmatter
- [ ] `{{PREAMBLE}}` placeholder present
- [ ] `{{SKILL_NAME}}` used in review log block
- [ ] `bun run build` generates `skills/triage/SKILL.md` without errors
- [ ] `bun test` passes all 11 tests (plus any new tests for triage)
- [ ] Every AskUserQuestion follows 4-part format (re-ground, simplify, recommend, options)
- [ ] Every section ends with `**STOP.**`
- [ ] Anti-sycophancy section with forbidden phrases + calibrated examples
- [ ] AUTO/ASK/ESCALATE section with clear boundaries
- [ ] Completion summary block with STATUS
- [ ] Review log bash block at end
- [ ] Artifact saved to `~/.gstack/projects/{slug}/`
- [ ] All 6 state paths tested manually (BLANK through SHIPPING)
- [ ] Re-invocation tested (run triage, run a skill, run triage again — detects progress)

## Documentation Updates Needed

| File | Change |
|------|--------|
| `docs/DEVELOPMENT.md` | Add `/triage` to skill map (Meta layer, above Layer A). Add to "All 26 Published Skills" table (becomes 27). |
| `README.md` | Add `/triage` to Quick Start section as the recommended first command. Update skill count. |
| `README.zh-TW.md` | Same changes as README.md, in Traditional Chinese. |
| `CLAUDE.md` | Add `triage/` to project structure listing. Update skill count from 21 to 22 in the skills/ description. |
| `CHANGELOG.md` | Add entry under next version: "New skill: `/triage` — guided entry point that detects your project state and recommends which skill to run first." |

## Estimated Effort

- Template authoring: ~2-3 hours (6 state paths, each with AskUserQuestion)
- Build + test: ~15 minutes
- Documentation updates: ~30 minutes
- Manual testing (all 6 paths): ~1 hour
- **Total: ~4-5 hours**
