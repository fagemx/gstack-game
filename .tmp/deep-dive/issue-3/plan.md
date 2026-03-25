# Phase 3: Implementation Plan — Issue #3 (playtest skill gap)

**Selected approach:** C (Hybrid — light template expansion + deep references)

---

## Deliverables

### 1. `skills/playtest/references/gotchas.md` (~40 lines)

**Purpose:** Anti-sycophancy + Claude-specific pitfalls for playtest protocol design.

**Content:**

- **Forbidden phrases** (expand from current 2 to 8-10):
  - "This playtest plan is comprehensive"
  - "Testers will enjoy the session"
  - "This covers all the bases"
  - "The sample size should be sufficient"
  - "Players will give honest feedback"
  - "This protocol will reveal the key issues"
  - "The questions are well-designed"
  - "The observation metrics are thorough"

- **Calibrated acknowledgment examples** (what to say instead):
  - "Protocol covers core loop testing with 3 quantitative metrics. Missing: no metric for session-to-session retention, no question about monetization perception. N=5 is directional — insufficient for balance conclusions."
  - "Interview questions avoid leading phrasing. Gap: no follow-up laddering for Q3 and Q5 — single-answer responses won't surface root causes."

- **Claude-specific gotchas for playtest design** (5-6 items):
  1. Don't assume testers will follow the protocol as written — build in observer prompts for when testers go off-script
  2. Don't conflate "interesting to analyze" with "actionable" — every metric must map to a design decision
  3. Don't recommend sample sizes without qualifying the confidence level — N=8 tells you something, but not the same thing as N=30
  4. Don't design interview questions that require game literacy — testers may not have vocabulary for "core loop" or "progression"
  5. Don't skip consent/NDA considerations — playtest data can leak unreleased game info
  6. Don't recommend video recording without addressing privacy, storage, and analysis time cost

---

### 2. `skills/playtest/references/metrics-and-benchmarks.md` (~120 lines)

**Purpose:** Observation metrics with thresholds + interview question bank + sample size guidance.

**Content sections:**

#### A. Observation Metrics with Thresholds (~40L)

Expand current quantitative metrics with benchmark ranges:

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Time to first meaningful action | <15s | 15-30s | >30s |
| Time to first "aha moment" | <90s | 90-180s | >180s or absent |
| Failures before quitting (casual) | 1-2 tolerated | 3 = risk | 4+ = churn |
| Failures before quitting (hardcore) | 5+ tolerated | N/A | rage-quit pattern |
| Feature discovery rate (10min) | >60% | 40-60% | <40% |
| Session length vs intended | within 20% | 20-50% deviation | >50% deviation |
| Help requests per 10min | 0-1 | 2-3 | 4+ |

Expand qualitative metrics with severity coding:
- **Confusion events:** pause >3s + look away = mild; verbal "what?" = moderate; put down controller = severe
- **Frustration markers:** sigh = mild; repeated same action >3x = moderate; profanity or rage-quit = severe
- **Delight markers:** smile = mild; verbal positive = moderate; show someone else = strong

#### B. Interview Question Bank by Game Type (~50L)

**Universal questions** (all game types, post-session):
1. "What was happening in the game?" (comprehension)
2. "What were you trying to do?" (goal clarity)
3. "Was there a moment you wanted to stop? What was happening?" (churn point)
4. "What would you do differently next time?" (learning)
5. "Would you play again tomorrow? What would you hope is different?" (retention signal)

**F2P / monetization overlay:**
6. "Did you notice anything you could buy? What did you think of it?" (monetization awareness)
7. "Was there a moment you felt stuck? What would have helped?" (paywall perception)

**Narrative overlay:**
6. "What do you think happens next in the story?" (narrative engagement)
7. "Did you care about any character? Which one and why?" (emotional investment)

**Competitive/PvP overlay:**
6. "Did anything feel unfair?" (balance perception)
7. "What would you do to beat someone using the strategy you used?" (meta awareness)

**Laddering technique:** For any answer, follow up with "Tell me more about that moment" and then "Why did that matter to you?" — 3 levels deep surfaces root cause.

**Forbidden interview patterns:**
- Leading questions ("Did you like X?" instead of "Tell me about X")
- Compound questions ("Did you like the combat and the progression?")
- Design defense ("Well, that's because we wanted to...")
- Future-state questions ("Would you pay $5 for this?") — unreliable; observe behavior instead

#### C. Sample Size Guidance (~30L)

