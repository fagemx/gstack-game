# Phase 3: Plan — game-eng-review Reference Files

## Selected Approach

**Approach A (one file per dimension) with phased delivery.** Three delivery phases, starting with the 3 most critical files.

---

## Phase 1: Immediate (unblocks the biggest gaps)

### File 1: `skills/game-eng-review/references/scoring.md`

**Source:** Extract from SKILL.md.tmpl lines 137-506 (all 8 section rubrics + weighted total).

**Content outline:**
1. **Mode Weight Adjustments** — new table (does not exist in template yet)
   - Columns: Single-player PC, Mobile F2P, Multiplayer Action, Multiplayer Casual, Prototype
   - Rows: All 8 sections with adjusted weights per mode
   - Rationale footnotes for each weight shift
2. **Section 1-8 Scoring Rubrics** — extracted from template, one subsection each
   - Each keeps its criteria table (already well-defined)
   - Add "scoring notes" under each: edge cases, when to give 0 vs 1
3. **Weighted Total Formula** — extracted from template lines 479-507
4. **Score Interpretation Table** — extracted from template lines 497-501

**What changes in the template:** Rubric tables in each section are replaced with `> Scoring: see references/scoring.md, Section N` one-liner. Saves ~120 lines.

### File 2: `skills/game-eng-review/references/gotchas.md`

**Source:** New file. Modeled after game-review/references/gotchas.md and balance-review/references/gotchas.md.

**Content outline:**
1. **Claude-Specific Gotchas for Architecture Review** (7-10 items)
   - "Accepts architecture diagrams at face value" — Claude sees a clean diagram and says "well-structured" without checking if the described connections actually exist in code
   - "Conflates engine popularity with fitness" — Claude defaults to "Unity is a good choice" because it's common, not because it fits THIS game's requirements
   - "Treats 'we'll optimize later' as a valid plan" — Claude accepts deferred optimization when architecture decisions are the optimization
   - "Skips the multiplication" — Claude reviews each system's memory budget in isolation but doesn't total them to check if they exceed device RAM
   - "Defaults to desktop assumptions" — Claude's training data is desktop-heavy; mobile constraints (thermal throttling, battery, 2GB RAM devices) are systematically underweighted
   - "Trusts stated performance targets" — If the doc says "targeting 60fps" Claude takes it as achieved; push for profiling evidence
   - "Ignores build pipeline as architecture" — CI/CD and asset pipeline ARE architecture, not devops afterthoughts
2. **Anti-Sycophancy Protocol** — extracted from template lines 51-70
   - Forbidden phrases (already exist)
   - Calibrated acknowledgment examples
   - Push-back cadence
3. **Forcing Question Routing** — table mapping game type/stage to which forcing questions to prioritize

**What changes in the template:** Anti-sycophancy section (lines 51-70) replaced with `> See references/gotchas.md` reference. Saves ~20 lines.

### File 3: `skills/game-eng-review/references/performance-budgets.md`

**Source:** New file. Requires domain research (publicly available benchmark data).

**Content outline:**
1. **Frame Budget by Platform**
   ```
   | Platform | Target FPS | Frame Budget | Typical Allocation |
   |----------|-----------|-------------|-------------------|
   | PC (high-end) | 60-144 | 6.9-16.67ms | Rendering 40%, Logic 25%, Physics 15%, Audio 10%, UI 10% |
   | PC (min spec) | 30-60 | 16.67-33.33ms | Same ratios, tighter margins |
   | PS5/Xbox Series X | 60 | 16.67ms | Rendering 45%, Logic 20%, Physics 15%, Audio 10%, UI 10% |
   | PS4/Xbox One | 30 | 33.33ms | Rendering 50%, Logic 20%, Physics 15%, Audio 10%, UI 5% |
   | Nintendo Switch (docked) | 30 | 33.33ms | Rendering 50%, Logic 15%, Physics 15%, Audio 10%, UI 10% |
   | Nintendo Switch (handheld) | 30 | 33.33ms | Same but thermal throttle reduces GPU by ~20% |
   | Mobile (high-end) | 60 | 16.67ms | Rendering 40%, Logic 20%, Physics 15%, Audio 10%, UI 15% |
   | Mobile (mid-range) | 30 | 33.33ms | Thermal throttle: sustained perf is 60-70% of peak |
   | Mobile (low-end) | 30 | 33.33ms | 2GB RAM ceiling, single-core bottleneck common |
   | WebGL | 30-60 | Variable | JS overhead +3-5ms, no threading |
   ```
2. **Draw Call Budgets**
   - Mobile: 100-300 draw calls (low-end: <100)
   - PC: 2000-5000 (with instancing)
   - Console: 3000-8000
   - Batching/instancing strategies and when each applies
3. **Memory Budgets by Platform**
   - Total available vs game budget (OS overhead, background apps)
   - Texture memory allocation guidelines (typically 40-60% of total)
   - Audio memory (typically 5-15%)
   - Runtime objects / heap
