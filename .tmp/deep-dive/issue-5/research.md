# Phase 1: Research — Issue #5 (asset-review skill gap)

## Current State

**File:** `skills/asset-review/SKILL.md.tmpl` (128 lines, 35% quality tier = Skeleton)
**References directory:** Does not exist
**Rubric score estimate:** ~8/30 (Skeleton tier)

### What exists today

The template has correct structure:
- YAML frontmatter with name + description
- `{{PREAMBLE}}` placeholder
- Step 0 mode selection (Full audit / New assets / Specific category / Performance budget)
- 5 weighted sections: Naming (10%), Format & Spec (20%), Performance Budget (30%), Style Consistency (25%), Pipeline Health (15%)
- AUTO/ASK/ESCALATE classification
- Anti-sycophancy forbidden phrases
- Completion summary, save artifact, review log

### What's missing (rubric dimension by dimension)

| Dimension | Current Score | Gap |
|-----------|--------------|-----|
| A1. Trigger Description | 1 | Missing when-NOT-to-use, adjacent skill routing |
| A2. Role Identity | 0 | No explicit role sentence |
| A3. Mode Routing | 1 | Has AskUserQuestion but modes don't change behavior downstream |
| B4. Flow Externalization | 0 | No phase tracking |
| B5. STOP Gates | 0 | No STOP gates anywhere |
| B6. Recovery | 0 | Absent |
| C7. Gotchas | 1 | Has forbidden phrases, no Claude-specific gotchas or forcing questions |
| C8. Scoring | 0 | No scoring formula — sections have weights but no rubric |
| C9. Domain Benchmarks | 0 | Poly counts mentioned inline but no structured benchmark tables |
| D10. Progressive Disclosure | 0 | Everything in one file, no references/ |
| D11. Helper Code | 1 | Has inline bash blocks |
| D12. Config/Memory | 1 | Has review log |
| E13. Artifact Discovery | 0 | No upstream artifact search |
| E14. Output Contract | 1 | Has completion summary + save artifact |
| E15. Workflow Position | 1 | Lists downstream discoverers but no upstream reading |

**Estimated rubric total: 7/30** (Skeleton)

### Key content gaps

1. **No art consistency framework.** Section 4 lists 5 bullet points but no evaluation method. "Color palette adherence?" is a yes/no question with no criteria for what adherence means.

2. **No benchmark data.** Poly count ranges are mentioned once (mobile: 1-10K, PC: 10-100K) but there are no texture memory budgets, no draw call budgets, no atlas efficiency targets, no platform-specific tables.

3. **No scoring rubric.** Sections have percentage weights but no per-dimension 0-2 scoring. No aggregate score. No verdict thresholds.

4. **No forcing questions.** The anti-sycophancy section forbids vague praise but doesn't force specific diagnostic questions the way feel-pass does.

5. **No gotchas file.** No documentation of what Claude specifically gets wrong when evaluating assets (e.g., fixating on resolution instead of memory footprint, confusing artistic choice with inconsistency).

### Pattern reference: feel-pass (Production quality, ~280L)

feel-pass demonstrates the target pattern:
- **SKILL.md.tmpl** (~280L) is orchestration only — references phases, cites reference files
- **references/** contains 4 files: gotchas.md, feedback-chains.md, scoring.md, feel-vocabulary.md
- Each reference file is self-contained domain knowledge
- Explicit role identity: "You are a game feel doctor"
- 7 phases with STOP gates after each
- 7-dimension scoring rubric with 0/1/2 per dimension and verdict thresholds
- Forcing questions that require specific measurable answers
- Artifact discovery reads upstream handoffs
- Claude-specific gotchas (6 documented failure modes)

### Pattern reference: game-review (Production quality, ~255L)

game-review uses the same pattern:
- SKILL.md.tmpl (~255L) orchestrates, references/ has 8 files
- Rich trigger description with when-to-use and when-NOT-to-use
- Artifact discovery checks GDD, prior reviews, balance reports

### Overlap with game-visual-qa

game-visual-qa (129L, also Skeleton) has Section 2: Art Style Consistency that overlaps with asset-review Section 4. Key difference:
- **game-visual-qa** evaluates visual consistency in the rendered game (in-engine screenshots/video)
- **asset-review** evaluates raw assets in the pipeline (files, formats, specs)

This distinction needs to be made explicit to avoid confusion.

### ETHOS.md constraint

ETHOS.md explicitly states: "Art direction decisions — Not compressible." This means asset-review should NOT try to judge whether art direction is good. It should check whether art direction is CONSISTENTLY APPLIED and whether assets meet TECHNICAL SPECIFICATIONS. The style consistency section must be framed as "consistency detection" not "quality judgment."

### domain-judgment-gaps.md entry

The doc lists asset-review as needing: "art style consistency standards, performance budgets, asset specifications" from "art director / TA." It's in Wave 4 (lowest priority) which explains why it's still a skeleton.
