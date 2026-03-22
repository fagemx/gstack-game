# Section 5: Character/Unit Balance（角色/單位平衡）

> **Skip this section if the game has no character/unit selection or PvP.**
> **For PvE-only games with character choice, review only 5A and 5B.**

## 5A. Balance Framework Identification

Identify which balance framework the game uses (reference: Sirlin's framework):

| Framework | Description | Example | Strength | Risk |
|-----------|------------|---------|----------|------|
| **Transitive** | A > B > C in both power AND cost | RTS unit tiers | Clear, learnable | Can feel linear, "just build expensive stuff" |
| **Intransitive** | Rock > Scissors > Paper > Rock | Fighting game matchups | Deep, strategic | Complex to balance, knowledge barrier |
| **Frustra** | Apparently imbalanced, hidden counters | "OP" character with subtle weakness | Exciting discovery | Feels unfair to new players |
| **Asymmetric** | Different capabilities, equal viability | L4D survivors vs infected | Unique experiences | Hardest to balance, subjective "fairness" |

Check:
- Is the chosen framework **consistent** across the roster? (Mixing frameworks without intention creates confusion)
- Is the framework **communicated** to players? (Intransitive balance requires visible counter information)
- Does the framework **match the game's competitive goals**? (Casual games should lean transitive; competitive games benefit from intransitive)

## 5B. Win Rate Distribution

For games with playable characters/units/decks:

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Win rate range (highest - lowest) | < 10% | 10-15% | > 15% |
| Any character > 55% win rate (all skill levels) | — | Flag | **Overpowered** — nerf candidate |
| Any character < 45% win rate (all skill levels) | — | Flag | **Underpowered** — buff candidate |
| Standard deviation of win rates | < 3% | 3-5% | > 5% = systemic balance problem |
| Win rate at high skill vs low skill divergence | Similar | > 5% gap | > 10% gap = skill-floor/ceiling problem |

**Important nuance:** A character with 52% win rate overall but 60% at high skill is a different problem than one with 55% at all levels. Segment by skill bracket when data allows.

If no win rate data exists (pre-launch), review for **theoretical dominance**:
- Is there a strategy/unit that has no clear counter?
- Is there a strategy/unit that is strictly better than another at the same cost?
- Does the meta-game have at least 3 viable strategies?

## 5C. Counter System Health

| Check | Healthy | Unhealthy |
|-------|---------|-----------|
| Every strong option has at least 2 viable counters | ✅ | ❌ Single counter = fragile balance |
| No single option counters > 50% of the roster | ✅ | ❌ Centralizing option = must-pick |
| Counter information is discoverable in-game | ✅ | ❌ Requires wiki/external knowledge |
| Counter-play is executable at all skill levels | ✅ | ❌ "Just dodge it" is not a counter for casual players |
| New content doesn't invalidate existing counters | ✅ | ❌ Power creep = old content becomes useless |
