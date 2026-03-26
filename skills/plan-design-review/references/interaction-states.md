# Game Interaction States — Coverage Matrix

## Standard States (from web/app design)

| State | Description | Game Example |
|-------|-------------|--------------|
| **LOADING** | Data or asset is being fetched/loaded | Entering a new zone, loading save, connecting to server |
| **EMPTY** | No content to display | Empty inventory, no friends online, no quests available |
| **ERROR** | Something failed | Network disconnect, save corruption, purchase failed |
| **SUCCESS** | Action completed successfully | Item crafted, level completed, purchase confirmed |
| **PARTIAL** | Incomplete data or mixed state | Partially downloaded DLC, some friends online |

## Game-Specific States

| State | Description | Game Example |
|-------|-------------|--------------|
| **DEATH** | Player character died/lost | Game over screen, respawn countdown, death recap |
| **RESPAWN** | Returning to play after death | Spawn protection, re-entry animation, loadout selection |
| **COOLDOWN** | Ability/action temporarily unavailable | Skill on cooldown, weapon reloading, potion timer |
| **FULL** | Container/resource at capacity | Inventory full, max currency, squad full |
| **LOCKED** | Content exists but is not yet accessible | Locked character, level requirement not met, paywall |
| **MATCHMAKING** | Waiting for other players | Queue timer, estimated wait, cancel option |
| **PAUSED** | Game state suspended | Pause overlay, resume prompt, in single-player only |
| **DISCONNECTED** | Lost connection during play | Reconnect prompt, timeout counter, offline fallback |
| **INSUFFICIENT** | Not enough resource for action | Can't afford item, not enough materials, energy depleted |
| **TUTORIAL** | First-time encounter with feature | Guided interaction, contextual tooltip, practice mode |
| **BUFFERED** | Action queued but not yet executed | Queued ability, pending trade, scheduled event |

## Coverage Matrix Template

Use this template during Pass 2. Fill in what the player SEES for each applicable state.
Mark N/A for states that don't apply to a feature.

```
FEATURE           | LOADING | EMPTY | ERROR | SUCCESS | DEATH | COOLDOWN | FULL | LOCKED | DISCONNECTED
------------------|---------|-------|-------|---------|-------|----------|------|--------|-------------
Main HUD          |         |       |       |         | [?]   | [?]      |      |        | [?]
Inventory         | [?]     | [?]   | [?]   | [?]     |       |          | [?]  | [?]    |
Shop/Store        | [?]     | [?]   | [?]   | [?]     |       |          |      | [?]    | [?]
Crafting          | [?]     | [?]   | [?]   | [?]     |       | [?]      |      | [?]    |
Skill/Ability Bar |         |       |       | [?]     | [?]   | [?]      |      | [?]    |
Quest/Mission     | [?]     | [?]   |       | [?]     |       |          |      | [?]    |
Social/Friends    | [?]     | [?]   | [?]   |         |       |          | [?]  |        | [?]
Matchmaking       | [?]     |       | [?]   | [?]     |       |          | [?]  |        | [?]
Settings          | [?]     |       | [?]   | [?]     |       |          |      |        |
Save/Load         | [?]     | [?]   | [?]   | [?]     |       |          |      |        |
```

## How to Evaluate

For each `[?]` cell:
1. Does the plan describe what the player SEES (not backend behavior)?
2. Is the visual treatment specific to this game's art style?
3. Does it include a recovery action (what can the player DO)?

**Scoring:**
- Each applicable `[?]` cell that is specified = +1
- Each applicable `[?]` cell that is unspecified = 0
- Coverage % = specified / total applicable

**Thresholds:**
| Coverage | Score |
|----------|-------|
| 90-100% | 9-10 |
| 75-89% | 7-8 |
| 50-74% | 5-6 |
| 25-49% | 3-4 |
| 0-24% | 0-2 |

## Common Gaps (Check These First)

1. **Death screen** — Most plans describe "game over" but not what the player sees, feels, or can do
2. **Full inventory** — What happens to the pickup? Is the player warned before it's lost?
3. **Network disconnect during gameplay** — What's preserved? What's lost? How does the player know?
4. **Insufficient resources** — Does the UI show what's missing? Does it suggest how to get it?
5. **First-time feature encounter** — Is there a guided experience or does the player figure it out?
6. **Cooldown visualization** — Sweeping clock? Grayed out? Number countdown? All three?
