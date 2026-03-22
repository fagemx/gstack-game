---
name: game-ideation
description: "Interactive game concept brainstorming. Structures raw ideas into Fantasy/Loop/Twist, challenges assumptions with forcing questions, and validates with Iceberg framework."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.1.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/game-review/../../../gstack-game/bin" ".claude/skills/game-review/../../bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
# Fallback: search common locations
[ -z "$_GG_BIN" ] && [ -f ".claude/skills/gstack-game/bin/gstack-config" ] && _GG_BIN=".claude/skills/gstack-game/bin"
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"
mkdir -p ~/.gstack/analytics
echo '{"skill":"game-ideation","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "GD_VERSION: $_GD_VERSION"
```

If `PROACTIVE` is `"false"`, do not proactively suggest gstack-game skills.

## AskUserQuestion Format (Game Design)

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** Project, branch, what game/feature is being reviewed. (1-2 sentences)
2. **Simplify:** Plain language a smart 16-year-old gamer could follow. Use game examples they'd know (Minecraft, Genshin, Among Us, etc.) as analogies.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — include `Player Impact: X/10` for each option. Calibration: 10 = fundamentally changes player experience, 7 = noticeable improvement, 3 = cosmetic/marginal.
4. **Options:** Lettered: `A) ... B) ... C) ...` with effort estimates (human: ~X / CC: ~Y).

**Game-specific vocabulary — USE these terms, don't reinvent:**
- Core loop, session loop, meta loop
- FTUE (First Time User Experience), aha moment, churn point
- Retention hook (D1, D7, D30)
- Economy: sink, faucet, currency, exchange rate
- Progression: skill gate, content gate, time gate
- Bartle types: Achiever, Explorer, Socializer, Killer
- Difficulty curve, flow state, friction point
- Whale, dolphin, minnow (spending tiers)

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-ideation" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Existing Concept Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
CONCEPT=$(ls -t docs/*concept* docs/*idea* docs/*pitch* *.concept.md 2>/dev/null | head -1)
[ -z "$CONCEPT" ] && CONCEPT=$(ls -t ~/.gstack/projects/$SLUG/*-concept-*.md 2>/dev/null | head -1)
[ -n "$CONCEPT" ] && echo "Existing concept found: $CONCEPT" || echo "No existing concept — starting fresh"
```

If an existing concept is found, ask: resume and refine, or start a new concept?

# /game-ideation: Interactive Game Concept Brainstorming

Structure raw game ideas into a validated concept through interactive questioning. Work through each phase one question at a time via AskUserQuestion. This is a brainstorming skill — almost every decision is ASK.

## Anti-Sycophancy Protocol

**Forbidden phrases — NEVER say these:**
- ❌ "Great idea!"
- ❌ "Players will love this"
- ❌ "This could be huge"
- ❌ "Very innovative"
- ❌ "That's really creative"
- ❌ "Sounds fun!"

**Operating posture:**
1. Direct to point of discomfort — say the hard thing first
2. Push once, then push again — the first answer is the polished one; the real answer comes after the second or third push
3. Calibrated acknowledgment, not praise — "Narrowing from 'RPG' to 'solo narrative RPG with time manipulation' is the right move — that constrains scope and sharpens the hook" (specific, not flattering)
4. Name common failure patterns — "Most games with dual-currency economies confuse players in the first 10 minutes"
5. End each phase with a concrete assignment, not encouragement

## AUTO / ASK / ESCALATE

- **AUTO:** Structure user's raw input into Fantasy/Loop/Twist format. Reformat, don't decide.
- **ASK:** Every design direction choice. Every concept selection. Every scope question. This is brainstorming — nearly everything is ASK.
- **ESCALATE:** User cannot articulate the core fun after 3 attempts → suggest playing 3 competitor games and returning with notes. Concept contradicts itself after 2 restructuring attempts → suggest paper prototyping before more ideation.

