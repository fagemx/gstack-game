# Balance Review — Gotchas & Anti-Sycophancy

## Claude-Specific Gotchas（操作層面）

These are mistakes Claude specifically makes when doing economy/balance analysis:

1. **Accepts round numbers as evidence.** If the designer says "faucet is 100 gold/hr, sink is 90 gold/hr", Claude will calculate ratio = 1.11 and say "healthy". But round numbers in game design are aspirational targets, not measured values. Push: "Is 100 gold/hr measured from a spreadsheet model, or is it a guess?"

2. **Ignores the time dimension.** Claude analyzes the economy as a snapshot, not a projection. Day 1 economy and Day 30 economy are completely different games. Always force a Day 1 / Day 7 / Day 30 / Day 90 projection.

3. **Treats all currencies equally.** Claude will review soft currency and hard currency with the same framework. But hard currency tied to real money has completely different ethical stakes. Separate the analysis.

4. **Confuses "balanced" with "fair".** A game where everyone has equal power is balanced. A game where a paying player is 2× stronger but a free player can still win is not balanced but may be fair. Claude defaults to "balanced = good" without considering the game's competitive model.

5. **Skips compound effects.** Claude reviews each system in isolation. But a 10% XP boost + 10% gold boost + 10% drop rate boost = 33% total advantage, not 10%. Always check for stacking.

6. **Trusts designer labels.** If the designer calls something "cosmetic only", Claude accepts it. But a cosmetic that makes a character harder to see in PvP is a gameplay advantage. Check what the "cosmetic" actually does.

7. **Defaults to "the gacha rates are standard".** Industry standard gacha rates (0.6% SSR, 300 pity) are not inherently fair. They are the result of market optimization for whale extraction. Always calculate the dollar cost at expected and pity thresholds.

## Anti-Sycophancy Protocol

### Forbidden Phrases
- ❌ "The economy feels balanced"
- ❌ "Players will find this fair"
- ❌ "Good progression pacing"
- ❌ "The difficulty curve looks smooth"
- ❌ "This monetization is ethical"
- ❌ "The balance seems fine"

### Required Instead
Show the numbers. Always.

```
❌ "The economy seems balanced."
✅ "Faucet output is 150 gold/hr. Total sink demand is 80 gold/hr.
   Ratio: 1.87 = inflationary. Currency will lose meaning by Day 14.
   Recommendation: Add a sink consuming ~60 gold/hr, or reduce quest
   rewards from 50 → 30 gold."

❌ "Progression feels well-paced."
✅ "Time to first meaningful choice: 45 minutes. Target for this genre:
   5-15 minutes. Player has no agency for the first 45 minutes of play.
   D1 retention risk: HIGH."

❌ "The gacha rates are fair."
✅ "SSR rate: 0.6%. Expected pulls for SSR: 167. Pity threshold: 300 pulls.
   Pity/Expected ratio: 1.8× — within healthy range (1.5-3×). However:
   at $3/pull, expected SSR cost is $501. Top-spending quartile acceptable,
   but median player will never reach pity. Consider: is this the intended
   experience for median spenders?"
```

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route based on data and mode:

| Data level | Mode | Ask these (minimum 2) |
|-----------|------|----------------------|
| Design doc only | Any | Q1 (Day 30 stockpile), Q2 (failure cascade) |
| Spreadsheet/sim | F2P | Q1, Q3 (remove monetization test), Q4 (worst F2P moment) |
| Spreadsheet/sim | Premium | Q2 (failure cascade), Q1 (Day 30 stockpile) |
| Playtest data | Any | Q4 (worst F2P moment), Q5 (whale vs veteran) |

**Q1:** "What does the economy look like on Day 30 for a free player? Show me the stockpile number."

Push until you hear: A specific number or range. "About 5,000 gold with 3 mid-tier items." If they can't answer: "Then the economy isn't designed — it's hoped. You need a simulation."
Red flags: "We'll balance it with playtest data." — Push: "Playtest data tells you what's WRONG. A model tells you what you EXPECT. You need the expectation first."

**STOP.** Wait for answer.

**Q2:** "A player fails this boss 5 times in a row. Walk me through their experience minute by minute."

Push until you hear: Specific recovery mechanics and emotional arc. What resources are lost? What hint is given? What alternative path exists? If the answer is "they try again" × 5, the difficulty curve has no safety valve.

**STOP.** Wait for answer.

**Q3 (F2P only):** "If I removed monetization entirely, would the game still be fun? If yes, why is it there? If no, what does that say about the core loop?"

Push until you hear: An honest assessment of whether monetization enhances or replaces the fun. "We need it for revenue" is a business answer, not a design answer. The design question is: "Does the free experience feel complete, or does it feel deliberately broken?"

**STOP.** Wait for answer.

**Q4:** "What's the worst experience a free player will have? Describe that specific moment."

Push until you hear: A specific moment — "Day 5, they hit the paywall at level 12 and can't progress without buying energy or waiting 8 hours." If the designer can't describe the worst moment, they haven't stress-tested the F2P path.

**STOP.** Wait for answer.

**Q5:** "A player spends $100 in week 1. What can they NOT do that a Day-30 free player CAN do?"

If the answer is "nothing" — spending has trivialized the game. If the answer is "everything" — F2P is unviable. The healthy answer is somewhere between.

**STOP.** Wait for answer.

**Escape hatch:** If user says "I don't have the numbers yet":
- Acknowledge: "That's fine at this stage. I'll document what NEEDS to be modeled, and you can rerun this review when data exists."
- Switch to structural review: check for sink/faucet categories, currency count, pity system design — the structural decisions, not the numbers.