4. **Texture Size Standards**
   ```
   | Asset Type | Mobile | PC/Console | Notes |
   |-----------|--------|-----------|-------|
   | Character (hero) | 512-1024 | 2048-4096 | Main character can be larger |
   | Character (NPC) | 256-512 | 1024-2048 | |
   | Environment tile | 256-512 | 512-2048 | |
   | UI element | 128-256 | 256-512 | |
   | Skybox | 1024 | 2048-4096 | |
   | Effect/particle | 64-128 | 128-512 | |
   ```
5. **Build Size Limits by Store**
   - iOS: 200MB OTA limit (4GB total, but >200MB requires WiFi)
   - Google Play: 150MB base APK (+ Play Asset Delivery for expansion)
   - Nintendo eShop: 32GB max (microSD consideration)
   - Steam: No hard limit but >20GB affects install conversion
   - itch.io: 1GB default, can request increase
   - WebGL: <50MB ideal, >100MB causes abandonment

**What changes in the template:** Frame budget model in Section 2 (lines 190-203) can reference this file. Red flag specifics can be thinned. Saves ~30 lines.

### Template Modifications (Phase 1)

After creating the 3 reference files, modify `SKILL.md.tmpl`:
1. Replace inline rubric tables with references to `scoring.md`
2. Replace anti-sycophancy section with reference to `gotchas.md`
3. Replace frame budget model with reference to `performance-budgets.md`
4. Keep all section structure, forcing questions, and action classification in the template (these are orchestration, not reference data)

**Expected template reduction:** ~589L to ~420-450L.

---

## Phase 2: Next Sprint (needs domain research)

### File 4: `skills/game-eng-review/references/networking-patterns.md`

**Content outline:**
1. Tick rate benchmarks by game type (60Hz for FPS, 20-30Hz for RPG, 10Hz for strategy, 1-4Hz for turn-based)
2. Bandwidth budget table (mobile: 50-100 KB/s, desktop: 200-500 KB/s)
3. Prediction model comparison (client-side prediction, rollback/GGPO, lockstep, dead reckoning)
4. Cheat prevention architecture patterns
5. Reconnection/desync recovery strategies

### File 5: `skills/game-eng-review/references/engine-framework.md`

**Content outline:**
1. Engine fitness matrix (genre x engine x platform)
2. Unity-specific gotchas (GC in Update, string allocations, Coroutine overhead, DOTS migration pitfalls)
3. Godot-specific gotchas (GDScript vs C# perf, 3D renderer maturity, mobile export quality)
4. Unreal-specific gotchas (Blueprint vs C++ boundary, Nanite/Lumen hardware requirements, binary size)
5. Custom engine red flags and valid use cases

---

## Phase 3: When Expert Available

### Files 6-10 (lower urgency)

| File | Content | Can Wait Because |
|------|---------|-----------------|
| `data-persistence.md` | Save format patterns, schema migration strategies, cloud sync approaches | Template already covers this well qualitatively |
| `asset-pipeline.md` | Expanded store limits, loading strategy comparison, asset import automation | Partially covered by performance-budgets.md |
| `platform-adaptation.md` | Cert requirements (TRC/XR/App Store), input method matrices | Highly platform-specific, changes frequently |
| `testing-strategy.md` | CI/CD patterns for games, profiling tool landscape, test framework comparison | Template covers the review criteria; benchmarks less critical |
| `cross-section.md` | Cross-validation patterns, common contradiction examples | Template's cross-validation matrix is already good |

---

## Verification Plan

After each phase:

1. **Run `bun run build`** to regenerate SKILL.md from modified template
2. **Run `bun test`** to verify all 11 tests pass (frontmatter, preamble injection, drift detection)
3. **Manual check:** Read the generated SKILL.md and verify reference file links work in context
4. **Rubric check:** Re-score against skill-review rubric dimensions C7, C8, C9, D10

### Expected Rubric Improvement

| Dimension | Before | After Phase 1 | After Phase 2 | After All |
|-----------|--------|---------------|---------------|-----------|
| C7. Gotchas | 1 | 2 | 2 | 2 |
| C8. Scoring | 2 | 2 | 2 | 2 |
| C9. Domain Benchmarks | 0 | 1 | 2 | 2 |
| D10. Progressive Disclosure | 0 | 1 | 1 | 2 |

---

## Commit Plan

Phase 1 delivery as 2 commits:

1. **Commit 1:** Create `references/` directory with scoring.md, gotchas.md, performance-budgets.md (additive — no template changes yet)
2. **Commit 2:** Modify SKILL.md.tmpl to reference the new files + `bun run build` to regenerate SKILL.md

This keeps commits bisectable: Commit 1 is pure addition, Commit 2 is the template migration.

---

## Open Questions

1. **Weight rationale for mode adjustments:** The current weights (15/20/15/10/10/10/10/10) seem reasonable but have no documented justification. Should we keep them as-is and add rationale, or re-calibrate?
2. **Engine-specific content depth:** How deep should engine-gotchas go? Surface-level (5-7 gotchas per engine) or comprehensive (20+ per engine)? Recommendation: start surface-level, expand based on usage.
3. **Networking section skipability:** Template already handles "skip for single-player." Should networking-patterns.md still be created, or deprioritized since many indie games are single-player?