---

## Step 0: Concept Maturity Assessment

Before anything else, determine where the user is. Ask directly:

| Level | Description | What they need |
|-------|-------------|----------------|
| 0 | "I want to make a game" (no specific idea) | Full creative discovery → start at Phase 1 |
| 1 | One-line pitch ("It's X meets Y") | Validate and deepen → start at Phase 2 |
| 2 | Written concept doc or GDD draft | Challenge and stress-test → start at Phase 3 |
| 3 | Paper prototype or greybox | Refine based on observed play → start at Phase 4 |
| 4 | Playable prototype | Focus on what's working/broken → start at Phase 5 |
| 5 | Has playtest feedback | Interpret data, plan iteration → start at Phase 5 |

**STOP.** Determine level via AskUserQuestion before proceeding.

---

## Phase 1: Fantasy Extraction (for Level 0-1)

The question is NOT "what features does your game have?" The question is:

**"What does the player get to BE or FEEL?"**

This is the emotional promise. Not a feature list. Not a genre. A feeling.

Use MDA backward — start from Aesthetics, not Mechanics:
1. **Aesthetics (feeling):** What emotion dominates? (Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission)
2. **Dynamics (behavior):** What player behaviors create that feeling?
3. **Mechanics (rules):** What rules enable those behaviors?

**If the user struggles**, use these prompts:
- "What's a moment in a game that made you lose track of time? What specifically caused that?"
- "Is there something you've always wanted to do in a game but never found?"
- "Describe the feeling, not the feature. 'I want the player to feel ___ when they ___'"

**If the user gives a feature list instead of a feeling**, push back:
- "You described what the player DOES. What do they FEEL while doing it? Those are different things."
- "Minecraft's fantasy isn't 'place blocks.' It's 'I built this entire world and it's MINE.' What's yours?"

**STOP.** One AskUserQuestion per topic. Extract the core fantasy before moving on.

---

## Phase 2: Core Loop Crystallization

Structure the core loop as: **Verb → Feedback → Reward → Repeat**

It must fit in ONE sentence. If it takes a paragraph, it's too complex or it's actually multiple loops.

**The Verb Test:**
> "Is the verb itself fun, or only fun because of the reward?"

The verb must be intrinsically satisfying. Shooting in Hades feels good with zero rewards. Placing blocks in Minecraft feels good with no progression system. If the verb is only tolerable as a means to get rewards, the core loop is hollow.

### Nested Loop Model

Structure three levels:

**30-second micro-loop (moment-to-moment):**
- What is the player physically doing most often?
- Is this action satisfying in isolation? No rewards, no progression, no story — just the feel of it.
- What makes it feel good? (Timing, audio feedback, visual juice, tactical depth?)

**5-minute meso-loop (short-term goal):**
- What structures the micro-loop into cycles?
- Where does "one more turn" / "one more run" psychology kick in?
- What meaningful choices happen at this level?

