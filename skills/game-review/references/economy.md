# Section 3: Economy & Monetization (經濟系統)

## Sink/Faucet Model

The GDD MUST map resource flows explicitly. For each currency:

```
FAUCETS (sources)              SINKS (drains)
─────────────────              ──────────────
Quest rewards     ──→  [Currency Pool]  ──→  Item purchases
Daily login       ──→                   ──→  Upgrade costs
Battle drops      ──→                   ──→  Repair/maintenance
IAP               ──→                   ──→  Gacha/loot boxes
                                        ──→  Trading fees
                                        ──→  Expiration/decay
```

If the GDD has no sink/faucet map: **-3 points.** An economy without mapped flows WILL break.

## Reward Psychology

Check which reinforcement schedules the economy uses:

| Schedule | Pattern | Effect | Example |
|----------|---------|--------|---------|
| **Fixed Ratio** | Every N actions → reward | Predictable grind | 10 kills = 1 level up |
| **Variable Ratio** | Random chance per action → reward | Most addictive, use carefully | Loot drops, gacha |
| **Fixed Interval** | Every N minutes → reward | Creates routine | Daily login bonus |
| **Variable Interval** | Random timing → reward | Maintains vigilance | Random world events |

**The GDD should be INTENTIONAL about which schedules it uses.** If the economy accidentally relies on variable ratio for core progression, flag as ASK — this can create addiction patterns that harm player wellbeing.

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Currency Clarity** | 0-2 | Number of currencies and exchange rates. 2 = ≤3 currencies with intuitive exchange, 1 = 4-5 currencies or unclear exchange, 0 = 6+ currencies OR no exchange rate defined |
| **Sink/Faucet Balance** | 0-3 | Explicit flow model. 3 = full map with equilibrium analysis, 2 = sinks and faucets listed but not balanced, 1 = only faucets described (no sinks), 0 = no economy flow model |
| **Monetization Ethics** | 0-3 | 3 = clear ethical boundaries stated, F2P experience is genuinely fun, no pay-to-win in competitive contexts. 2 = mostly fair but some grey areas. 1 = concerning patterns (first IAP before aha moment, hard currency pay-only). 0 = predatory patterns or not addressed |
| **Spending Tier Health** | 0-2 | 2 = value proposition for minnow/dolphin/whale tiers all make sense. 1 = one tier is poorly served. 0 = whale-dependent design or no tier analysis |

**Section 3 Score: ___/10**

## Economy Red Flags (each is -1 from Sink/Faucet or Monetization score)

- More than 3 currencies without clear purpose → cognitive overload
- No meaningful sinks → hyperinflation, everything becomes worthless
- First IAP offered before aha moment → premature monetization
- Hard currency ONLY obtainable by paying → pay-to-win perception
- No pity system for gacha/probabilistic rewards → player frustration spiral
- Gini coefficient not considered → wealth gap makes late-joiners feel hopeless
- Reward schedule not documented → economy runs on accident, not design
- "Surprise mechanics" language used to obscure loot box mechanics → ethical flag

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route:

**If economy is undefined — ask Q3 first (simplest, most revealing):**

**Q3:** "What is the FIRST thing a player is asked to spend real money on, and have they had their 'aha moment' yet?"

Push until you hear: A specific item/offer AND its timing relative to the player's first delight moment. Monetizing before delight is extractive. If the designer says "we haven't decided monetization yet" — that's fine, note it and skip to Q1.

**STOP.** Wait for answer.

**If economy exists but no stress test — ask Q2:**

**Q2:** "What breaks first if players earn 2x the intended currency rate?"

Push until you hear: A specific failure point. "Nothing, they'd just progress faster" means sinks are missing. Good answer: "Upgrade costs would be trivialized by Day 7, we'd need to add a prestige sink."

**STOP.** Wait for answer.

**If economy is detailed — ask Q1:**

**Q1:** "A player has been playing for 30 days without spending money. Describe their exact resource state."

Push until you hear: Specific numbers or ranges. If the designer can't answer, the economy isn't designed, it's hoped.

**STOP after each.** Minimum 2 for Mode A (Mobile/F2P). Minimum 1 for other modes (can skip if premium with no in-game economy).

## Action Classification

- **AUTO:** Currency naming inconsistencies, math errors in stated earn rates vs costs, exchange rate contradictions
- **ASK:** Monetization model choices, gacha/loot box inclusion, premium currency pricing
- **ESCALATE:** Economy has no sinks (guaranteed hyperinflation), OR monetization targets minors with predatory patterns

**STOP.** One issue per AskUserQuestion.