| Test Type | Minimum N | Recommended N | What You Learn |
|-----------|-----------|---------------|----------------|
| Usability issues (FTUE) | 5 | 8-10 | 85% of usability problems found at N=5 (Nielsen) |
| Balance/economy | 15 | 20-30 | Need enough to see strategy diversity |
| A/B comparison | 20 per variant | 50+ per variant | Statistical significance at p<0.05 |
| Retention signal | 30 | 50-100 | Meaningful D1/D7 signal |
| Content pacing | 8-10 | 15 | Enough for pacing consensus |

**When qualitative is sufficient:**
- Finding usability problems (N=5-8, observation is enough)
- Identifying confusion points (N=3-5 if consistent)
- First impressions (N=5-8)

**When quantitative is required:**
- Comparing two versions (A/B)
- Measuring retention or session length differences
- Economy balance validation

**Practical significance vs statistical significance:**
- If 4 out of 5 testers quit at the same point, that's practically significant even without a p-value
- If your A/B test shows p=0.03 but the effect is +2 seconds of session time, that's statistically significant but practically meaningless
- Rule of thumb: for indie/small team, prioritize consistent qualitative patterns over statistical rigor

---

### 3. `skills/playtest/references/analysis-framework.md` (~70 lines)

**Purpose:** How to turn raw data into actionable findings.

**Content sections:**

#### A. Triangulation Method (~20L)

For each finding, require evidence from at least 2 of 3 sources:
1. **Observation data** — what the observer saw the tester do
2. **Metric data** — quantitative measurement (time, count, rate)
3. **Interview data** — what the tester said about it

Single-source findings are hypotheses. Dual-source findings are patterns. Triple-source findings are high-confidence.

#### B. Pattern Recognition Guide (~20L)

- **Systemic issue** = appears in 60%+ of testers at the same point → design problem
- **Individual variance** = appears in 1-2 testers only → persona-specific or noise
- **Progressive issue** = gets worse over repeated sessions → fatigue or balance problem
- **Threshold issue** = appears only after X minutes/failures → design cliff

Red flags in analysis:
- Confirmation bias: looking for data that supports your hypothesis while ignoring contradictions
- Recency bias: weighting the last tester more heavily than earlier ones
- Designer bias: explaining away problems because you know the design intent

#### C. Finding Prioritization Matrix (~15L)

| Severity | Frequency | Action |
|----------|-----------|--------|
| Critical (churn) | 60%+ testers | Fix before next playtest |
| Critical (churn) | 20-60% testers | Investigate root cause, likely fix |
| High (friction) | 60%+ testers | Fix in next sprint |
| High (friction) | 20-60% testers | Schedule fix, monitor |
| Medium (polish) | Any | Backlog, address in polish pass |
| Low (preference) | Any | Note for future reference |

#### D. Findings Report Template (~15L)

```
PLAYTEST FINDINGS — [Date] — [Build Version]
Testers: N=[count], Profile: [description]
Hypothesis: [what we set out to test]
Verdict: [CONFIRMED / REFUTED / INCONCLUSIVE]

CRITICAL FINDINGS (fix before next test):
  1. [finding] — Evidence: [observation + metric + interview]
  2. ...

HIGH FINDINGS (fix in next sprint):
  1. [finding] — Evidence: [sources]
  2. ...

PATTERNS:
  - [pattern description] — seen in N/N testers
  - ...

SURPRISES (things we didn't expect):
  - [surprise] — implication: [what this means for design]

NEXT PLAYTEST SHOULD TEST:
  - [specific hypothesis based on findings]
```

---

### 4. Template Modifications (`skills/playtest/SKILL.md.tmpl`)

Changes to the existing template (net result: ~220 lines):

#### Add at top (after PREAMBLE):

- **Load References block** — bash block loading all files from `references/`
- **Role identity:** "You are a UX research methodologist. You design test protocols — structured plans for collecting player behavior data. You do NOT run the test or simulate player behavior (that's /player-experience)."

#### Modify Step 0:

- Add mode routing: **Quick Protocol** (internal, <5 testers, paper/greybox) vs **Full Protocol** (external, 5+ testers, alpha+)
- Add STOP gate after Step 0

#### Modify Section 1 (Test Plan):

- Reference `metrics-and-benchmarks.md` for sample size selection
- Add STOP gate

#### Modify Section 2 (Observation Metrics):

