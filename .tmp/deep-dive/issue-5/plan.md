# Phase 3: Plan — Issue #5 (asset-review skill gap)

## Recommended approach: A (Full build-out with references/)

## Target outcome

Upgrade asset-review from Skeleton (7/30) to Usable-to-Production (22-24/30).

## File plan

```
skills/asset-review/
  SKILL.md.tmpl              (rewrite, ~250L orchestration)
  references/
    gotchas.md               (new, ~70L)
    scoring.md               (new, ~90L)
    benchmarks.md            (new, ~120L — texture, mesh, audio, build size)
    naming-conventions.md    (new, ~50L)
    pipeline-checks.md       (new, ~50L)
```

Total new content: ~380L in references/ + ~250L rewrite of SKILL.md.tmpl.

Note: compared to the innovate phase, `texture-budgets.md`, `mesh-budgets.md`, and `audio-specs.md` are consolidated into a single `benchmarks.md` since audio specs are small and the data is most useful when platform budgets are in one place.

---

## Deliverables (ordered by commit)

### Commit 1: Create references/ files

**references/gotchas.md** (~70L)
- 5-6 Claude-specific failure modes for asset review:
  1. Judges art quality instead of pipeline health
  2. Fixates on resolution numbers instead of memory footprint (a 4096x4096 PNG is 64MB; the same as DXT5 is 16MB — format matters more than resolution)
  3. Treats all inconsistency as a bug (intentional style variation exists — e.g., boss characters deliberately larger/more detailed)
  4. Ignores platform context (4K textures fine on PC, catastrophic on mobile)
  5. Skips audio assets entirely (focuses on visual/mesh)
  6. Confuses asset-review scope with game-visual-qa scope (pipeline vs rendered output)
- Anti-sycophancy forbidden phrases + calibrated alternatives
- 3-4 forcing questions (drafted in innovate phase)

**references/scoring.md** (~90L)
- 7-dimension rubric (0-2 each, /14 total):
  1. Naming & Organization
  2. Format Compliance
  3. Budget Compliance
  4. Style Consistency Detection (deviations counted, not quality judged)
  5. Pipeline Automation
  6. Redundancy (duplicates, unused)
  7. Documentation (specs documented?)
- Verdict thresholds: CLEAN / ACCEPTABLE / NEEDS_WORK / AT_RISK / BLOCKED
- Per-dimension scoring criteria (like feel-pass/references/scoring.md)

**references/benchmarks.md** (~120L)
- Platform texture memory budgets:

  | Platform | Total Texture Budget | Max Single Texture | Recommended Format |
  |----------|---------------------|--------------------|--------------------|
  | Mobile (low) | 64-128MB | 1024x1024 | ASTC/ETC2 |
  | Mobile (high) | 128-256MB | 2048x2048 | ASTC |
  | PC (min) | 512MB-1GB | 2048x2048 | BC7/DXT5 |
  | PC (rec) | 1-2GB | 4096x4096 | BC7 |
  | Console | 1-2GB | 4096x4096 | BC7 |
  | Web/WebGL | 32-64MB | 1024x1024 | Basis/KTX2 |

- Mesh poly budgets (per-object and per-scene):

  | Platform | Hero Character | Environment Prop | Scene Total |
  |----------|---------------|-----------------|-------------|
  | Mobile (low) | 3-5K tris | 500-2K tris | 50-100K |
  | Mobile (high) | 10-20K tris | 2-5K tris | 200-500K |
  | PC | 30-100K tris | 5-20K tris | 1-5M |
  | Console | 50-200K tris | 10-50K tris | 2-10M |

- Audio format recommendations (format, sample rate, bitrate by use case)
- Build size targets by platform
- Draw call budget estimates

**references/naming-conventions.md** (~50L)
- 3 common conventions (snake_case prefix, PascalCase suffix, flat tag system)
- Detection heuristics: how to identify which convention a project uses
- Common violations to flag
- Note: the skill doesn't impose a convention — it checks if the project's own convention is followed consistently

**references/pipeline-checks.md** (~50L)
- Import settings consistency checks
- Atlas/sprite packing efficiency metrics
- Mipmap generation verification
- Unused asset detection approach
- Source file separation (PSD/Blend vs game-ready)
- Asset dependency mapping

### Commit 2: Rewrite SKILL.md.tmpl

**Major changes to the template:**

1. **Trigger description** — expand to include when-to-use, when-NOT-to-use, adjacent skills (game-visual-qa for rendered output, game-eng-review for architecture)