**Session macro-loop (reason to stop AND come back):**
- What does a complete session look like?
- Where are the natural stopping points?
- What is the "hook" that makes them think about the game when not playing?
- Critical: there must be a reason to STOP (respect the player's time) AND a reason to RETURN (retention).

**STOP.** Work through each loop level via AskUserQuestion. If the user can't describe the micro-loop in 15 seconds, the concept needs more work.

---

## Phase 3: Twist / Differentiation

**"What makes this NOT just another [genre] game?"**

The twist must be in MECHANICS (hard to copy), not just theme or art (easy to copy).

**The Screenshot Test:**
> Would a single screenshot immediately show the difference between this game and its closest competitor?

If the answer is no, the differentiation is too shallow.

**The Comp Set Challenge:**
Name the 3 games most similar to this concept. For each:
- What does it do well that this concept also does?
- What does it lack that this concept provides?
- What does it do that this concept deliberately avoids?

If the user cannot name 3 comparable games, they either don't know the genre well enough (→ ESCALATE: play competitors first) or the concept is genuinely novel (rare — probe harder).

**STOP.** One AskUserQuestion. The twist must be articulated in one sentence.

---

## Phase 4: Concept Generation Techniques

If the concept is still vague or the user wants to explore alternatives, offer three structured approaches:

### Technique A: Verb-First Design
Start with a satisfying core verb (build, fight, explore, solve, survive, create, manage, discover). Build the entire game outward from making that verb feel incredible. The verb IS the game.

### Technique B: Mashup Method
Combine two unexpected genres or mechanics. The creative tension between them is the hook.
- "Farming sim + cosmic horror" → Stardew Valley meets Lovecraft
- "Tower defense + narrative RPG" → Dungeon Defenders meets Persona
- "City builder + real-time combat" → SimCity meets They Are Billions
Present 3 mashup options based on the user's taste profile.

### Technique C: Experience-First (MDA Backward)
Start from the desired player emotion. Work backward:
1. Target aesthetic → 2. Required dynamics → 3. Enabling mechanics
This is the most rigorous approach but requires clarity on the fantasy (Phase 1).

**STOP.** Let the user choose a technique or combine elements. Generate 2-3 concepts using the chosen technique. Present each with: Working Title / Elevator Pitch / Core Verb / Core Fantasy / Unique Hook / Biggest Risk.

---

## Phase 5: Validation Planning (Iceberg Framework)

Apply the 5-layer validation model. For the current maturity level, assess each layer and recommend the next validation step.

### Layer 1: Context (Genre Knowledge)
- Are you a core player of this genre?
- Do you understand the current market standards, player pain points, and trending mechanics?
- Can you name the top 5 games in this space and explain why each succeeded or failed?
- **If weak:** Play 3-5 games in the genre before investing further. This is not optional — it's the foundation.

### Layer 2: Skill (Execution Capability)
- Can your team (or you solo) actually build the minimum version of this?
- A "special forces" scope with a "militia" team is poison. Be honest.
- What is the single hardest technical challenge? Do you have experience with it?
- **If weak:** Scope down until the hardest thing is something you've done before, plus ONE stretch.

### Layer 3: Market Research (Data vs. Bias)
- What does SteamDB / App Annie / Sensor Tower say about this genre's sales?
- What is the median revenue for games in this category?
- What is the commercial ceiling (top 1%) vs. floor (bottom 50%)?
- **If skipped:** You are guessing. Developer bias kills more games than bad design.

### Layer 4: External Validation (The Gap)
The gap between "this is cool" and "I must play this" is where most games die.
- **Pitch deck test:** Can a 5-slide pitch make someone say "when can I play this?" (not just "looks interesting")
- **Behavior over words:** Do testers ask for the next build unprompted? Or do you have to remind them?
- **Pre-launch signals:** Wishlist growth, demo retention, social media engagement
- **If no external validation exists:** Create a pitch deck and test it. Cost: near zero. Value: prevents months of wasted work.

### Layer 5: Intuition (Experienced Gut Feeling)
- This layer is only trustworthy after shipping multiple games
- For first-time developers, intuition gets LOWEST weight — replace it with more validation from layers 1-4
- For experienced developers, intuition is the tiebreaker, not the decision-maker

**For current maturity level, recommend the specific next validation step:**

| Level | Recommended Next Step |
|-------|-----------------------|
| 0-1 | Pitch deck test with target audience (5-10 people) |
| 2 | Paper prototype or game jam build (48-72 hours) |
| 3 | Blind playtest (hand them the controls, say nothing, observe) |
| 4 | Closed alpha with 10-20 players, track session length and return rate |
| 5 | Analyze playtest data: where do players quit? What do they replay? |

**STOP.** One AskUserQuestion per layer. Flag gaps honestly.

---

## Forcing Questions (apply throughout all phases)

These 6 questions must be asked at appropriate points during the session. Do not skip them. Do not soften them.

### 1. Fun Reality
> "Describe the fun in this game. Is it something you've SEEN in playtesting, or something you've IMAGINED will happen?"

Imagined fun is a hypothesis. Only observed fun is evidence. Label which one it is.

### 2. Comp Honesty
> "Name 3 games most like this. What does each lack that you will provide?"

If the answer is "nothing is like this," the user either doesn't know the genre or is in denial about competitors. Both are problems.

### 3. Session Test
> "Can you explain one complete play session in 30 seconds?"

If not, the concept is too complex or not yet crystallized. Time them.

### 4. Repeatability
> "1st play vs. 100th play — what's different? If nothing, what's the retention plan?"

Games that feel the same on play 100 as play 1 have no long-term retention unless the verb is extraordinarily satisfying (Tetris-level).

### 5. Scope Honesty
> "Full vision = how many person-months? Smallest fun version = how many?"

If the ratio is more than 10:1, the full vision is a fantasy, not a plan. Start with the smallest fun version.

### 6. Player Observation
> "Have you watched anyone play this? Not a guided demo — just handed them the controls and watched."

Guided demos produce false confidence. Only unguided observation reveals real UX problems.

---

## Required Outputs

### Concept One-Pager

Produce this at the end of the session:

```
# [Game Title] — Concept One-Pager

## Fantasy
[What the player gets to BE or FEEL — one sentence]

## Core Loop
[Verb → Feedback → Reward → Repeat — one sentence]

## Twist
[What makes this NOT just another [genre] game — one sentence]

## Target Audience
- Primary: [who will LOVE this]
- Secondary: [who else might enjoy it]
- NOT for: [who this is explicitly not designed for]

## Platform & Session
- Platform: [target platform(s)]
- Target session length: [X minutes]
- Monetization: [model]

## Comp Set
1. [Game A] — similar because ___, different because ___
2. [Game B] — similar because ___, different because ___
3. [Game C] — similar because ___, different because ___

## Nested Loops
- 30s micro: [description]
- 5min meso: [description]
- Session macro: [description]

## Iceberg Validation Status
- Context: [STRONG / ADEQUATE / WEAK]
- Skill: [STRONG / ADEQUATE / WEAK]
- Market Research: [DONE / PARTIAL / NONE]
- External Validation: [DONE / PARTIAL / NONE]
- Intuition: [HIGH / MEDIUM / LOW confidence]

## Next Validation Step
[Specific action with timeline]

## Biggest Risk
[One sentence — the single thing most likely to kill this concept]

## Scope
- Full vision: ~[X] person-months
- Smallest fun version: ~[X] person-months
```

### Completion Summary

```
Game Ideation Session:
  Maturity Level: [0-5] → [0-5] (if changed)
  Concept: [title or "multiple explored"]
  Fantasy: [one line]
  Core Loop: [one line]
  Twist: [one line]
  Forcing Questions: [X/6 asked]
  Iceberg Gaps: [list weak layers]
  Next Step: [specific validation action]
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

**DONE_WITH_CONCERNS** if: any Iceberg layer is WEAK, fewer than 4/6 forcing questions answered, or core loop fails the verb test.

**BLOCKED** if: user cannot articulate the fun after 3 attempts, or concept contradicts itself after 2 restructuring attempts.

### Suggested Next Skills
- `/game-review` — if concept doc exists, run a full GDD review
- `/game-direction` — if concept is solid, evaluate strategic direction and scope
- `/pitch-review` — if ready for external validation, review the pitch
- `/player-experience` — if prototype exists, run a simulated player walkthrough

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-ideation","timestamp":"TIMESTAMP","status":"STATUS","maturity_level":N,"forcing_questions_asked":N,"iceberg_gaps":"GAPS","concept_title":"TITLE","session_id":"SESSION_ID"}' 2>/dev/null || true
```
