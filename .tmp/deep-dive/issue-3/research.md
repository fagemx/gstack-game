# Phase 1: Research — Issue #3 (playtest skill gap)

## Current State

**File:** `skills/playtest/SKILL.md.tmpl`
**Line count:** 177 lines
**Quality tier:** Skeleton (40%)
**References directory:** Does not exist

### Existing Sections

| Section | Lines | Content Quality |
|---------|-------|----------------|
| Step 0: Playtest Context | 4 questions | Adequate — asks what/stage/count/question |
| Section 1: Test Plan | ~15L | Has hypothesis template, session structure, control variables |
| Section 2: Observation Metrics | ~25L | Has quant/qual split and event log template |
| Section 3: Post-Test Questions | ~15L | 6 standard questions + interviewing rules |
| Section 4: Data Analysis Framework | ~20L | Finding summary template, basic confidence levels |
| Section 5: Tester Recruitment | ~20L | Stage-based recruitment, where to find, screening questions |
| AUTO/ASK/ESCALATE | ~5L | Present but thin |
| Anti-Sycophancy | ~5L | 2 forbidden phrases + 1 calibrated example |
| Completion Summary | ~10L | Template present |

### What's Missing (per issue #3 and domain-judgment-gaps.md)

1. **Recruitment depth** — Current Section 5 has 4 bullet points per stage. Missing: sample size calculations by game type, compensation guidance, NDA/consent considerations, demographic balancing, recruitment timeline estimates.

2. **Observation metrics rigor** — Current Section 2 lists metrics but provides no thresholds. Missing: what counts as "too long" for time-to-first-action? What's a healthy feature discovery rate? No benchmarks, no severity classification for observed behaviors.

3. **Interview question bank** — Current Section 3 has 6 generic questions. Missing: questions by game type (F2P monetization perception, narrative immersion, competitive fairness), follow-up laddering technique, question ordering strategy, what NOT to ask by stage.

4. **Statistical significance** — Section 4 has a 3-line confidence table (N<5/5-15/15+). Missing: when qualitative is sufficient vs when quantitative is needed, minimum sample sizes by test type, how to handle contradictory findings, effect size considerations, practical significance vs statistical significance for game testing.

5. **Data analysis framework** — Current template is a fill-in-the-blank form. Missing: pattern recognition guidance (how to identify systemic vs isolated issues), triangulation methods (cross-referencing observation + interview + metrics), prioritization framework for findings, how to present findings to stakeholders.

6. **No references/ directory** — All content is inline. At 177 lines the template is under the 300-line threshold, but adding the missing content would push it well over 300 lines.

7. **No scoring formula** — The rubric requires explicit quantitative scoring (C8). Currently absent.

8. **No domain benchmarks** — Rubric dimension C9 requires structured benchmark tables. Currently absent.

9. **No gotchas file** — Rubric dimension C7 requires Claude-specific operational gotchas. Currently absent.

10. **No Load References block** — Unlike player-experience, no mechanism to load reference files at runtime.

## Rubric Assessment (Current)

| Dimension | Score | Notes |
|-----------|-------|-------|
| A1. Trigger Description | 1 | Has description, missing when-NOT-to-use |
| A2. Role Identity | 0 | No explicit role statement |
| A3. Mode Routing | 1 | Step 0 asks questions but no locked mode |
| B4. Flow Externalization | 1 | Sections exist, no external tracking |
| B5. STOP Gates | 0 | No STOP gates between sections |
| B6. Recovery / Interrupt | 0 | Absent |
| C7. Gotchas | 1 | 2 forbidden phrases, no Claude-specific gotchas |
| C8. Scoring | 0 | No scoring formula |
| C9. Domain Benchmarks | 0 | No benchmark data |
| D10. Progressive Disclosure | 0 | Everything inline, no references/ |
| D11. Helper Code | 1 | Has review log bash block |
| D12. Config / Memory | 1 | Review log present |
| E13. Artifact Discovery | 0 | No upstream artifact search |
| E14. Output Contract | 1 | Completion summary + save artifact present |
| E15. Workflow Position | 1 | Lists downstream skills |
| **Total** | **8/30** | **Skeleton** |

## Patterns to Follow from player-experience

The `/player-experience` skill (273L template, 5 reference files) is the closest analog:

1. **Template as orchestrator** — Template is <300 lines, references/ holds domain knowledge
2. **Load References block** — Bash block at top loads all reference files before interaction
3. **Reference file pattern:**
   - `gotchas.md` — anti-sycophancy + Claude-specific pitfalls (35 lines)
   - `personas.md` — domain-specific type definitions (58 lines)
   - `scoring.md` — explicit formula + weights + simulation (63 lines)
   - `emotion-vocabulary.md` — fixed vocabulary + healthy/unhealthy patterns (31 lines)
   - `walkthrough-phases.md` — phase-by-phase execution content (177 lines)
4. **STOP gates after every phase** with AskUserQuestion
5. **Artifact discovery** — searches for prior work at start
6. **Regression delta** — compares against prior runs

## Key Insight

The playtest skill has decent *structure* (sections cover the right topics) but lacks *substance* (no benchmarks, no thresholds, no Claude-specific guidance). The issue title captures it precisely: the skeleton is there, the domain knowledge is not. The fix is to add references/ files that inject domain expertise while keeping the template as a lightweight orchestrator.
