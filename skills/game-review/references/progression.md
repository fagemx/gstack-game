# Section 2: Progression & Retention (進度與留存)

## SDT Integration at Each Retention Tier

Every retention hook must satisfy at least one Self-Determination Theory need:

| Retention Tier | Timeframe | SDT Need to Satisfy | Example |
|----------------|-----------|---------------------|---------|
| **FTUE** | First 60 seconds | **Competence** — "I can do this" | Tutorial rewards first correct action immediately |
| **D1 (come back tomorrow)** | 0-24 hours | **Autonomy** — "I want to try MY strategy" | Unfinished build, unanswered question, untried path |
| **D7 (weekly habit)** | 1-7 days | **Competence** — "I'm getting better" | Visible skill growth, new abilities earned, mastery milestones |
| **D30 (invested identity)** | 7-30 days | **Relatedness** — "This is MY world/team/character" | Social bonds, reputation, sunk-cost identity, community |

## Flow State Design

Check for **sawtooth difficulty curve**: tension builds → milestone release → re-engage at higher baseline.

**Red flags:**
- Flat difficulty = boredom (player coasts without challenge)
- Vertical spike = frustration (sudden difficulty wall with no preparation)
- No difficulty curve described = the GDD assumes difficulty "just works" (it never does)

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **FTUE Quality** | 0-2 | Time to first meaningful action documented AND < benchmark (30s mobile, 2min PC, 5min complex strategy). 2 = explicit plan with timing, 1 = described but no timing target, 0 = not addressed |
| **Retention Hooks** | 0-3 | D1, D7, D30 hooks explicitly identified. 1 point each. 0 if the GDD says "players will want to come back" without specifying WHY |
| **Difficulty Curve** | 0-2 | Explicit difficulty progression plan. 2 = sawtooth pattern with milestone releases described, 1 = general "difficulty increases" statement, 0 = not addressed |
| **Churn Point Analysis** | 0-3 | Top 3 likely quit points identified with mitigation plan. 1 point per identified churn point with specific mitigation. 0 if churn points not considered |

**Section 2 Score: ___/10**

## Reference Benchmarks

| Metric | Good | Average | Problem |
|--------|------|---------|---------|
| FTUE to first action | <30s (mobile), <2min (PC) | 30-60s / 2-5min | >60s / >5min |
| D1 retention | 40%+ | 25-40% | <25% |
| D7 retention | 15%+ | 8-15% | <8% |
| D30 retention | 5%+ (F2P), 20%+ (premium) | 3-5% / 10-20% | <3% / <10% |
| Session length vs target | Within ±20% | Within ±50% | >2x or <0.5x target |

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route:

**If GDD has no retention hooks — ask Q1 first:**

**Q1:** "A player finishes their first session and closes the app. Name the SPECIFIC thing that makes them open it again tomorrow."

Push until you hear: A concrete mechanism. "They have 3 unclaimed daily rewards and their base is still upgrading" = specific. "They'll want to see what happens next" = vague (push: "What SPECIFICALLY happens next that they know about but haven't experienced yet?").
Red flags: "The gameplay is fun enough to come back." — That's hope, not design.

**STOP.** Wait for answer.

**If GDD has retention but no churn analysis — ask Q2:**

**Q2:** "Where does the player most likely quit FOREVER? What is the specific plan to prevent that?"

Push until you hear: A named moment + a specific intervention. "After the 3rd boss when difficulty spikes — we add an adaptive difficulty hint system" = good. "We'll tune it in playtest" = vague (push once, then flag as ASK).

**STOP.** Wait for answer.

**If GDD is detailed — ask Q3:**

**Q3:** "Does challenge scale with SKILL or with TIME PLAYED?"

Skill gates = mastery satisfaction. Time gates = obligation. The GDD should know which and why.

**STOP after each.** Minimum 2, skip if already answered in GDD.

## Action Classification

- **AUTO:** FTUE timing exceeds benchmark without justification, retention hooks described inconsistently across sections
- **ASK:** Difficulty curve design choices, content gate vs skill gate decisions, churn mitigation strategies
- **ESCALATE:** No retention hooks identified at all. GDD assumes players will "just keep playing."

**STOP.** One issue per AskUserQuestion.
