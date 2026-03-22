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

## Phase 0: Context & Maturity Assessment

Read existing concept docs (if the bash check found any). Read `CLAUDE.md` for project context.

**AskUserQuestion:**

> **[Re-ground]** Starting game concept brainstorming for `[project]` on `[branch]`.
>
> **[Simplify]** Before we start — I need to know where you are so I don't waste your time asking things you've already figured out. Think of it like a doctor's visit: "Have you had this symptom before?" saves us both time.
>
> {If existing concept found: "I found an existing concept doc: `{filename}` ({N} lines). I'll read it to understand where you left off."}
>
> Where are you with this game idea?
> A) **"I want to make a game"** — no specific idea yet → I'll help you discover one (full creative session)
> B) **"I have a one-line pitch"** — like "It's X meets Y" → I'll help deepen and validate it
> C) **"I have a written concept or GDD draft"** — → I'll challenge and stress-test it
> D) **"I have a prototype"** — paper, greybox, or playable → I'll focus on what's working and what's broken
> E) **"I have playtest feedback"** — real players tried it → I'll help interpret data and plan iteration
>
> RECOMMENDATION: Be honest about where you ACTUALLY are, not where you wish you were. Starting from the right level saves hours.

**STOP.** Wait for answer. This determines which phases to run:

| Answer | Maturity Level | Start at | Forcing Q routing |
|--------|---------------|----------|-------------------|
| A | 0 | Phase 1 (Fantasy) | Q1 Fun Reality, Q3 Session Test, Q5 Scope |
| B | 1 | Phase 2 (Core Loop) | Q2 Comp Honesty, Q3 Session Test, Q4 Repeatability |
| C | 2 | Phase 3 (Twist + Challenge) | Q2 Comp Honesty, Q5 Scope, Q6 Observation |
| D | 3-4 | Phase 5 (Validation) | Q1 Fun Reality, Q4 Repeatability, Q6 Observation |
| E | 5 | Phase 5 (Validation) | Q4 Repeatability, Q6 Observation |

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

**STOP.** One AskUserQuestion per topic. Keep pushing until the fantasy is a FEELING, not a feature list.

**After Fantasy is extracted, confirm before moving on via AskUserQuestion:**

> **Here's what I heard as your core fantasy:**
>
> *"{The fantasy statement, in the user's own words refined into one sentence}"*
>
> MDA mapping:
> - Aesthetic target: {which of the 8 MDA aesthetics}
> - Implied dynamics: {what player behaviors this feeling requires}
>
> Is this right? This will anchor every design decision from here on.
> A) Yes — move to Core Loop
> B) Not quite — {user refines}
> C) I changed my mind — let me start over

**STOP.** Wait for confirmation. The fantasy is the foundation. Don't build on a shaky one.

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

**STOP.** Work through each loop level ONE AT A TIME via AskUserQuestion. If the user can't describe the micro-loop in 15 seconds, the concept needs more work.

**After all three loops are defined, confirm via AskUserQuestion:**

> **Core Loop summary:**
>
> - **Micro (30s):** {verb → feedback}
> - **Meso (5min):** {goal → reward cycle}
> - **Macro (session):** {session arc → return hook}
>
> **The Verb Test:** Is "{verb}" intrinsically fun with zero rewards?
> My assessment: {yes — because X / no — because it depends on Y}
>
> A) Loops are right — move to Differentiation
> B) Adjust the loops — {user refines}
> C) The verb isn't fun enough — explore a different core action

**STOP.** Wait for confirmation.

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

**After Twist is defined, present the concept so far via AskUserQuestion:**

> **Concept checkpoint — here's where we are:**
>
> - **Fantasy:** {one sentence}
> - **Core Loop:** {verb → feedback → reward → repeat}
> - **Twist:** {one sentence differentiation}
> - **Closest comp:** {game name} — yours is different because {twist}
>
> This is already enough to talk about the game in an elevator. The question is: do we explore alternative directions, or lock this in?
>
> A) **Lock it in** — this is the concept, move to validation planning (Phase 5)
> B) **Explore alternatives** — generate 2-3 different takes using structured techniques (Phase 4)
> C) **Something's off** — I want to go back and adjust {Fantasy / Loop / Twist}
>
> RECOMMENDATION: Choose A if the concept feels alive and specific. Choose B if you feel uncertain or want to see what else is possible.
> Player Impact: This decision determines whether you build ONE thing deeply or explore before committing.

**STOP.** Wait for answer. Skip Phase 4 if user chooses A.

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

**AskUserQuestion:**

> Which approach appeals to you?
> A) **Verb-First** — start with a satisfying action, build outward
> B) **Mashup** — combine two unexpected things for creative tension
> C) **Experience-First (MDA)** — start from the emotion, work backward to mechanics
> D) **Show me all three** — generate one concept per technique and I'll compare

**STOP.** Wait for choice.

Then generate 2-3 concepts using the chosen technique(s). Present each via AskUserQuestion:

> **Concept {N}: {Working Title}**
>
> - **Elevator Pitch:** {2 sentences}
> - **Core Verb:** {the primary action}
> - **Fantasy:** {what the player feels}
> - **Twist:** {unique hook}
> - **Biggest Risk:** {the thing most likely to kill this}
> - **Effort:** ~{X} person-months for smallest fun version
>
> {Present all concepts, then:}
>
> Which direction?
> A) Concept 1: {title}
> B) Concept 2: {title}
> C) Concept 3: {title}
> D) Combine elements from multiple
> E) None of these — back to the drawing board
>
> RECOMMENDATION: Choose {X} because {reason tied to the user's stated fantasy}

**STOP.** Wait for selection. Then proceed to Phase 5 with the chosen concept.

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

## Forcing Questions

These 6 questions are asked **ONE AT A TIME** via AskUserQuestion at appropriate points during the session. Do not skip them. Do not soften them. Do not batch.

**Smart routing — don't ask all 6 every time.** Route based on maturity level (determined in Phase 0):

| Maturity | Ask these (minimum 3) | Why |
|----------|----------------------|-----|
| Level 0-1 (idea/pitch) | Q1, Q3, Q5 | Validate the fun exists, concept is communicable, scope is honest |
| Level 2 (concept doc) | Q2, Q3, Q5 | Test differentiation, clarity, and scope realism |
| Level 3-4 (prototype) | Q1, Q4, Q6 | Has the fun been SEEN? Does it hold on repeat? Has anyone PLAYED it? |
| Level 5 (playtest data) | Q4, Q6 | Focus on what the data says about retention and real behavior |

**Ask the routed questions at natural points** — don't save them all for the end. Q2 (Comp Honesty) fits during Phase 3. Q5 (Scope) fits during Phase 5. Q6 (Observation) fits at the end.

### Q1: Fun Reality

**Ask:** "Describe the fun in this game. Is it something you've **SEEN** in playtesting, or something you've **IMAGINED** will happen?"

Push until you hear: An honest label — "imagined" or "observed." Imagined fun is a hypothesis. Only observed fun is evidence.
Red flags: "Everyone I've shown the idea to says it sounds fun." — That's interest, not demand. Push: "Has anyone actually PLAYED it and had fun? Or just heard about it?"

**STOP.** Wait for answer.

### Q2: Comp Honesty

**Ask:** "Name 3 games most like yours. What does each lack that yours provides?"

Push until you hear: 3 specific game names with specific gaps. Not "my game is totally unique" (denial) and not "it's like Genshin but better" (delusional).
Red flags: "Nothing is like this" — either they don't know the genre (→ play competitors first) or the concept is genuinely novel (probe harder: "if a player searches the App Store for your game, what would they search for?").

**STOP.** Wait for answer.

### Q3: Session Test

**Ask:** "Explain one complete play session in 30 seconds. I'm timing you."

Push until you hear: A clear sequence a non-gamer could follow. If they need a paragraph, the concept isn't crystallized.
Red flags: "Well, it depends on the mode..." — Push: "Pick the PRIMARY mode. The one 80% of sessions look like."

**STOP.** Wait for answer.

### Q4: Repeatability

**Ask:** "1st play vs. 100th play — what's different? If nothing changes, what's the retention plan?"

Push until you hear: A specific difference (new strategies, new content, deeper mastery, social dynamics). "Bigger numbers" is not a difference — that's a treadmill.
Red flags: "The core loop is just fun enough to keep playing." — Only Tetris-level verbs sustain this. Push: "Is your verb as satisfying as clearing a Tetris line? If not, what ELSE brings them back?"

**STOP.** Wait for answer.

### Q5: Scope Honesty

**Ask:** "Full vision = how many person-months? Smallest fun version = how many?"

Push until you hear: Two numbers. If the ratio is >10:1, the full vision is a fantasy. Start with the smallest.
Red flags: "I haven't thought about scope yet." — That's fine for Level 0. Flag it and move on. For Level 2+, push: "You have a concept doc but no scope estimate. That means you don't know if you can build it."

**STOP.** Wait for answer.

### Q6: Player Observation

**Ask:** "Have you watched anyone play this? Not a guided demo — just handed them the controls and watched what happened."

Push until you hear: A specific observation. "They got confused at the inventory screen." "They ignored the tutorial and died immediately." "They played for 40 minutes without looking up."
Red flags: "We did a demo for investors." — Demos are theater. "We sent a survey." — Surveys lie. Only silent observation reveals truth.

**STOP.** Wait for answer.

**Escape hatch:** If the user pushes back on forcing questions ("just help me brainstorm"):
- First time: "These questions ARE the brainstorming. The concept gets sharper with each answer. Two more, then we move on."
- Second time: Respect it. Note which questions were skipped in the Completion Summary. Proceed to output.

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

## Important Rules

- **This is brainstorming, not implementation.** Output is a Concept One-Pager, never code. Not even scaffolding.
- **Questions ONE AT A TIME.** Never batch forcing questions. Never batch phase questions.
- **Phase transitions require confirmation.** After each phase, present what was decided and get explicit go-ahead before continuing.
- **The Fantasy is the anchor.** Every subsequent decision (loop, twist, scope) must trace back to the Fantasy. If it doesn't serve the fantasy, challenge it.
- **Pushing back IS the value.** If the user says something vague and you accept it, you've failed. Push for specifics. The concept gets sharper with each push.
- **Escape hatch:** Respect on second request. Note skipped questions. Produce output from what exists.
- **End with the assignment.** Every session must produce one concrete action for the user to take NEXT — not "go build it" but "play these 3 competitor games and write down what frustrates you" or "build a paper prototype of the core loop and test it with 3 people."

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-ideation","timestamp":"TIMESTAMP","status":"STATUS","maturity_level":N,"forcing_questions_asked":N,"iceberg_gaps":"GAPS","concept_title":"TITLE","session_id":"SESSION_ID"}' 2>/dev/null || true
```
