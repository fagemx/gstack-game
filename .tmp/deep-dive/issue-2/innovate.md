# Phase 2: Innovate — Next Step Routing Approaches

## Approach A: Hardcoded Routing Rules in Each Skill's Completion Summary

Each skill template gets a `## Next Step Routing` section just before or inside its Completion Summary, with skill-specific conditional rules written in natural language.

**Example (game-review):**
```
Next Step:
  If Economy ≤ 5 → /balance-review — economy needs dedicated analysis
  If Core Loop ≤ 5 → /game-ideation — core loop needs restructuring
  If Player Motivation ≤ 5 → /player-experience — validate with player walkthrough
  If Risk ≤ 5 → /game-direction — scope and risk need strategic review
  If WEIGHTED TOTAL ≥ 7 → /prototype-slice-plan — design is ready to slice
  If WEIGHTED TOTAL < 4 → /game-ideation — fundamental rethink needed
  Default → /player-experience — validate design with a walkthrough
```

**Pros:**
- Each skill author has full control over routing logic
- Routing rules can reference skill-specific dimensions (e.g., feel-pass's 7 dimensions, game-qa's 8 categories)
- No new infrastructure needed — just template edits
- Easy to review: each skill's routing is self-contained

**Cons:**
- 21 skills to write routing rules for (excluding 3 safety + 2 already-done)
- If the workflow map changes (new skill added, skill renamed), every upstream skill's routing needs updating
- Risk of inconsistency — one skill might route to `/balance-review` at score < 5, another at score < 4
- No single place to see the full routing graph

**Maintenance burden:** HIGH for changes to the skill map, LOW for day-to-day use.

---

## Approach B: Centralized Routing Table in a Shared File

Create `skills/shared/routing.md` (or add to preamble) with a master routing table. Each skill's Completion Summary includes a generic `{{ROUTING}}` placeholder or a prose instruction: "Consult the routing table in `skills/shared/routing.md` to determine Next Step based on scores and status."

**Example (skills/shared/routing.md):**
```
## Next Step Routing Table

### From /game-review
| Condition | Next Skill | Reason |
|-----------|-----------|--------|
| Economy ≤ 5 | /balance-review | Economy needs dedicated analysis |
| Core Loop ≤ 5 | /game-ideation | Core loop needs restructuring |
| TOTAL ≥ 7 | /prototype-slice-plan | Ready to build |
| Default | /player-experience | Validate with walkthrough |

### From /balance-review
| Condition | Next Skill | Reason |
...
```

**Pros:**
- Single source of truth for the entire routing graph
- Easy to audit: one file shows all connections
- Adding a new skill means updating one file, not many
- Could be validated by tests (check that every skill has routing rules)

**Cons:**
- Adds a new placeholder (`{{ROUTING}}`) or requires Claude to read an extra file at completion time
- Routing rules become disconnected from the skill context — harder for skill authors to reason about
- The centralized file becomes a merge conflict magnet if multiple skills are being edited
- Routing rules still need skill-specific knowledge (what dimensions exist, what scores mean)
- Template engine would need a new placeholder or the instruction must be prose-based

**Maintenance burden:** LOW for skill map changes, MEDIUM for initial setup and template engine changes.

---

## Approach C: Score-Conditional Routing with Standard Thresholds

Hybrid approach. Define a small set of **standard routing conditions** that apply across all skills, plus allow skill-specific overrides.

**Standard conditions (in preamble or shared file):**
```
Standard Next Step Routing:
- STATUS = BLOCKED → STOP. Report blocker. Do not suggest next skill.
- STATUS = NEEDS_CONTEXT → Suggest re-running current skill with more info.
- STATUS = DONE_WITH_CONCERNS → Route to the skill that addresses the top concern.
- STATUS = DONE → Route forward in the workflow pipeline.
```

**Workflow pipeline routing (in preamble):**
```
Layer A forward chain:
  /game-import → /game-review → /player-experience → /balance-review
  /game-ideation → /game-review
  /game-direction → /game-review or /game-eng-review
  /pitch-review → /game-direction

Layer B forward chain:
  /prototype-slice-plan → /implementation-handoff → build → /feel-pass → /gameplay-implementation-review

Layer C forward chain:
  /build-playability-review → /game-qa → /game-ship → /game-docs → /game-retro
```

**Each skill template adds ONLY skill-specific overrides:**
```
Next Step Routing (skill-specific):
  If Economy ≤ 5 → /balance-review — override default forward routing
  If Core Loop ≤ 5 → /game-ideation — backtrack: design needs rework
```

**Pros:**
- Consistent threshold logic across all skills (STATUS-based routing is universal)
- Minimal per-skill work — most skills only need 0-3 override rules
- The workflow pipeline is visible in one place (preamble)
- Backtrack routing is explicitly supported
- Skeleton skills get routing for free via the pipeline chain

**Cons:**
- Two places to look (preamble for pipeline, template for overrides)
- Preamble grows larger (already 80 lines)
- Pipeline routing assumes linear flow, but real workflows branch

**Maintenance burden:** LOW overall. Pipeline changes = 1 edit in preamble. Skill-specific overrides = edit in that skill only.

---

## Trade-off Comparison

| Dimension | A: Hardcoded | B: Centralized | C: Hybrid |
|-----------|-------------|----------------|-----------|
| Consistency | Low (each skill is independent) | High (single file) | High (standard + overrides) |
| Maintenance: add new skill | Edit all upstream skills | Edit 1 file | Edit preamble pipeline + 0-3 upstream overrides |
| Maintenance: rename skill | Edit all referencing skills | Edit 1 file | Edit preamble + overrides |
| Skill author control | Full | Limited | Balanced |
| Merge conflict risk | Low (changes spread across files) | High (single file) | Medium |
| Test coverage | Hard (26 different formats) | Easy (1 file, structured) | Medium (standard rules testable) |
| Template engine changes | None | New placeholder needed | None (prose-based) |
| Works for skeleton skills | Need custom rules each | Get rules automatically | Get pipeline routing automatically |

## Recommendation

**Approach C (Hybrid)** is the best fit for gstack-game because:

1. It respects the existing three-layer architecture documented in DEVELOPMENT.md
2. Skeleton skills (40% quality tier) get routing for free — they just need to be in the pipeline
3. B-type production skills (70-80%) only need 2-4 override rules for score-conditional backtracking
4. No template engine changes required
5. The preamble already establishes shared conventions — routing pipeline is a natural addition
