# Phase 1: Research — game-eng-review Reference Gap

## Current State

**Template:** 589 lines, 8 sections, 0 reference files.
**References directory:** Does not exist.

### The 8 Dimensions in the Template

| # | Section | Weight | Lines | Has Scoring Rubric | Has Forcing Questions | Has Red Flags | Has Benchmarks |
|---|---------|--------|-------|--------------------|-----------------------|---------------|----------------|
| 1 | Engine & Framework | 15% | ~45L | Yes (5 criteria, /10) | Yes (2 Qs) | Yes (5 flags) | No |
| 2 | Rendering & Performance | 20% | ~65L | Yes (5 criteria, /10) | Yes (2 Qs) | Yes (5 flags) | Partial (frame budget table) |
| 3 | Networking Architecture | 15% | ~50L | Yes (5 criteria, /10) | Yes (3 Qs) | Yes (5 flags) | Partial (network model table) |
| 4 | Data & Persistence | 10% | ~35L | Yes (5 criteria, /10) | Yes (3 Qs) | Yes (5 flags) | No |
| 5 | Asset Pipeline | 10% | ~35L | Yes (5 criteria, /10) | Yes (2 Qs) | Yes (5 flags) | Partial (store size limits) |
| 6 | Platform Adaptation | 10% | ~20L | Yes (5 criteria, /10) | No dedicated | No dedicated | No |
| 7 | Testing Strategy | 10% | ~30L | Yes (5 criteria, /10) | No dedicated | Yes (5 flags) | No |
| 8 | Cross-Section Consistency | 10% | ~35L | Yes (3 criteria, /10) | No dedicated | No dedicated | No |

### What the Template Does Well (already in 589L)

- Complete scoring rubrics for all 8 sections with explicit point ranges
- Weighted total calculation with N/A redistribution (networking for single-player)
- Smart routing table (which sections to prioritize by game type)
- Anti-sycophancy protocol with forbidden phrases and push-back cadence
- Cross-validation matrix (Section 8)
- Architecture context anchors (Step 0)
- Action classification (AUTO/ASK/ESCALATE) for every section

### What's Missing: Benchmark Data

The template says "check your frame budget" but doesn't give the numbers. Here's the gap analysis:

**Sections 2 (Rendering) and 3 (Networking) are most urgent** — these are the most quantitative dimensions where Claude needs hard numbers to give meaningful feedback.

| Missing Data | Section | Urgency | Why |
|---|---|---|---|
| Frame budgets by platform (mobile/PC/console/Switch) | S2 | CRITICAL | Template has a generic 60fps/30fps table but no per-platform memory ceilings, draw call limits, or GPU tier benchmarks |
| Texture/mesh memory budgets by platform | S2, S5 | CRITICAL | "No texture size standards" is a red flag but no reference for what the standards ARE |
| Tick rate benchmarks by game type | S3 | HIGH | Template classifies network models but gives no tick rate targets |
| Bandwidth budgets (mobile vs desktop) | S3 | HIGH | Template mentions "50-100 KB/s" once but needs structured data |
| Store size limits by platform | S5 | MEDIUM | Template mentions iOS 200MB and Play 150MB — needs full table including Switch, Steam, etc. |
| Engine-specific pitfalls | S1 | MEDIUM | Template reviews engine choice but has no concrete gotcha list per engine |
| Claude-specific gotchas for arch review | All | HIGH | No gotchas.md at all — compare with game-review and balance-review which both have dedicated gotchas files |
| Scoring weight justification | All | MEDIUM | Weights exist (15/20/15/10/10/10/10/10) but no rationale for why |

## Comparison with Reference Skills

### game-review (8 reference files)
```
references/
  core-loop.md        — Nested loop model, MDA framework, forcing Qs
  progression.md      — FTUE, retention hooks, difficulty curve
  economy.md          — Sink/faucet, monetization ethics
  motivation.md       — SDT, player types, ludonarrative
  risk.md             — Risk categories
  cross-section.md    — Cross-validation details
  gotchas.md          — Anti-sycophancy + Claude-specific operational mistakes
  scoring.md          — Full rubrics + mode weight adjustments
```

**Pattern:** One reference file per section + gotchas.md + scoring.md as shared files.

### balance-review (8 reference files)
```
references/
  difficulty-curve.md    — Flow channel theory, spike detection
  economy-model.md       — Sink/faucet mapping, inflation projection, Gini
  progression.md         — Milestone pacing, grind ratio
  monetization.md        — Free player viability, P2W perception
  character-balance.md   — Framework consistency, counter systems
  cross-section.md       — Cross-validation
  gotchas.md             — 7 Claude-specific mistakes + anti-sycophancy + forcing Qs
  scoring.md             — All 5 section formulas + weighted total
```

**Pattern:** Same — one per section + gotchas + scoring. The gotchas file is especially valuable: balance-review has 7 specific Claude mistakes (e.g., "accepts round numbers as evidence", "ignores time dimension", "trusts designer labels").

### Key Pattern Observed

Both mature skills follow: **SKILL.md.tmpl is orchestration (~300-400L), references/ hold the domain knowledge.** game-eng-review is the opposite: 589L template with ALL knowledge inline. This makes it hard to update individual dimensions and hard for Claude to reference specific benchmarks during review.

## Rubric Assessment (from skill-review rubric.md)

Relevant dimensions for this issue:

- **C9. Domain Benchmarks:** Currently **0/2** (no industry reference data). Target: 2/2.
- **C7. Gotchas:** Currently **1/2** (has anti-sycophancy in template but no Claude-specific operational gotchas file). Target: 2/2.
- **D10. Progressive Disclosure:** Currently **0/2** (everything in one 589L file, no references/). Target: 2/2.

## domain-judgment-gaps.md Findings

The domain-judgment-gaps doc identifies for game-eng-review:
- Needs dimension weights calibration
- Needs platform-specific performance benchmarks
- Needs engine-specific pitfall data
- **Expert needed: Game programmer with profiling experience across Unity/Godot/Unreal**

## Summary: Urgency Ranking

1. **scoring.md** — Extract scoring rubrics from template into reference file (structural cleanup + weight rationale)
2. **gotchas.md** — Claude-specific mistakes when reviewing architecture (no equivalent exists)
3. **performance-budgets.md** — Frame budgets, draw call limits, memory ceilings by platform
4. **networking-patterns.md** — Tick rates, bandwidth budgets, prediction model comparison
5. **engine-gotchas.md** — Per-engine pitfalls (Unity GC, Godot GDScript perf, Unreal BP boundaries)
6. **platform-budgets.md** — Store size limits, cert requirements, input method coverage
7. **data-patterns.md** — Save format patterns, schema migration strategies
8. **testing-strategy.md** — CI/CD patterns for game projects, profiling tool landscape
