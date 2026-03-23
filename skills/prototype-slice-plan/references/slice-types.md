# Slice Types

## 1. Mechanic Prototype

**What it proves:** The core verb is fun in isolation.
**Scope:** One mechanic, 30 seconds of gameplay, no progression, no economy, no story.
**What can be faked:** Art (use primitives), audio (use placeholders), UI (use debug text), levels (use one test arena).
**When to use:** You don't know if the fundamental action is satisfying. This is always the first slice if the core loop is unproven.
**Typical build time:** 3-7 days.
**Example:** Hollow Knight's combat prototype: one room, one enemy type, dash + slash + heal. No map, no upgrades, no story.

## 2. Onboarding Slice

**What it proves:** A new player can understand and engage within the first 60 seconds.
**Scope:** FTUE flow from app open to first "aha moment." Includes tutorial (or lack thereof), first interaction, first reward.
**What can be faked:** Everything after the first 2 minutes. Meta-game, progression, economy, endgame.
**When to use:** The core mechanic works but you're not sure players will GET IT without guidance. Also: mobile games where FTUE determines D1 retention.
**Typical build time:** 1-2 weeks.
**Example:** A puzzle game's first 5 levels that teach mechanics through level design, not text boxes.

## 3. Progression Slice

**What it proves:** Players feel a sense of growth and want to keep going over multiple sessions.
**Scope:** 30-60 minutes of content with at least one meaningful unlock or upgrade. Must include the feeling of "I'm stronger than when I started."
**What can be faked:** Late-game content, cosmetics, social features, endgame.
**When to use:** Core mechanic works, onboarding works, but you're not sure about retention and "one more level" motivation.
**Typical build time:** 2-3 weeks.
**Example:** A roguelite's first 3 runs: starting weapon → death → unlock new weapon → run 2 feels different.

## 4. Combat Slice

**What it proves:** The combat system is satisfying, readable, and has depth.
**Scope:** Player vs 2-3 enemy types in one arena. Full feedback chains (attack, hit, stagger, death). Ideally includes one boss or mini-boss to test difficulty scaling.
**What can be faked:** Story context, exploration, economy, multiplayer, progression beyond combat upgrades.
**When to use:** The game is combat-centric and the feel of fighting is the core promise.
**Typical build time:** 1-3 weeks.
**Example:** Dark Souls' combat without any map: one bonfire, 3 enemy types, 1 boss. Test if dodge/attack/heal cycle is tense.

## 5. Economy Slice

**What it proves:** The resource flow makes sense and creates meaningful decisions.
**Scope:** Simulated economy running for "Day 1 through Day 7" of player time. Can be a spreadsheet simulation or a stripped-down game with visible economy controls.
**What can be faked:** Everything except the earn/spend loop. Graphics, story, social features, combat depth.
**When to use:** F2P games, idle games, or any game where economy IS the core loop. Use when you need to validate faucet/sink ratios before building real content.
**Typical build time:** 1-2 weeks (often faster as a spreadsheet than a playable build).
**Example:** A gacha game's first 7 days simulated: daily currency income, spending opportunities, premium currency temptation points.

## 6. Vertical Slice

**What it proves:** All systems work together as a cohesive experience.
**Scope:** 10-15 minutes of polished, complete gameplay. All core systems present (loop, progression, economy, UI). Represents a cross-section of the final game.
**What can be faked:** Content volume (only need 1 area/chapter), endgame, social features, all platform-specific features.
**When to use:** Individual systems have been proven. You need to verify they COMBINE well. Often used for publisher pitches, greenlight decisions, or team alignment.
**Typical build time:** 4-8 weeks.
**Example:** The first chapter of a narrative RPG: exploration, dialogue, combat, one shop, one level-up. All at near-final quality.

**⚠️ Warning:** Vertical slices are expensive. Only build one after mechanic prototypes have validated the core loops. Jumping straight to vertical slice is the #1 scope mistake in game development.

## Decision Table

| If you need to know... | Use this slice type |
|------------------------|-------------------|
| Is the core action fun? | Mechanic Prototype |
| Will players understand it? | Onboarding Slice |
| Will players keep playing? | Progression Slice |
| Is combat satisfying? | Combat Slice |
| Does the economy work? | Economy Slice |
| Does everything work together? | Vertical Slice |
| I'm not sure what I need to know | Start with Mechanic Prototype |
