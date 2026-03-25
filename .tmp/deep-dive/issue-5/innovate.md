# Phase 2: Innovate — Issue #5 (asset-review skill gap)

## Core tension: what CAN be systematized?

ETHOS.md says art direction is "not compressible." But asset-review isn't about art direction — it's about the pipeline that delivers art. The distinction:

| Compressible (asset-review territory) | Not compressible (human territory) |
|---------------------------------------|-------------------------------------|
| Texture memory fits budget | Art style is appealing |
| Naming follows convention | Color palette evokes right mood |
| Poly count within platform target | Character proportions feel right |
| Mipmaps generated correctly | VFX style matches game tone |
| Atlas packing efficiency | Detail level is "enough" for the game |
| File format matches use case | Lighting feels cohesive |
| No duplicate assets | Animation style is consistent |

The compressible column is 100% quantifiable. The non-compressible column is where the current skeleton's Section 4 (Style Consistency) lives — and where the skill should explicitly defer to human judgment with structured observation prompts rather than verdicts.

---

## Approach A: Full build-out with references/

**Structure:**
```
skills/asset-review/
  SKILL.md.tmpl          (~250-280L, orchestration)
  references/
    gotchas.md           (~60L, Claude failure modes for asset review)
    scoring.md           (~80L, 7-dimension rubric with 0-2 per dimension)
    texture-budgets.md   (~80L, platform benchmark tables)
    mesh-budgets.md      (~60L, poly count + draw call benchmarks)
    audio-specs.md       (~40L, format/sample rate/LUFS targets)
    naming-conventions.md (~50L, common conventions + detection rules)
    pipeline-checks.md   (~50L, automation/import/dependency checks)
```

**Pros:**
- Matches feel-pass and game-review pattern (Production quality target)
- Benchmark tables are the highest-value addition — they make the skill actually useful
- Progressive disclosure keeps SKILL.md.tmpl readable
- Gotchas file prevents Claude's known failure modes (e.g., judging art quality instead of pipeline health)

**Cons:**
- 7 reference files is a lot for a P2 skill
- Some benchmark data (texture budgets per platform) changes with hardware generations
- Risk of over-engineering before real-world usage validates the structure

**Estimated rubric score after: 22-24/30** (Usable to Production)

---

## Approach B: Expand template only (keep under 300L, no references)

**Changes to SKILL.md.tmpl:**
- Add role identity: "You are a technical artist doing pipeline QA"
- Add STOP gates after each section
- Add inline benchmark tables (condensed)
- Add scoring rubric (inline)
- Add forcing questions (3-4)
- Add Claude-specific gotchas (inline)
- Strengthen mode routing (different sections for different modes)
- Add artifact discovery

**Pros:**
- Simpler — one file to maintain
- Faster to implement
- Good enough for initial validation

**Cons:**
- Inline benchmarks will push the file toward 280-300L limit
- No progressive disclosure — everything in one file
- Doesn't match the pattern of production skills (feel-pass, game-review)
- Rubric D10 stays at 0

**Estimated rubric score after: 16-18/30** (high Draft to low Usable)

---

## Approach C: Minimal — add only texture/mesh benchmarks

**Changes:**
- Add one `references/benchmarks.md` with platform budget tables
- Add scoring rubric inline
- Add 2-3 forcing questions

**Pros:**
- Fastest to implement
- Benchmarks are the single highest-value addition
- Addresses the most quantifiable gap first

**Cons:**
- Leaves gotchas, naming conventions, pipeline checks as gaps
- Incomplete upgrade — still mostly Skeleton quality
- Doesn't address the style consistency framework problem

**Estimated rubric score after: 12-14/30** (Draft)

---

## Recommendation: Approach A (Full build-out)

Rationale:
1. **The benchmark data IS the skill.** Without structured platform budgets, the skill is just a checklist anyone could write. The value is in calibrated thresholds.
2. **feel-pass proves the pattern works.** The references/ structure is validated. Asset-review should follow the same architecture.
3. **Gotchas are critical.** Claude's default behavior with assets is to judge aesthetics ("beautiful textures") rather than pipeline health ("32MB texture on a mobile target"). Without a gotchas file, the skill will produce exactly the wrong output.
4. **The style consistency section needs careful framing.** A dedicated section in the gotchas explaining "you detect inconsistency, you don't judge quality" prevents the ETHOS.md violation.

### Key design decisions for Approach A

**Style Consistency reframe:** Rename to "Style Consistency Detection" and frame as:
- Input: user provides art style reference (art bible, reference sheet, or 3 representative assets)
- Output: list of assets that deviate from the reference, with specific deviations (color palette, line weight, detail level, scale)
- Explicitly: "You flag deviations. The art director decides if they're intentional."
- Confidence label: LOW on all style judgments

**Benchmark data sources:**
- Mobile texture budgets: well-documented (Apple/Google guidelines, Unity/Unreal docs)
- PC texture budgets: wider range but standard tiers exist
- Poly counts: well-documented per platform tier
- Audio specs: LUFS standards exist, format recommendations are stable
- These are not opinions — they're engineering constraints

**Scoring model:** 7 dimensions mirroring the 5 sections + 2 cross-cutting concerns:
1. Naming & Organization (from Section 1)
2. Format Compliance (from Section 2)
3. Budget Compliance (from Section 3)
4. Style Consistency (from Section 4) — scored as "deviation count" not "quality"
5. Pipeline Automation (from Section 5)
6. Redundancy (cross-cutting: duplicate assets, unused assets)
7. Documentation (cross-cutting: are asset specs documented?)

Each 0-2, total /14, verdict thresholds similar to feel-pass.

**Forcing questions (draft):**
- Q1: "What is your total texture memory budget? If you don't know, you don't have one — and that's finding #1."
- Q2: "Show me your 5 largest assets by file size. Are any of them background elements that could be lower resolution?"
- Q3: "If a new artist joins tomorrow, where is the naming convention documented? If nowhere, every asset from now on is a consistency gamble."
