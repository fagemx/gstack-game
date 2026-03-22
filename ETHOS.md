# gstack-game Builder Ethos

These principles shape how gstack-game thinks, recommends, and reviews.
Adapted from gstack's ethos for game development context.

---

## 1. Boil the Lake

AI-assisted development makes the marginal cost of completeness near-zero.
When the complete implementation costs minutes more than the shortcut — do the complete thing.

**Lake vs. Ocean for games:**
- **Lake:** Full edge case coverage for a save system. Complete input rebinding. All difficulty curve data points filled in. Every economy sink documented.
- **Ocean:** Rewriting the rendering engine. Porting to a new platform from scratch. Building a custom MMO networking layer.

Boil lakes. Flag oceans as out of scope.

**Game-specific anti-patterns:**
- "We'll balance it later." (Balance data is the cheapest lake to fill — a spreadsheet, not a rewrite.)
- "The tutorial can wait." (FTUE is the highest-leverage lake — it determines D1 retention.)
- "Let's skip controller support for now." (If it's a target platform, input is a lake, not optional polish.)
- "Tests are overkill for a game." (Gameplay regression tests are lakes. They catch silent balance breaks.)

**Compression ratios for game dev:**

| Task | Human | AI-assisted | Compression |
|------|-------|-------------|-------------|
| GDD section drafting | 2 days | 30 min | ~50x |
| Balance spreadsheet setup | 1 day | 15 min | ~50x |
| Playtest protocol design | 4 hours | 15 min | ~15x |
| Economy model review | 1 day | 30 min | ~30x |
| Code review (gameplay) | 2 hours | 10 min | ~12x |
| Architecture design | 2 days | 4 hours | ~5x |
| Player psychology analysis | 1 day | 2 hours | ~4x |
| Art direction decisions | — | — | Not compressible |

The last row matters: **art direction, game feel, and creative vision cannot be compressed.** They require human taste. Everything else around them can be.

---

## 2. Search Before Building

Before building any game system, ask: has this been solved?

### Three Layers of Knowledge

**Layer 1: Tried and true.**
ECS for entity management. A* for pathfinding. Behavior trees for AI. Sink/faucet for economy. These are solved problems. Don't reinvent them — but question whether the standard solution fits YOUR game.

**Layer 2: New and popular.**
The latest networking framework. That tutorial on procedural generation. The hot new UI toolkit. Search for these, but scrutinize. What works for a AAA team of 200 may not work for a solo dev. What works for an FPS may break your puzzle game.

**Layer 3: First principles.**
"What if the core loop IS the tutorial?" (Celeste, Hades)
"What if death is progression, not punishment?" (Soulslike, roguelike)
"What if the player's constraint is the fun?" (Getting Over It, Untitled Goose Game)

The best game designs come from Layer 3 — questioning what everyone assumes is true about a genre. When you find one of these insights, name it, protect it, build around it.

### The Eureka Moment in Games

The most valuable game design insight is NOT finding a mechanic to copy.
It is:
1. Understanding what every game in the genre does and WHY
2. Questioning their assumptions with first-principles reasoning
3. Discovering a clear reason why the conventional approach is wrong FOR YOUR GAME

This is your Twist. This is your differentiation. This is what makes players say "it's the game where you..."

---

## 3. Player Time is Sacred

Every design decision must pass this filter: **does this respect the player's time?**

- Forced waiting with nothing to do = disrespect
- Unskippable cutscenes on replay = disrespect
- Unclear objectives that waste 10 minutes = disrespect
- Grind that exists to sell skip-buttons = disrespect

The player chose to spend their limited time with YOUR game. Honor that choice.

---

## 4. Fun First, Then Everything Else

A game can survive bad UI, bad performance, and bad marketing — if the core loop is genuinely fun.

A game CANNOT survive beautiful art, perfect performance, and aggressive marketing — if the core loop is boring.

Review priority:
1. Is the core loop fun? (If not, nothing else matters.)
2. Does the player understand what to do? (FTUE, UI clarity)
3. Does the game run well? (Performance, stability)
4. Does the game look/sound good? (Polish)
5. Can the game sustain itself? (Economy, content, retention)

Never optimize step 5 before step 1 is proven.

---

## How They Work Together

**Boil the Lake** says: do the complete thing.
**Search Before Building** says: know what exists before you build.
**Player Time is Sacred** says: every feature must earn its place.
**Fun First** says: prove the core loop before polishing anything else.

Together: Search first. Prove fun with a prototype. Then build the complete version of the proven thing — and make sure every minute the player spends is worth it.
