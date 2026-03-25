# Phase 2: Innovate — Issue #3 (playtest skill gap)

## Approach A: Full References Split

Add 4 reference files, keep template as orchestrator (~180 lines).

**New files:**
- `references/recruitment.md` (~80L) — sample sizes, compensation, screening, consent, timeline
- `references/observation-metrics.md` (~90L) — metric definitions, thresholds, severity classification, event coding guide
- `references/interview-questions.md` (~100L) — question bank by game type, laddering technique, question ordering, forbidden questions
- `references/analysis.md` (~80L) — statistical significance guide, triangulation methods, pattern recognition, finding prioritization, reporting format

**Template changes:**
- Add Load References block (like player-experience)
- Add role identity statement
- Add STOP gates after each section
- Add artifact discovery block
- Add scoring formula (inline, ~15 lines)
- Trim existing inline content that moves to references/
- Add mode routing in Step 0

**Estimated result:** Template ~200L, references/ ~350L total. Rubric score ~20-22/30 (Usable).

**Pros:**
- Follows the proven player-experience pattern exactly
- Each reference file is independently maintainable
- Domain experts can review/edit one file without touching the template
- Clear progressive disclosure — Claude loads what it needs
- Under 300L template threshold

**Cons:**
- 4 new files is significant surface area to maintain
- Some content (e.g., screening questions) may be too thin for a standalone file
- Risk of reference files going stale independently of each other

---

## Approach B: Expand Template Inline

Keep everything in the template, expand to ~400-450 lines with full domain content.

**Template changes:**
- Expand each existing section with benchmarks, thresholds, examples
- Add interview question bank inline
- Add statistical significance guide inline
- Add recruitment depth inline
- Add scoring formula, STOP gates, role identity, artifact discovery

**Estimated result:** Template ~420L, no references/. Rubric score ~16-18/30 (Draft/Usable border).

**Pros:**
- Single file — simple to maintain, easy to review
- No file loading mechanism needed
- Everything visible in one read

**Cons:**
- Violates 300-line rule (D10 scores 0)
- Claude's attention degrades in long prompts — domain benchmarks buried at line 350 may be deprioritized
- Harder for domain experts to review (must navigate one large file)
- No progressive disclosure — all content loaded whether needed or not
- Sets a bad precedent for other skeleton skills that need similar upgrades

---

## Approach C: Hybrid — Light Template Expansion + Deep References

Moderately expand template (~220L) with key content inline. Move deep domain knowledge to 3 reference files.

**New files:**
- `references/gotchas.md` (~40L) — Claude-specific pitfalls for playtest facilitation + anti-sycophancy expansion
- `references/metrics-and-benchmarks.md` (~120L) — observation metrics with thresholds, interview question bank by game type, sample size guidance, statistical significance
- `references/analysis-framework.md` (~70L) — triangulation methods, pattern recognition, finding prioritization, reporting templates

**Template changes:**
- Add Load References block
- Add role identity: "You are a UX research methodologist — design the test protocol, do not run it"
- Add STOP gates after each section
- Add artifact discovery block
- Add scoring formula inline (~15L)
- Keep recruitment, session structure, and basic observation metrics inline (they're short enough)
- Add mode routing: Quick Protocol (internal, <5 testers) vs Full Protocol (external, 5+ testers)
- Expand AUTO/ASK/ESCALATE with concrete boundaries

**Estimated result:** Template ~220L, references/ ~230L total. Rubric score ~21-24/30 (Usable to Production).

**Pros:**
- Template stays well under 300L
- 3 files instead of 4 — less surface area than Approach A
- `gotchas.md` follows the exact pattern from player-experience (highest-value reference file per rubric)
- Metrics + interview questions in one file allows cross-referencing (observation metrics inform which interview questions to ask)
- Recruitment stays inline because it's contextual to Step 0 (where the user is already providing test parameters)
- Domain expert can focus on `metrics-and-benchmarks.md` — that's where 80% of the domain knowledge lives

**Cons:**
- The combined metrics-and-benchmarks file at ~120L is larger than typical reference files
- Slightly less clean separation than Approach A
- Recruitment depth stays shallow unless template grows more

---

## Trade-off Analysis

| Criterion | A: Full Split | B: Inline | C: Hybrid |
|-----------|:---:|:---:|:---:|
| 300-line rule compliance | Yes | **No** | Yes |
| Rubric D10 (Progressive Disclosure) | 2 | 0 | 2 |
| Maintenance surface area | 5 files | 1 file | 4 files |
| Domain expert accessibility | High | Low | High |
| Pattern consistency (with player-experience) | Exact | None | Close |
| Total estimated rubric score | 20-22 | 16-18 | 21-24 |
| Risk of content going stale | Medium | Low | Low-Medium |

## Recommendation

**Approach C (Hybrid)** is the best fit. It follows the established pattern closely enough for consistency, keeps the template readable, and consolidates domain knowledge into files that map to the expertise needed (UX researcher reviews `metrics-and-benchmarks.md`, methodologist reviews `analysis-framework.md`). The combined metrics file is justified because observation metrics and interview questions are tightly coupled — what you observe determines what you ask.

The key differentiator over Approach A: recruitment stays inline because it's a Step 0 decision (tester count and profile), not a reference lookup. Moving it to a separate file would create a thin file (~80L) that's mostly lists, adding maintenance burden without improving Claude's execution.
