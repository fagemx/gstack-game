# Section 2: Economy Model（經濟模型）

## 2A. Sink/Faucet Mapping

Draw the complete resource flow for each currency. Every resource in the game must appear in this map.

```
FAUCETS (sources)              SINKS (drains)
─────────────────              ──────────────
Quest rewards         ──┐  ┌── Equipment upgrades
Daily login bonus     ──┤  ├── Consumables (potions, ammo)
Achievement awards    ──┤  ├── Cosmetic purchases
PvP victory rewards   ──┼──┼── Repair / maintenance costs
Selling items         ──┤  ├── Trading post fees / tax
IAP (real money)      ──┘  └── Gacha / loot box pulls

                    PLAYER
               ┌──────────────┐
               │  STOCKPILE   │
               │  Health: ???  │
               └──────────────┘
```

For each currency, determine:
- **Total faucet output per hour** (for a typical active player)
- **Total sink demand per hour** (assuming player engages with available sinks)
- **Faucet/Sink ratio** = faucet ÷ sink

| Ratio | Diagnosis | Consequence |
|-------|-----------|-------------|
| > 1.2 | **Inflationary** | Currency loses meaning over time. By Day 14, prices feel trivial. Players stockpile with nothing to spend on. |
| 0.9 – 1.1 | **Healthy** | Players make meaningful spending decisions. Always slightly want more. |
| < 0.8 | **Deflationary** | New players can't afford basics. Feels punishing. Creates pay pressure in F2P. |

If faucet/sink ratio cannot be calculated (no data), this is the finding: "Economy has no quantitative model. Build a spreadsheet before tuning anything."

## 2B. Inflation/Deflation Projection

For games with persistent economies (MMO, idle, live service):

Project currency stockpile over time:
```
Day    Earned(cumulative)  Spent(cumulative)  Stockpile   Status
─────  ─────────────────   ─────────────────  ─────────   ──────
  1         500                 300               200      OK
  7        4,000               2,800             1,200     OK
 14        9,000               5,500             3,500     ⚠️ Growing
 30       22,000              11,000            11,000     🔴 Inflated
 90       70,000              25,000            45,000     🔴🔴 Broken
```

If stockpile grows faster than sink capacity, the economy will break. Flag the **day** when stockpile exceeds 2× the cost of the most expensive available item — that's when currency stops feeling valuable.

## 2C. Currency Clarity

| Currency Count | Verdict |
|---------------|---------|
| 1 | Clear. Simple. Risk: limited design space for monetization. |
| 2 | Standard (soft currency + hard/premium currency). Clear if exchange is intuitive. |
| 3 | Manageable IF each has a distinct purpose and the UI makes it obvious. |
| 4+ | **Red flag.** Cognitive overload. Players will not track 4 exchange rates. Justify each or consolidate. |

For each currency, verify:
- Does it have a clear name that implies its use?
- Can the player see their balance at all times?
- Is the exchange rate between currencies stable or floating?
- Can the player convert soft → hard currency? (If no, is that made clear?)

## 2D. Gini Coefficient Target

The **Gini coefficient** measures wealth inequality among players (0 = perfect equality, 1 = one player has everything).

| Game Type | Target Gini | Reasoning |
|-----------|-------------|-----------|
| Cooperative / PvE | < 0.3 | Low inequality. All players should feel capable. |
| Competitive / PvP | 0.3 – 0.5 | Moderate inequality. Skill and time create gap, but not insurmountable. |
| Sandbox / Open economy | 0.4 – 0.6 | Specialist economies create natural inequality. |
| > 0.6 in any context | **Flag** | Whale-dominated. New/casual players feel powerless. |

If no player wealth distribution data exists, flag this as a metric to track post-launch.