2. **Role identity** — "You are a technical artist doing asset pipeline QA. You care about bytes, triangles, naming consistency, and format compliance. You do NOT judge art quality — that requires human taste."

3. **Load references** — bash block to find and list all reference files, instruction to read all before interaction

4. **Artifact discovery** — search for prior asset reviews, GDD (for platform target), game-eng-review artifacts (for budget context)

5. **Phase 0: Asset Context** (enhanced from current Step 0)
   - Mode selection unchanged (Full/New/Category/Budget)
   - Add: establish platform target, art style reference, naming convention in use
   - STOP gate

6. **Phase 1: Naming & Organization** (from current Section 1)
   - Reference `naming-conventions.md` for detection heuristics
   - Score on rubric dimension 1
   - STOP gate

7. **Phase 2: Format & Specification** (from current Section 2)
   - Reference `benchmarks.md` for format recommendations
   - Split by asset type (textures/models/audio/UI) — evaluate only types present
   - Score on rubric dimension 2
   - STOP gate

8. **Phase 3: Performance Budget** (from current Section 3)
   - Reference `benchmarks.md` for platform budgets
   - Produce the budget table (already exists, keep it)
   - Flag top 5 largest assets
   - Score on rubric dimension 3
   - STOP gate

9. **Phase 4: Style Consistency Detection** (reframed from current Section 4)
   - Requires user-provided art style reference (art bible, reference sheet, or 3 representative assets)
   - Count deviations, don't judge quality
   - Each deviation: which asset, what dimension (color/scale/detail/lighting), how it deviates
   - Explicit confidence label: LOW on all style observations
   - Score on rubric dimension 4
   - STOP gate

10. **Phase 5: Pipeline Health** (from current Section 5)
    - Reference `pipeline-checks.md`
    - Score on rubric dimensions 5, 6, 7
    - STOP gate

11. **Phase 6: Forcing Questions** — apply from gotchas.md

12. **Phase 7: Score & Verdict** — aggregate from scoring.md

13. **AUTO/ASK/ESCALATE** — enhanced with specific thresholds:
    - AUTO: naming violations, missing mipmaps, wrong format, duplicate detection
    - ASK: style deviations (could be intentional), budget allocation priorities, format tradeoffs
    - ESCALATE: total memory >2x budget, no naming convention detectable, no art style reference available

14. **Completion summary, save artifact, review log** — keep existing structure, enhance with score

### Commit 3: Regenerate and test

```bash
bun run build
bun test
```

Verify all 11 tests pass. Commit both .tmpl and generated .md files.

---

## Scope boundaries

**In scope:**
- Quantifiable pipeline checks (formats, sizes, budgets, naming, automation)
- Style consistency DETECTION (flagging deviations from a reference)
- Platform-specific benchmark tables

**Out of scope (by ETHOS.md principle):**
- Art quality judgment ("is this art good?")
- Art direction recommendations ("you should use a warmer palette")
- Aesthetic coherence verdicts ("the art style works/doesn't work")

These stay explicitly marked as "needs human art director" in the skill.

---

## Estimated effort

- references/ files: ~2 hours (benchmark research + writing)
- SKILL.md.tmpl rewrite: ~1.5 hours
- Testing + iteration: ~30 min
- Total: ~4 hours

## Expected rubric score after

| Dimension | Before | After | Notes |
|-----------|--------|-------|-------|
| A1. Trigger | 1 | 2 | Full when/when-not/adjacent |
| A2. Role | 0 | 2 | Explicit TA role |
| A3. Mode Routing | 1 | 2 | AskUserQuestion with downstream impact |
| B4. Flow | 0 | 1 | Phases with STOP gates (no external tracking) |
| B5. STOP Gates | 0 | 2 | Every phase |
| B6. Recovery | 0 | 0 | Not planned (keep for future) |
| C7. Gotchas | 1 | 2 | Full gotchas.md |
| C8. Scoring | 0 | 2 | 7-dimension rubric |
| C9. Benchmarks | 0 | 2 | Structured platform tables |
| D10. Disclosure | 0 | 2 | 5 reference files |
| D11. Helper Code | 1 | 1 | Inline bash (no scripts/) |
| D12. Config | 1 | 1 | Review log only |
| E13. Discovery | 0 | 2 | Reads GDD + prior reviews + eng artifacts |
| E14. Output | 1 | 2 | Score + artifact + review log |
| E15. Position | 1 | 2 | Upstream + downstream + recommends next |
| **Total** | **7** | **24** | **Skeleton -> Production** |
