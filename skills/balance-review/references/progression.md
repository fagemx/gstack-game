# Section 3: Progression Pacing（進度節奏）

## 3A. Time-to-Milestone Mapping

Map the player's journey through key milestones. Fill in actual values from design doc or playtest data.

```
Milestone                     Target Time       Actual     Verdict
────────────────────────      ───────────       ──────     ───────
First meaningful action       < 30 seconds       ___       OK / SLOW / FAST
First "I understand" moment   2-5 minutes        ___
First meaningful choice       5-15 minutes       ___
First "wow" moment            30-60 minutes      ___
First build/identity choice   1-3 hours          ___
First major unlock/chapter    3-8 hours          ___
Mid-game identity             10-20 hours        ___
Endgame entry                 20-50 hours        ___
Mastery / completionism       50-200 hours       ___
```

Target times vary by genre. Adjust benchmarks:
- Mobile casual: compress everything by 5-10×
- Idle/incremental: "first meaningful action" = first prestige mechanic
- Roguelikes: measure per-run and meta-progression separately
- MMO: add social milestones (first party, first guild)

Flag any milestone that takes > 2× or < 0.5× the target time.

## 3B. Grind Ratio

**Grind ratio** = Meaningful actions per hour ÷ Total actions per hour

A "meaningful action" is one where the player makes a decision, learns something, or experiences something new. A "grind action" is repetition of a solved problem for resource accumulation.

| Grind Ratio | Verdict |
|-------------|---------|
| > 0.5 | **Engaging** — more than half of playtime involves decisions or novelty |
| 0.3 – 0.5 | **Acceptable** — some grind but regularly punctuated by meaning |
| 0.2 – 0.3 | **Grindy** — players who dislike repetition will churn here |
| < 0.2 | **Treadmill** — high churn risk. Only works if moment-to-moment gameplay is intrinsically satisfying (e.g., Diablo combat feel) |

For each progression segment, estimate the grind ratio. If it drops below 0.3 for more than 2 hours of playtime, flag it.

## 3C. Content Runway

| Question | Answer | Red Flag If... |
|----------|--------|---------------|
| Hours of unique content before repetition starts? | ___ | < 5 hours for premium, < 2 hours for F2P |
| What happens when unique content runs out? | ___ | "Nothing" or "grind the same levels" |
| Is new content gated by time, skill, or money? | ___ | Money-gated in premium game |
| Content addition velocity (for live service)? | ___ | Slower than player consumption rate |
| Is there an endless scaling system? (e.g., NG+, rifts, floors) | ___ | Scaling is pure stat inflation with no mechanical variety |

## 3D. Pity Systems / Bad Luck Protection

**Rule: Any probabilistic reward system MUST have documented bad luck protection.**

For each probabilistic system (gacha, loot drops, crafting success, crit chance):

| Parameter | Value | Healthy Range |
|-----------|-------|--------------|
| Expected attempts for reward | ___ | Depends on context |
| Pity threshold (guaranteed at N) | ___ | Should exist. If blank, ESCALATE. |
| Pity threshold ÷ Expected attempts | ___ | 1.5× – 3× expected (< 1.5 = too generous to matter, > 3 = feels broken) |
| Is pity progress visible to player? | ___ | Should be YES for high-value rewards |
| Does pity reset on reward? | ___ | Document clearly either way |

**Players who exceed 2× the expected attempts without a reward WILL feel the game is broken.** If no pity system exists for a core reward, ESCALATE.

## 3E. Reward Psychology

Map which **reward schedules** are used where:

| Schedule Type | How It Works | Best For | Danger |
|--------------|-------------|----------|--------|
| **Variable Ratio** (slot machine) | Reward after random number of actions | Engagement, "one more try" | Ethically questionable if tied to real money |
| **Fixed Ratio** (every N actions) | Reward every Nth action | Predictable goals, quest completion | Can feel mechanical |
| **Variable Interval** (random timing) | Reward at random time intervals | Maintaining check-in behavior | Can create compulsion loops |
| **Fixed Interval** (daily reset) | Reward available every X hours | Daily retention | Punishes missing a day (FOMO) |

For each major reward system, document:
1. Which schedule type is it?
2. Is it appropriate for the context? (Variable ratio on paid gacha = ethical concern)
3. Does the player understand the schedule? (Transparency vs mystery)
