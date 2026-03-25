# Phase 2: Innovate — Approaches for game-eng-review References

## Approach A: One Reference File Per Dimension (8 files)

Mirror the game-review and balance-review pattern exactly.

```
skills/game-eng-review/references/
  engine-framework.md       — S1: Engine fitness criteria, engine-specific pitfalls
  rendering-performance.md  — S2: Frame budgets, draw call limits, memory ceilings
  networking.md             — S3: Tick rates, bandwidth, prediction models
  data-persistence.md       — S4: Save format patterns, schema migration
  asset-pipeline.md         — S5: Store limits, texture specs, loading strategies
  platform-adaptation.md    — S6: Cert requirements, input methods, performance tiers
  testing-strategy.md       — S7: CI/CD patterns, profiling tools, test frameworks
  cross-section.md          — S8: Cross-validation patterns (already in template)
  gotchas.md                — Claude-specific mistakes for arch review
  scoring.md                — All 8 rubrics + weight table + mode adjustments
```

**Total: 10 files.**

| Pro | Con |
|-----|-----|
| Consistent with game-review/balance-review pattern | 10 files is a lot to create and maintain |
| Each dimension is independently updatable | Some sections (S6, S7, S8) may not have enough content to justify a standalone file |
| Progressive disclosure: template drops from ~589L to ~300L | Requires extracting content FROM template into references (migration work) |
| Claude can reference specific benchmarks during review | Some sections need deep domain expertise to fill properly (S3 networking especially) |

**Effort estimate:** ~4-6 hours to create all files with quality content. Sections 2-3 need the most domain research.

---

## Approach B: Grouped by Concern (4 files)

Group related dimensions into fewer, thicker reference files organized by the type of knowledge, not by section number.

```
skills/game-eng-review/references/
  performance-budgets.md    — Frame budgets, memory ceilings, draw call limits,
                              texture specs, store size limits, loading benchmarks
                              (covers S2 + S5 + parts of S6)
  networking-patterns.md    — Network models, tick rates, bandwidth budgets,
                              prediction/rollback comparison, cheat prevention
                              (covers S3)
  engine-gotchas.md         — Per-engine pitfalls (Unity, Godot, Unreal, custom),
                              engine fitness by genre, platform support matrix
                              (covers S1 + parts of S6)
  scoring.md                — All 8 rubrics + weight rationale + mode adjustments
                              + gotchas (Claude-specific mistakes)
                              (covers scoring + gotchas)
```

**Total: 4 files.**

| Pro | Con |
|-----|-----|
| Matches the 4 files proposed in the original issue | Mixes concerns — performance-budgets.md covers 3 sections |
| Fewer files to maintain | Not consistent with game-review/balance-review pattern |
| Each file has enough content to be substantial | Harder to find specific data (performance budgets for rendering vs asset pipeline are in same file) |
| Pragmatic — focuses effort where it matters | gotchas.md merged into scoring.md loses the dedicated gotchas pattern |

**Effort estimate:** ~3-4 hours. Less files but same total content.

---

## Approach C: Minimal Viable Set (3-4 files, critical gaps only)

Create only the files that address the most urgent gaps identified in Phase 1. The remaining sections stay in the template until a domain expert can calibrate them.

```
skills/game-eng-review/references/
  scoring.md                — Extract ALL rubrics from template + add weight rationale
                              + add mode adjustments by game type
  gotchas.md                — Claude-specific mistakes for architecture review
                              + anti-sycophancy protocol (extract from template)
  performance-budgets.md    — Frame budgets by platform, draw call targets,
                              memory ceilings, texture size standards
                              (the most critical missing benchmark data)
```

**Total: 3 files.** Optional 4th file: `networking-patterns.md` if multiplayer data is tractable.

| Pro | Con |
|-----|-----|
| Addresses the 3 highest-urgency gaps first | Leaves S4, S6, S7, S8 without dedicated references |
| Achievable without deep domain expert for every section | Inconsistent with the per-section pattern of sibling skills |
| scoring.md + gotchas.md give immediate rubric quality improvement | Template stays at ~450L instead of dropping to ~300L |
| Can be done incrementally — add more files later | "Partial migration" may be confusing (some content in template, some in references) |

**Effort estimate:** ~2-3 hours. Fast to ship, unblocks the biggest pain point.

---

## Trade-off Analysis

| Factor | Approach A (8 files) | Approach B (4 files) | Approach C (3 files) |
|--------|---------------------|---------------------|---------------------|
| **Completeness** | Full coverage | Full coverage | Partial — critical gaps only |
| **Effort** | High (~4-6h) | Medium (~3-4h) | Low (~2-3h) |
| **Pattern consistency** | Matches game-review, balance-review exactly | Different grouping | Partial match |
| **Domain expert dependency** | High — S3 (networking) and S1 (engine) need real expertise | High — same content, fewer files | Medium — can skip sections needing deepest expertise |
| **Maintainability** | Best — update one section without touching others | Good — fewer files but larger | OK — but mixed pattern (some in template, some in references) |
| **Template line reduction** | ~589L to ~250-300L | ~589L to ~300L | ~589L to ~400-450L |
| **Rubric improvement (C8/C9)** | C9: 0 to 2, C8 stays 2 | Same | C9: 0 to 1 (partial) |
| **Progressive disclosure (D10)** | 0 to 2 | 0 to 2 | 0 to 1 |

## Recommendation

**Approach A with phased delivery.** Here is the reasoning:

1. **Pattern consistency matters.** game-review and balance-review both use one-file-per-section. Breaking the pattern for game-eng-review creates cognitive overhead for contributors. Approach A follows the established convention.

2. **Phase the work to manage effort.** Do not create all 10 files at once:
   - **Phase 1 (immediate):** scoring.md + gotchas.md + performance-budgets.md (the 3 from Approach C)
   - **Phase 2 (next sprint):** networking.md + engine-framework.md (need domain research)
   - **Phase 3 (when expert available):** remaining 5 files (data-persistence, asset-pipeline, platform-adaptation, testing-strategy, cross-section)

3. **This gives Approach C's speed with Approach A's end state.** The template can be progressively thinned as each reference file is created.

4. **Domain expert dependency is managed.** Phase 1 files (scoring, gotchas, performance) can be created from existing template content + publicly available benchmark data. Phase 2 files need more expertise. Phase 3 can wait.
