# Prototype Slice Plan — Examples

## Example 1: Mobile Roguelite (F2P)

```
Prototype Slice Plan
═══════════════════════════════════════════════════
Game: Dungeon Dash (mobile roguelite, F2P)
GDD Status: Reviewed (/game-review score: 6.2/10)
Branch: main
Key risk from review: "Core loop clarity scored 1/2 — loop described
as 'explore and fight' but no specific verb or feedback chain defined."

RECOMMENDED SLICE: Mechanic Prototype

Hypothesis to validate:
  "The tap-to-dash combat loop (tap direction → dash → hit enemies
  in path → chain combo) is fun with ZERO progression, ZERO economy,
  ZERO story, for at least 3 minutes on a phone."

What to build:
  - One arena room (10x10 grid)
  - Player character with dash mechanic (tap direction → move → hit)
  - 2 enemy types (stationary + patrolling)
  - Combo counter (visual only, no rewards)
  - Death = restart room

What to fake:
  - Art: colored circles for player/enemies, grid lines for arena
  - Audio: placeholder beeps for hit/death/combo
  - UI: combo counter text overlay, no menus
  - Progression: none — deliberately. If dash is fun at zero progression,
    it's fun forever.
  - Economy: none
  - Story: none

What NOT to fake (must be real):
  - Input responsiveness: tap-to-dash must feel instant (<50ms)
  - Hit feedback: screen flash + haptic on contact
  - Combo chain detection: consecutive hits within 0.5s = chain

Success criteria:
  - 5 external playtesters play for 3+ minutes each without prompting
  - At least 3/5 ask "can I play again?" or keep playing past 3 min
  - At least 3/5 discover combo chains without being told

Failure looks like:
  - Players tap randomly without understanding dash directionality
  - Players quit after 1 minute saying "I don't get what I'm doing"
  - No one discovers combo chains organically

Build time: 5 days
Dependencies: Touch input system only. No backend, no server, no save.

Score:
  Validation Value:        2/2  (tests the #1 risk: is the core verb fun?)
  Implementation Feasibility: 2/2  (5 days, one dev, no dependencies)
  Player Signal Clarity:   2/2  (binary: they keep playing or they don't)
  Dependency Risk:         2/2  (zero dependencies)
  Scope Discipline:        2/2  (can't cut anything without losing signal)
  TOTAL:                   10/10

Rejected alternatives:
  - Onboarding Slice (7/10): Premature. If the core verb isn't fun, no
    amount of onboarding helps.
  - Progression Slice (5/10): Too early. Can't test progression feel
    with 5 days of content.
═══════════════════════════════════════════════════
```

---

## Example 2: PC Narrative RPG (Premium)

```
Prototype Slice Plan
═══════════════════════════════════════════════════
Game: Ironveil (PC narrative RPG, premium $29.99)
GDD Status: Reviewed (/game-review score: 7.1/10)
Branch: feature/combat-v2
Key risk from review: "Ludonarrative consonance scored 1/2 — game
promises 'every choice matters' but combat has no branching outcomes."

RECOMMENDED SLICE: Combat Slice (with narrative hook)

Hypothesis to validate:
  "The stance-switching combat system creates meaningful per-encounter
  decisions (not just 'attack until dead'), AND combat outcomes can
  visibly affect the narrative (sparing vs killing changes NPC dialogue)."

What to build:
  - 1 combat arena with environmental hazards (2 types)
  - Player with 3 stances (aggressive/defensive/stealth), switchable mid-combat
  - 2 enemy types: patrol guard (tests aggro/stealth) + armored captain (tests stance choice)
  - 1 mini-boss encounter with 2 endings: defeat or spare
  - Post-combat scene: 1 NPC reacts differently based on defeat/spare
  - 5-minute total play time

What to fake:
  - World: one room, no exploration. Teleport to combat → teleport to NPC.
  - Art: low-poly with stance-color indicators (red/blue/green glow)
  - Progression: player has all 3 stances from start. No XP, no leveling.
  - Economy: no loot, no inventory
  - Story: only the post-combat NPC scene. No prior context.
  - Save: no save. Restart from beginning each test.

What NOT to fake (must be real):
  - Stance switching: must feel responsive, must visually telegraph
  - Enemy behavior: must react to player's stance (not just HP sponges)
  - Branching outcome: spare/kill must produce genuinely different NPC dialogue
  - Hit feedback: impact must feel weighty (not floaty)

Success criteria:
  - 5 playtesters all discover stance switching matters (not just spam one stance)
  - At least 3/5 choose to spare the mini-boss on first playthrough
    (indicating they felt the choice was meaningful, not just "kill everything")
  - At least 4/5 notice the NPC dialogue changed based on their choice
  - After playing, testers can describe WHY they chose their approach
    (indicating strategic decision, not random)

Failure looks like:
  - Players find one stance that works for everything (balance failure)
  - Players don't notice or care about spare/kill choice
  - Post-combat NPC scene feels disconnected from combat
  - Hit feedback doesn't differentiate between stances

Build time: 2 weeks
Dependencies: Basic combat system (exists), dialogue system (exists, needs branching hook)

Score:
  Validation Value:        2/2  (tests both combat depth AND narrative integration — the two risks)
  Implementation Feasibility: 1/2  (2 weeks, needs dialogue branching which is new)
  Player Signal Clarity:   2/2  (observe stance usage + spare/kill decision + post-combat reaction)
  Dependency Risk:         1/2  (needs existing combat + dialogue systems to be hookable)
  Scope Discipline:        2/2  (tight — 5 minutes, 1 encounter, 1 branch)
  TOTAL:                   8/10

Rejected alternatives:
  - Mechanic Prototype (6/10): Combat system already has basic proof.
    The risk isn't "is combat fun?" but "does combat connect to narrative?"
  - Vertical Slice (5/10): Too expensive (6+ weeks) for what we need to learn.
    Can't justify building exploration + full chapter when the question is
    specifically about combat-narrative integration.
═══════════════════════════════════════════════════
```
