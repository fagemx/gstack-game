# Scoring Rubrics & Mode Weights

## Mode Weight Adjustments

| Section | A: Mobile | B: PC/Console | C: Multiplayer | D: Narrative | E: Tabletop |
|---------|-----------|---------------|----------------|--------------|-------------|
| 1. Core Loop | 25% | 30% | 25% | 15% | 25% |
| 2. Progression & Retention | 25% | 20% | 15% | 15% | 15% |
| 3. Economy | 25% | 10% | 20% | 5% | 10% |
| 4. Player Motivation | 10% | 15% | 15% | 30% | 20% |
| 5. Risk Assessment | 5% | 10% | 10% | 10% | 10% |
| 6. Cross-Consistency | 10% | 15% | 15% | 25% | 20% |

## Section 1: Core Loop — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Clarity** | 0-2 | Can describe core loop in one sentence using "verb → feedback → reward → repeat" format. 2 = crystal clear, 1 = understandable but wordy, 0 = unclear or missing |
| **Session Fit** | 0-2 | Loop completion fits target session length. 2 = natural stopping point within target, 1 = roughly fits but has dead time or overruns, 0 = mismatch (e.g., 20-min loop for a 2-min mobile session) |
| **Depth** | 0-2 | Mastery comes from doing the loop BETTER, not just more. 2 = clear skill ceiling with discoverable techniques, 1 = some depth but mostly linear, 0 = flat repetition with no skill expression |
| **Fail State** | 0-2 | Failure is interesting, not just punishing. 2 = failure teaches something and creates interesting decisions, 1 = failure is tolerable but generic (respawn, retry), 0 = no fail state described OR failure is purely punitive |
| **Uniqueness** | 0-2 | The "It's the game where you..." test. 2 = describable unique verb/mechanic a player would tell a friend, 1 = recognizable genre execution with a twist, 0 = generic description indistinguishable from competitors |

**Section 1 Score: ___/10**

## Section 2: Progression & Retention — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **FTUE Quality** | 0-2 | Time to first meaningful action documented AND < benchmark (30s mobile, 2min PC, 5min complex strategy). 2 = explicit plan with timing, 1 = described but no timing target, 0 = not addressed |
| **Retention Hooks** | 0-3 | D1, D7, D30 hooks explicitly identified. 1 point each. 0 if the GDD says "players will want to come back" without specifying WHY |
| **Difficulty Curve** | 0-2 | Explicit difficulty progression plan. 2 = sawtooth pattern with milestone releases described, 1 = general "difficulty increases" statement, 0 = not addressed |
| **Churn Point Analysis** | 0-3 | Top 3 likely quit points identified with mitigation plan. 1 point per identified churn point with specific mitigation. 0 if churn points not considered |

**Section 2 Score: ___/10**

## Section 3: Economy & Monetization — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Currency Clarity** | 0-2 | Number of currencies and exchange rates. 2 = ≤3 currencies with intuitive exchange, 1 = 4-5 currencies or unclear exchange, 0 = 6+ currencies OR no exchange rate defined |
| **Sink/Faucet Balance** | 0-3 | Explicit flow model. 3 = full map with equilibrium analysis, 2 = sinks and faucets listed but not balanced, 1 = only faucets described (no sinks), 0 = no economy flow model |
| **Monetization Ethics** | 0-3 | 3 = clear ethical boundaries stated, F2P experience is genuinely fun, no pay-to-win in competitive contexts. 2 = mostly fair but some grey areas. 1 = concerning patterns (first IAP before aha moment, hard currency pay-only). 0 = predatory patterns or not addressed |
| **Spending Tier Health** | 0-2 | 2 = value proposition for minnow/dolphin/whale tiers all make sense. 1 = one tier is poorly served. 0 = whale-dependent design or no tier analysis |

**Section 3 Score: ___/10**

### Economy Red Flags (each is -1 from Sink/Faucet or Monetization score)

- More than 3 currencies without clear purpose → cognitive overload
- No meaningful sinks → hyperinflation, everything becomes worthless
- First IAP offered before aha moment → premature monetization
- Hard currency ONLY obtainable by paying → pay-to-win perception
- No pity system for gacha/probabilistic rewards → player frustration spiral
- Gini coefficient not considered → wealth gap makes late-joiners feel hopeless
- Reward schedule not documented → economy runs on accident, not design
- "Surprise mechanics" language used to obscure loot box mechanics → ethical flag

## Section 4: Player Motivation — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **SDT Coverage** | 0-3 | Each SDT need (Autonomy, Competence, Relatedness) served by at least one core system = 1 point each. 0 for any unserved need |
| **Player Type Targeting** | 0-3 | Target player types explicitly identified = 1 point. Systems designed for those types = 1 point. Non-target types acknowledged = 1 point |
| **Ludonarrative Consonance** | 0-2 | 2 = mechanics and narrative reinforce each other (or intentional dissonance is justified). 1 = minor contradictions. 0 = major unacknowledged dissonance |
| **Emotional Arc** | 0-2 | 2 = session emotional arc explicitly mapped (tension/release/climax/resolution). 1 = general mood described but no arc. 0 = no emotional design consideration |

**Section 4 Score: ___/10**

## Section 5: Risk Assessment — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Risk Identification** | 0-3 | 3 = risks identified across all 5 categories with probability/impact ratings. 2 = most categories covered. 1 = only obvious risks listed. 0 = no risk analysis |
| **Mitigation Specificity** | 0-3 | 3 = every high+ risk has a specific mitigation plan with timeline. 2 = mitigations exist but are vague ("we'll playtest"). 1 = mitigations for some risks only. 0 = no mitigations |
| **Pillar Coherence** | 0-2 | 2 = no feature contradicts stated pillars, OR contradictions are acknowledged with justification. 1 = minor pillar tensions unaddressed. 0 = major pillar violations OR no pillars to check against |
| **Scope Realism** | 0-2 | 2 = scope is Lake-sized with concrete content list. 1 = scope is ambitious but bounded. 0 = scope is Ocean-sized with no cut plan |

**Section 5 Score: ___/10**

## Section 6: Cross-Consistency — Scoring Rubric

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Internal Consistency** | 0-4 | Start at 4. Deduct 1 for each cross-section contradiction found (max -4) |
| **Pillar Traceability** | 0-3 | 3 = every major design decision traces to a pillar. 2 = most do. 1 = some decisions seem arbitrary. 0 = no pillar connection visible |
| **System Coherence** | 0-3 | 3 = all systems reinforce each other (positive coherence). 2 = systems are independent but not contradictory. 1 = some systems work against each other. 0 = systems actively undermine each other |

**Section 6 Score: ___/10**

## GDD Health Score Interpretation

| Range | Label | Meaning |
|-------|-------|---------|
| 8.0-10.0 | SHIP-READY | GDD is comprehensive, internally consistent, ready for production |
| 6.0-7.9 | SOLID | Good foundation, address flagged issues before full production |
| 4.0-5.9 | NEEDS WORK | Significant gaps that will cause problems in production |
| 2.0-3.9 | MAJOR REVISION | Fundamental design questions unanswered |
| 0.0-1.9 | START OVER | Not a GDD yet, more of a concept note |
