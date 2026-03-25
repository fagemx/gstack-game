# Phase 3: Implementation Plan — Next Step Routing

## Chosen Approach: C (Hybrid — Standard Pipeline + Skill-Specific Overrides)

## Architecture

### Component 1: Shared routing pipeline in preamble

Add a `## Next Step Routing` section to `skills/shared/preamble.md` that defines:
- Status-based routing rules (universal for all skills)
- The three-layer workflow pipeline (forward chain)
- Backtrack convention (when to route backward)

### Component 2: Skill-specific routing blocks in each template

Each skill's Completion Summary code block gains a `Next Step:` section with:
- The default forward pipeline destination (from preamble)
- 0-5 conditional overrides based on that skill's scores/dimensions

### Component 3: Routing format standard

```
Next Step:
  PRIMARY: /next-skill — [reason based on results]
  (if [condition]): /alternate-skill — [reason]
  (if [condition]): /alternate-skill — [reason]
```

---

## File Changes

### 1. `skills/shared/preamble.md` (add ~25 lines)

Add after the "Completion Status Protocol" section:

```markdown
## Next Step Routing Protocol

After every Completion Summary, include a `Next Step:` block. Route based on:

1. **STATUS = BLOCKED** → Do not suggest a next skill. Report the blocker.
2. **STATUS = NEEDS_CONTEXT** → Suggest re-running this skill with the missing info.
3. **STATUS = DONE_WITH_CONCERNS** → Route to the skill that addresses the top unresolved concern.
4. **STATUS = DONE** → Route forward in the workflow pipeline.

### Workflow Pipeline

Layer A (Design):
  /game-import → /game-review
  /game-ideation → /game-review
  /game-review → /player-experience → /balance-review → /prototype-slice-plan
  /game-direction → /game-review or /game-eng-review
  /pitch-review → /game-direction
  /game-eng-review → /prototype-slice-plan
  /game-ux-review → /game-review (if GDD changes needed) or /prototype-slice-plan

Layer B (Production):
  /prototype-slice-plan → /implementation-handoff → [build] → /feel-pass → /gameplay-implementation-review

Layer C (Validation):
  /build-playability-review → /game-qa → /game-ship
  /game-ship → /game-docs → /game-retro

Support skills (route based on findings):
  /game-debug → re-run /game-qa or /feel-pass
  /playtest → /player-experience or /balance-review
  /game-codex → /game-review
  /game-visual-qa → /game-qa or /asset-review
  /asset-review → /game-visual-qa or /build-playability-review

### Backtrack Rules

When a score or finding indicates a design-level problem, route backward:
- Core loop fundamentally broken → /game-ideation
- GDD needs rewriting → /game-review
- Scope/direction unclear → /game-direction
- Economy unsound → /balance-review

### Format

Always include in the Completion Summary code block:
  Next Step:
    PRIMARY: /skill — reason
    (if condition): /skill — reason
```

### 2. Each skill template (21 workflow skills)

