# Analysis Framework

## A. Triangulation Method

For each finding, require evidence from at least 2 of 3 sources:

1. **Observation data** — what the observer saw the tester do (behavior, body language, timing)
2. **Metric data** — quantitative measurement (time, count, rate, completion %)
3. **Interview data** — what the tester said about it (in their words, not paraphrased)

**Evidence strength:**
- Single-source = hypothesis (flag for investigation, do not act on)
- Dual-source = pattern (actionable, schedule fix)
- Triple-source = high-confidence finding (prioritize fix)

Example: "Tester paused 8 seconds at the upgrade screen (observation), feature discovery was 35% at 10 min (metric), and tester said 'I didn't know I could do that' (interview). Triple-source: upgrade system is not discoverable."

---

## B. Pattern Recognition Guide

**Classification by frequency:**
- **Systemic issue** = appears in 60%+ of testers at the same point. This is a design problem.
- **Segment issue** = appears in a specific tester profile (e.g., casual-only). Design for that segment or accept the trade-off.
- **Individual variance** = appears in 1-2 testers only. Likely noise or persona-specific. Note but do not prioritize.

**Classification by progression:**
- **Immediate issue** = appears in first session, first encounter. FTUE problem.
- **Progressive issue** = gets worse over repeated sessions. Fatigue or balance problem.
- **Threshold issue** = appears only after X minutes or X failures. Design cliff — invisible in short tests.

**Red flags in analysis:**
- Confirmation bias: looking for data that supports your hypothesis while ignoring contradictions
- Recency bias: weighting the last tester more heavily than earlier ones
- Designer bias: explaining away problems because you know the design intent
- Survivorship bias: analyzing only testers who finished, ignoring those who quit

---

## C. Finding Prioritization Matrix

| Severity | Frequency | Action |
|----------|-----------|--------|
| Critical (causes churn) | 60%+ testers | Fix before next playtest |
| Critical (causes churn) | 20-60% testers | Investigate root cause, likely fix |
| High (significant friction) | 60%+ testers | Fix in next sprint |
| High (significant friction) | 20-60% testers | Schedule fix, monitor in next test |
| Medium (minor friction) | Any | Backlog, address in polish pass |
| Low (preference/taste) | Any | Note for future reference, do not act |

**Severity definitions:**
- **Critical:** tester quits, expresses intent to not return, or cannot progress
- **High:** tester visibly frustrated, loses engagement, or misunderstands core mechanic
- **Medium:** tester confused briefly but recovers, or finds workaround
- **Low:** tester expresses preference ("I'd prefer blue") with no impact on behavior

---

## D. Findings Report Template

```
PLAYTEST FINDINGS — [Date] — [Build Version]
Testers: N=[count], Profile: [description]
Hypothesis: [what we set out to test]
Verdict: [CONFIRMED / REFUTED / INCONCLUSIVE — with evidence summary]

CRITICAL FINDINGS (fix before next test):
  1. [finding] — Evidence: [observation + metric + interview]
     Recommendation: [specific action]
  2. ...

HIGH FINDINGS (fix in next sprint):
  1. [finding] — Evidence: [sources]
     Recommendation: [specific action]
  2. ...

PATTERNS (observed across multiple testers):
  - [pattern description] — seen in N/N testers
  - ...

SURPRISES (things we did not expect):
  - [surprise] — implication: [what this means for design]

OPEN QUESTIONS (need more data):
  - [question] — suggested test: [how to investigate]

NEXT PLAYTEST SHOULD TEST:
  - [specific hypothesis based on findings]
  - [suggested N and tester profile]
```
