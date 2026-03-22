# Section 6: Cross-Section Consistency

This section checks for **contradictions between sections**. These are the hardest problems to find because each section can look fine in isolation.

| Cross-Check | What to Verify | Red Flag |
|-------------|---------------|----------|
| **Difficulty × Economy** | Can players afford recovery tools (potions, continues, revives) when difficulty spikes? | Difficulty spike + empty wallet = quit point |
| **Difficulty × Monetization** | Do difficulty spikes coincide with IAP prompts? | Frustration monetization — deliberately making the game hard to sell the solution |
| **Progression × Economy** | Does progression speed match resource accumulation? | Unlocking content faster than earning currency to engage with it = frustration |
| **Progression × Monetization** | Do paywalls hit at progression valleys or peaks? | Valley = "pay to escape boredom" (bad). Peak = "pay to skip what you enjoy" (worse — you're selling skipping your own game) |
| **Balance × Economy** | Do stronger characters/items cost proportionally more? | If the best option is also the cheapest = no meaningful choice |
| **Balance × Monetization** | Are paid characters/items stronger than free ones? | P2W perception, even if slight advantage |
| **Difficulty × Progression** | Does endgame difficulty require endgame progression? | If difficulty plateaus before progression does, endgame feels pointless |
| **Economy × Content Runway** | Do sinks exist for all progression stages? | Early sinks without late-game sinks = inflation at endgame |

For each cross-check that reveals a conflict, present as a single AskUserQuestion with:
- The specific contradiction
- Which two sections conflict
- A concrete recommendation to resolve