For each skill, add a `Next Step:` section inside the Completion Summary code block, just before the closing ``` fence.

---

## Phased Rollout

### Wave 1: High-traffic design skills (6 skills)

These are the most-used skills and form the core design review loop. Do these first.

| Skill | Forward Default | Conditional Overrides |
|-------|----------------|----------------------|
| `/game-review` | `/player-experience` | Economy ≤ 5 → `/balance-review`; Core Loop ≤ 5 → `/game-ideation`; Risk ≤ 5 → `/game-direction`; TOTAL ≥ 7 → `/prototype-slice-plan` |
| `/game-ideation` | `/game-review` | Concept too vague → re-run `/game-ideation`; Ready for GDD → `/game-import` |
| `/balance-review` | `/prototype-slice-plan` | Economy redesign needed → `/game-review`; Player impact unknown → `/player-experience`; TOTAL ≥ 7 → `/prototype-slice-plan` |
| `/player-experience` | `/balance-review` | Critical friction → `/game-ux-review`; Core loop unclear → `/game-review`; Feel issues → `/feel-pass`; TOTAL ≥ 7 → `/prototype-slice-plan` |
| `/game-direction` | `/game-review` | Technical risk primary → `/game-eng-review`; Premise failed → `/game-ideation`; Market risk → `/pitch-review` |
| `/pitch-review` | `/game-direction` | Pitch fundamentally weak → `/game-ideation`; Market positioning unclear → `/game-direction` |

### Wave 2: Bridge + production skills (5 skills)

The Layer B pipeline that connects design to validation.

| Skill | Forward Default | Conditional Overrides |
|-------|----------------|----------------------|
| `/prototype-slice-plan` | `/implementation-handoff` | (already has routing — enhance with conditional) Score < 6 → reconsider candidates |
| `/implementation-handoff` | `/feel-pass` | (already has routing — keep as-is, add conditionals) Complex architecture → `/game-eng-review` first |
| `/feel-pass` | `/build-playability-review` | (already has routing — enhance) Dead verdict → fix + re-run `/feel-pass`; Technical issue → `/game-debug` |
| `/gameplay-implementation-review` | `/build-playability-review` | Architecture issues → `/game-eng-review`; Design deviation → `/game-review` |
| `/game-import` | `/game-review` | (already has routing table — keep as gold standard, no changes needed) |

### Wave 3: Validation + release skills (7 skills)

Layer C pipeline plus support skills.

| Skill | Forward Default | Conditional Overrides |
|-------|----------------|----------------------|
| `/build-playability-review` | `/game-qa` | (already has routing — enhance) Feel issues → `/feel-pass` |
| `/game-qa` | `/game-ship` | Critical bugs → fix loop first; Score < 75 → DO_NOT_SHIP, fix + re-run |
| `/game-ship` | `/game-docs` | BLOCKED → fix blocker; SHIPPED → `/game-docs` → `/game-retro` |
| `/game-docs` | `/game-retro` | (simple forward routing) |
| `/game-retro` | Next sprint's `/game-direction` | (terminal skill — suggest starting next cycle) |
| `/game-eng-review` | `/prototype-slice-plan` | Architecture unsound → fix first; Tech debt critical → `/game-debug` |
| `/game-ux-review` | `/game-review` or `/prototype-slice-plan` | UX requires GDD changes → `/game-review`; UX OK → forward |

### Wave 4: Support + skeleton skills (6 skills)

Lower-traffic skills that still benefit from routing.

| Skill | Forward Default | Conditional Overrides |
|-------|----------------|----------------------|
| `/game-debug` | Re-run triggering skill | Route back to `/game-qa` or `/feel-pass` based on bug type |
| `/playtest` | `/player-experience` or `/balance-review` | Route based on playtest findings |
| `/game-codex` | `/game-review` | Adversarial findings → re-review |
| `/game-visual-qa` | `/game-qa` | Visual issues → `/asset-review` |
| `/asset-review` | `/build-playability-review` | Asset pipeline issues → fix first |
| `/game-docs` | `/game-retro` | (simple) |

### Not in scope: Safety skills (3 skills)

`/careful`, `/guard`, `/unfreeze` — these are utility toggles, not workflow skills. No routing needed.

---

## Implementation Steps Per Skill

For each skill template in the wave:

1. Open `skills/{skill}/SKILL.md.tmpl`
2. Locate the Completion Summary code block
3. Add `Next Step:` section before the closing ``` with:
   - PRIMARY forward route
   - Conditional overrides (referencing actual score/dimension names from that skill)
4. Run `bun run build` to regenerate SKILL.md
5. Run `bun test` to verify no drift

## Verification

1. **Manual review:** For each skill, verify the routing rules make sense given the skill's scores and the workflow map in DEVELOPMENT.md.
2. **`bun test`:** All 11 existing tests must pass after each wave.
3. **Cross-reference check:** Every skill mentioned in a routing rule must exist as a published skill.
4. **Completeness check:** After all 4 waves, grep for `Next Step:` in all SKILL.md.tmpl files — should match 21 of 26 (excluding 3 safety skills and /game-import which already has routing, and /game-docs counted once).

## Estimated Effort

| Wave | Skills | Effort |
|------|--------|--------|
| Preamble update | 1 file | ~15 min |
| Wave 1 | 6 skills | ~45 min |
| Wave 2 | 5 skills (3 already have partial routing) | ~30 min |
| Wave 3 | 7 skills | ~40 min |
| Wave 4 | 6 skills (skeleton, simpler) | ~20 min |
| Build + test | All | ~10 min |
| **Total** | **25 files + 1 shared** | **~2.5 hours** |

## Commit Strategy

Bisect-friendly commits per CLAUDE.md guidelines:

1. `feat(preamble): add Next Step Routing Protocol to shared preamble`
2. `feat(routing): add Next Step routing to Wave 1 design skills (6 templates)`
3. `feat(routing): add Next Step routing to Wave 2 production skills (5 templates)`
4. `feat(routing): add Next Step routing to Wave 3 validation skills (7 templates)`
5. `feat(routing): add Next Step routing to Wave 4 support skills (6 templates)`
6. `chore: regenerate all SKILL.md from updated templates`

Each commit includes both `.tmpl` and generated `.md` files per project convention.