- Replace inline metrics with reference to `metrics-and-benchmarks.md` thresholds
- Keep event log template inline (it's a quick-reference tool)
- Add STOP gate

#### Modify Section 3 (Post-Test Questions):

- Replace inline questions with reference to `metrics-and-benchmarks.md` question bank
- Keep interviewing rules inline
- Add STOP gate

#### Modify Section 4 (Data Analysis):

- Replace inline template with reference to `analysis-framework.md`
- Add scoring formula inline: Protocol Completeness Score
- Add STOP gate

#### Modify Section 5 (Recruitment):

- Expand inline with: compensation guidance (gift card/game key/hourly rate ranges), NDA/consent checklist, demographic balancing note
- Keep inline — it's contextual to Step 0 decisions
- Add STOP gate

#### Add new sections:

- **Artifact Discovery** — search for prior playtest reports, game review artifacts, player-experience walkthroughs
- **Regression Delta** — if prior playtest report exists, compare findings

#### Add scoring formula (~15L inline):

```
Protocol Completeness Score:
  Hypothesis defined:        /2  (0=missing, 1=vague, 2=testable)
  Metrics mapped to hypothesis: /2  (0=generic, 1=partial, 2=each metric → hypothesis)
  Sample size justified:     /2  (0=missing, 1=number given, 2=justified per benchmarks)
  Questions avoid leading:   /2  (0=leading questions, 1=mixed, 2=all open-ended)
  Analysis plan specified:   /2  (0=missing, 1=template, 2=triangulation + prioritization)
  Total:                     /10
```

---

## File Summary

| File | Action | Est. Lines |
|------|--------|-----------|
| `skills/playtest/references/gotchas.md` | Create | ~40 |
| `skills/playtest/references/metrics-and-benchmarks.md` | Create | ~120 |
| `skills/playtest/references/analysis-framework.md` | Create | ~70 |
| `skills/playtest/SKILL.md.tmpl` | Modify | ~220 (from 177) |
| `skills/playtest/SKILL.md` | Regenerate | (auto via `bun run build`) |

**Total new content:** ~230 lines in references/, ~43 lines net addition to template.

---

## Expected Rubric Improvement

| Dimension | Before | After | Change |
|-----------|--------|-------|--------|
| A1. Trigger Description | 1 | 2 | +1 (add when-NOT-to-use, adjacent skills) |
| A2. Role Identity | 0 | 2 | +2 (explicit methodologist role) |
| A3. Mode Routing | 1 | 2 | +1 (Quick vs Full protocol) |
| B4. Flow Externalization | 1 | 1 | 0 (sections exist, no TodoWrite) |
| B5. STOP Gates | 0 | 2 | +2 (every section gets STOP) |
| B6. Recovery / Interrupt | 0 | 1 | +1 (add escape hatch) |
| C7. Gotchas | 1 | 2 | +1 (full gotchas.md) |
| C8. Scoring | 0 | 2 | +2 (Protocol Completeness Score) |
| C9. Domain Benchmarks | 0 | 2 | +2 (metrics-and-benchmarks.md) |
| D10. Progressive Disclosure | 0 | 2 | +2 (template <300L + references/) |
| D11. Helper Code | 1 | 1 | 0 |
| D12. Config / Memory | 1 | 1 | 0 |
| E13. Artifact Discovery | 0 | 2 | +2 (search for upstream artifacts) |
| E14. Output Contract | 1 | 2 | +1 (structured artifact + review log) |
| E15. Workflow Position | 1 | 2 | +1 (reads upstream + writes downstream) |
| **Total** | **8/30** | **24/30** | **+16** |

**Quality tier:** Skeleton (40%) to Production (80%)

---

## Verification Steps

1. `bun run build` — regenerate SKILL.md from modified template
2. `bun test` — all 11 tests pass (frontmatter, preamble injection, placeholder expansion, drift detection)
3. Manual check: template is <300 lines
4. Manual check: all 3 reference files exist and are referenced in Load References block
5. Manual check: every section has a STOP gate
6. Manual check: scoring formula is explicit (no AI intuition)
7. Run `bun run gen:skill-docs:check` — no drift

---

## Commit Plan

Following bisect-commit style:

1. **Commit 1:** Create `skills/playtest/references/` with 3 reference files
2. **Commit 2:** Modify `skills/playtest/SKILL.md.tmpl` with template improvements
3. **Commit 3:** Regenerate `skills/playtest/SKILL.md` via `bun run build`

(Commits 2 and 3 can be combined if the template change + regeneration is one logical unit.)
