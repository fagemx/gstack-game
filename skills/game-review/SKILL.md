---
name: game-review
description: "Interactive game design document review. Evaluates core loop, progression, retention, economy, and player motivation through structured AskUserQuestion flow."
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
echo '{"skill":"game-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
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
  --skill "game-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Design Doc Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD found: $GDD" || echo "No GDD found"
```

If no GDD found, offer `/game-import` first (to convert an external document), or `/game-ideation` (to brainstorm from scratch).

---

# /game-review: Game Design Document Review

Review a game design document interactively. Work through each section one issue at a time via AskUserQuestion. Every recommendation includes WHY and a concrete alternative. No vague praise — specific critique with actionable fixes.

## Anti-Sycophancy Protocol

**FORBIDDEN PHRASES — never use these or any paraphrase:**
- "This mechanic is really fun!"
- "Players will love this"
- "The art style is unique"
- "This will go viral"
- "Great design choice"
- "This is a solid foundation"
- "Interesting approach"

**CALIBRATED ACKNOWLEDGMENT — use this instead:**
- Name the specific design decision and WHY it works mechanically: "The cooldown reset on kill creates a snowball dynamic that rewards aggressive play — this matches the stated 'high-risk high-reward' pillar."
- If something is genuinely well-designed, describe the mechanical reason it works, never just say it's "good" or "interesting."

**PUSH-BACK CADENCE:**
1. Push once: State the concern directly.
2. Push again: If the designer's response is vague ("we'll tune it later"), ask for the specific tuning plan, target values, and validation method.
3. Escalate: If still vague after two pushes, flag as ESCALATE — "This needs a concrete plan before the GDD can be considered complete."

---

## Step 0: Genre, Context & Mode Selection

Before reviewing, establish these four anchors. If ANY are missing from the GDD, ask the user before proceeding — they frame every subsequent judgment.

1. **Genre & platform** — What kind of game, where does it run?
2. **Target session length** — 2 min mobile? 30 min PC? 4 hour tabletop?
3. **Monetization model** — Premium, F2P, ad-supported, subscription, cosmetic-only?
4. **Target audience** — Casual, mid-core, hardcore? Age range? Existing genre fans or new audience?
5. **Design pillars** — 3-5 non-negotiable creative principles. If none stated, flag as ESCALATE: "No pillars defined — review cannot validate design coherence without them."

### Mode Selection

After establishing context, ask the user to select a review mode. Each mode adjusts section weights and emphasis.

**AskUserQuestion:**

> **[Re-ground]** Reviewing `[GDD name]` for `[game title]` on `[branch]`.
>
> **[Simplify]** Different types of games have different priorities. A mobile gacha game lives or dies on its economy; a narrative PC game lives or dies on pacing. Choose the mode that matches your game so the review focuses on what matters most.
>
> **RECOMMENDATION:** Choose the mode matching your primary platform and genre. If unsure, Mode A for mobile, Mode B for PC/console.
>
> - **A) Mobile / Casual** — Heavy weight on retention hooks (D1/D7/D30), economy balance, session length fit, monetization ethics. Core loop must complete in <2 min. Player Impact: 9/10 if F2P.
> - **B) PC / Console** — Heavy weight on core loop depth, progression mastery curve, narrative integration, session arc. Economy is secondary unless live-service. Player Impact: 9/10 if premium.
> - **C) Multiplayer / Competitive** — Heavy weight on balance fairness, matchmaking, counterplay, ranked progression, anti-cheat surface. Economy evaluated for pay-to-win risk. Player Impact: 9/10 if PvP-centric.
> - **D) Narrative** — Heavy weight on pacing, branching coherence, emotional arc, ludonarrative consonance, choice consequence. Economy and retention secondary. Player Impact: 9/10 if story-driven.
> - **E) Tabletop / Physical** — Heavy weight on rules clarity, component ergonomics, session length predictability, player count scaling, setup/teardown time. No digital economy concerns. Player Impact: 9/10 if physical game.

### Mode Weight Adjustments

| Section | A: Mobile | B: PC/Console | C: Multiplayer | D: Narrative | E: Tabletop |
|---------|-----------|---------------|----------------|--------------|-------------|
| 1. Core Loop | 25% | 30% | 25% | 15% | 25% |
| 2. Progression & Retention | 25% | 20% | 15% | 15% | 15% |
| 3. Economy | 25% | 10% | 20% | 5% | 10% |
| 4. Player Motivation | 10% | 15% | 15% | 30% | 20% |
| 5. Risk Assessment | 5% | 10% | 10% | 10% | 10% |
| 6. Cross-Consistency | 10% | 15% | 15% | 25% | 20% |

---

## Section 1: Core Loop (核心循環)

### Nested Loop Model

Evaluate the GDD for explicit definition of ALL four loop tiers:

| Loop Tier | Timescale | What It Delivers | Example (Hades) |
|-----------|-----------|------------------|-----------------|
| **Micro-loop** | 10-30 seconds | Single satisfying action cycle | Attack → dodge → special → pick up reward |
| **Meso-loop** | 5-15 minutes | Goal-reward cycle within a session | Clear a room sequence → choose boon → advance |
| **Macro-loop** | Full session | Complete session arc with closure | Full run attempt → death → mirror upgrades |
| **Meta-loop** | Days/weeks | Long-term progression and mastery | Unlock weapons → deepen NPC relationships → reveal story |

### MDA Framework Check

Design must flow BACKWARD from Aesthetics:
1. What should the player FEEL? (target Aesthetics from the 8 MDA categories: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission)
2. What player BEHAVIORS produce that feeling? (Dynamics)
3. What RULES generate those behaviors? (Mechanics)

**If the GDD starts with mechanics and never states target feelings: -3 points.** This is designing forward (mechanic-first) instead of backward (experience-first).

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Clarity** | 0-2 | Can describe core loop in one sentence using "verb → feedback → reward → repeat" format. 2 = crystal clear, 1 = understandable but wordy, 0 = unclear or missing |
| **Session Fit** | 0-2 | Loop completion fits target session length. 2 = natural stopping point within target, 1 = roughly fits but has dead time or overruns, 0 = mismatch (e.g., 20-min loop for a 2-min mobile session) |
| **Depth** | 0-2 | Mastery comes from doing the loop BETTER, not just more. 2 = clear skill ceiling with discoverable techniques, 1 = some depth but mostly linear, 0 = flat repetition with no skill expression |
| **Fail State** | 0-2 | Failure is interesting, not just punishing. 2 = failure teaches something and creates interesting decisions, 1 = failure is tolerable but generic (respawn, retry), 0 = no fail state described OR failure is purely punitive |
| **Uniqueness** | 0-2 | The "It's the game where you..." test. 2 = describable unique verb/mechanic a player would tell a friend, 1 = recognizable genre execution with a twist, 0 = generic description indistinguishable from competitors |

**Section 1 Score: ___/10**

### Forcing Questions (must ask at least 2)

1. "Describe the core loop in exactly one sentence using the format: **verb → feedback → reward → repeat.**" — If the designer cannot do this, the loop is not clear enough.
2. "What is the 30-second micro-loop? Is it intrinsically fun with ZERO rewards?" — Strip away progression, currency, unlocks. Is the raw action satisfying? Tetris line clears feel good with no XP. If the micro-loop requires extrinsic reward to be engaging, it is a treadmill, not a game.
3. "What does the player do on the 100th repetition that they didn't do on the 1st?" — Tests for depth. If the answer is "nothing different, just bigger numbers," depth score is 0.
4. "What happens in the 5 seconds after the player fails?" — Tests fail state design. Good: Spelunky shows the ghost of your run. Bad: "Game Over, return to menu."

### Action Classification

- **AUTO:** Flag naming inconsistencies (loop described differently in different sections), missing fail state description, loop timescale math errors (stated "2-minute loop" but described steps total 8+ minutes)
- **ASK:** Core loop changes (adding/removing a verb), session length mismatch requiring redesign, depth concerns
- **ESCALATE:** No core loop defined at all. GDD describes features but never the moment-to-moment play. Review CANNOT proceed without this.

**STOP.** Present ONE issue at a time via AskUserQuestion. Proceed only after all Section 1 issues are resolved or deferred.

---

## Section 2: Progression & Retention (進度與留存)

### SDT Integration at Each Retention Tier

Every retention hook must satisfy at least one Self-Determination Theory need:

| Retention Tier | Timeframe | SDT Need to Satisfy | Example |
|----------------|-----------|---------------------|---------|
| **FTUE** | First 60 seconds | **Competence** — "I can do this" | Tutorial rewards first correct action immediately |
| **D1 (come back tomorrow)** | 0-24 hours | **Autonomy** — "I want to try MY strategy" | Unfinished build, unanswered question, untried path |
| **D7 (weekly habit)** | 1-7 days | **Competence** — "I'm getting better" | Visible skill growth, new abilities earned, mastery milestones |
| **D30 (invested identity)** | 7-30 days | **Relatedness** — "This is MY world/team/character" | Social bonds, reputation, sunk-cost identity, community |

### Flow State Design

Check for **sawtooth difficulty curve**: tension builds → milestone release → re-engage at higher baseline.

**Red flags:**
- Flat difficulty = boredom (player coasts without challenge)
- Vertical spike = frustration (sudden difficulty wall with no preparation)
- No difficulty curve described = the GDD assumes difficulty "just works" (it never does)

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **FTUE Quality** | 0-2 | Time to first meaningful action documented AND < benchmark (30s mobile, 2min PC, 5min complex strategy). 2 = explicit plan with timing, 1 = described but no timing target, 0 = not addressed |
| **Retention Hooks** | 0-3 | D1, D7, D30 hooks explicitly identified. 1 point each. 0 if the GDD says "players will want to come back" without specifying WHY |
| **Difficulty Curve** | 0-2 | Explicit difficulty progression plan. 2 = sawtooth pattern with milestone releases described, 1 = general "difficulty increases" statement, 0 = not addressed |
| **Churn Point Analysis** | 0-3 | Top 3 likely quit points identified with mitigation plan. 1 point per identified churn point with specific mitigation. 0 if churn points not considered |

**Section 2 Score: ___/10**

### Reference Benchmarks

| Metric | Good | Average | Problem |
|--------|------|---------|---------|
| FTUE to first action | <30s (mobile), <2min (PC) | 30-60s / 2-5min | >60s / >5min |
| D1 retention | 40%+ | 25-40% | <25% |
| D7 retention | 15%+ | 8-15% | <8% |
| D30 retention | 5%+ (F2P), 20%+ (premium) | 3-5% / 10-20% | <3% / <10% |
| Session length vs target | Within ±20% | Within ±50% | >2x or <0.5x target |

### Forcing Questions (must ask at least 2)

1. "A player finishes their first session and closes the app. Name the SPECIFIC thing that makes them open it again tomorrow." — Not "they'll want to see what happens next" (vague), but "they have 3 unclaimed daily rewards and their base is still upgrading" (specific).
2. "Where does the player most likely quit FOREVER? What is the specific plan to prevent that?" — Every game has a churn cliff. If the GDD doesn't know where it is, it hasn't thought about retention.
3. "Does challenge scale with SKILL or with TIME PLAYED?" — Skill gates (get better to progress) create mastery satisfaction. Time gates (grind more to progress) create obligation. The GDD should know which it's using and why.

### Action Classification

- **AUTO:** FTUE timing exceeds benchmark without justification, retention hooks described inconsistently across sections
- **ASK:** Difficulty curve design choices, content gate vs skill gate decisions, churn mitigation strategies
- **ESCALATE:** No retention hooks identified at all. GDD assumes players will "just keep playing."

**STOP.** One issue per AskUserQuestion.

---

## Section 3: Economy & Monetization (經濟系統)

### Sink/Faucet Model

The GDD MUST map resource flows explicitly. For each currency:

```
FAUCETS (sources)              SINKS (drains)
─────────────────              ──────────────
Quest rewards     ──→  [Currency Pool]  ──→  Item purchases
Daily login       ──→                   ──→  Upgrade costs
Battle drops      ──→                   ──→  Repair/maintenance
IAP               ──→                   ──→  Gacha/loot boxes
                                        ──→  Trading fees
                                        ──→  Expiration/decay
```

If the GDD has no sink/faucet map: **-3 points.** An economy without mapped flows WILL break.

### Reward Psychology

Check which reinforcement schedules the economy uses:

| Schedule | Pattern | Effect | Example |
|----------|---------|--------|---------|
| **Fixed Ratio** | Every N actions → reward | Predictable grind | 10 kills = 1 level up |
| **Variable Ratio** | Random chance per action → reward | Most addictive, use carefully | Loot drops, gacha |
| **Fixed Interval** | Every N minutes → reward | Creates routine | Daily login bonus |
| **Variable Interval** | Random timing → reward | Maintains vigilance | Random world events |

**The GDD should be INTENTIONAL about which schedules it uses.** If the economy accidentally relies on variable ratio for core progression, flag as ASK — this can create addiction patterns that harm player wellbeing.

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Currency Clarity** | 0-2 | Number of currencies and exchange rates. 2 = ≤3 currencies with intuitive exchange, 1 = 4-5 currencies or unclear exchange, 0 = 6+ currencies OR no exchange rate defined |
| **Sink/Faucet Balance** | 0-3 | Explicit flow model. 3 = full map with equilibrium analysis, 2 = sinks and faucets listed but not balanced, 1 = only faucets described (no sinks), 0 = no economy flow model |
| **Monetization Ethics** | 0-3 | 3 = clear ethical boundaries stated, F2P experience is genuinely fun, no pay-to-win in competitive contexts. 2 = mostly fair but some grey areas. 1 = concerning patterns (first IAP before aha moment, hard currency pay-only). 0 = predatory patterns or not addressed |
| **Spending Tier Health** | 0-2 | 2 = value proposition for minnow/dolphin/whale tiers all make sense. 1 = one tier is poorly served. 0 = whale-dependent design or no tier analysis |

**Section 3 Score: ___/10**

### Economy Red Flags (each is -1 from Sink/Faucet or Monetization score)

- More than 3 currencies without clear purpose → cognitive overload
- No meaningful sinks → hyperinflation, everything becomes worthless
- First IAP offered before aha moment → premature monetization
- Hard currency ONLY obtainable by paying → pay-to-win perception
- No pity system for gacha/probabilistic rewards → player frustration spiral
- Gini coefficient not considered → wealth gap makes late-joiners feel hopeless
- Reward schedule not documented → economy runs on accident, not design
- "Surprise mechanics" language used to obscure loot box mechanics → ethical flag

### Forcing Questions (must ask at least 2)

1. "A player has been playing for 30 days without spending money. Describe their exact resource state — how much currency do they have, what can they buy, what are they locked out of?" — If the designer can't answer this, the economy isn't designed, it's hoped.
2. "What breaks first if players earn 2x the intended currency rate?" — Tests whether the economy has safety valves. If "nothing, they'd just progress faster," then sinks are missing.
3. "What is the FIRST thing a player is asked to spend real money on, and have they had their aha moment yet?" — Monetizing before delight is extractive.

### Action Classification

- **AUTO:** Currency naming inconsistencies, math errors in stated earn rates vs costs, exchange rate contradictions
- **ASK:** Monetization model choices, gacha/loot box inclusion, premium currency pricing
- **ESCALATE:** Economy has no sinks (guaranteed hyperinflation), OR monetization targets minors with predatory patterns

**STOP.** One issue per AskUserQuestion.

---

## Section 4: Player Motivation & Emotion (玩家動機)

### Full SDT Analysis

For EACH major game system, evaluate whether it serves Autonomy, Competence, or Relatedness:

| System | Autonomy (meaningful choice) | Competence (skill growth) | Relatedness (connection) |
|--------|------------------------------|---------------------------|--------------------------|
| Core loop | Does the player choose HOW to engage? | Does skill improve outcomes? | Is there shared experience? |
| Progression | Multiple viable paths? | Clear mastery markers? | Social comparison/cooperation? |
| Economy | Spending choices matter? | Earning efficiency improves with skill? | Trading/gifting possible? |
| Social | Player-driven interactions? | Skill-based social status? | Meaningful bonds formed? |

**A system that serves ZERO SDT needs is a system that doesn't motivate.** Flag any such system as ASK.

### Player Type Coverage (Bartle + Quantic Foundry)

**Bartle Taxonomy:**

| Type | What They Want | What the GDD Offers (fill in) |
|------|---------------|-------------------------------|
| **Achiever** | Goals, completion, progression, visible milestones | ___ |
| **Explorer** | Discovery, hidden content, systemic depth, knowledge | ___ |
| **Socializer** | Cooperation, shared experience, community, identity | ___ |
| **Competitor** | Fair PvP, rankings, skill expression, meaningful stakes | ___ |

**Quantic Foundry Motivations** (more granular):

Check which of these 6 clusters the GDD serves:
- **Action** (destruction, excitement) — Does the game deliver visceral thrills?
- **Social** (competition, community) — Does the game create social bonds or rivalries?
- **Mastery** (challenge, strategy) — Does the game reward thinking and skill?
- **Achievement** (completion, power) — Does the game satisfy collectors and completionists?
- **Immersion** (fantasy, story) — Does the game transport the player somewhere?
- **Creativity** (design, discovery) — Does the game let players express themselves?

**The GDD doesn't need to serve ALL types, but it MUST know which types it's targeting and which it's explicitly NOT serving.**

### Ludonarrative Consonance Check

Do the mechanics reinforce the narrative, or contradict it?

| Test | Pass | Fail |
|------|------|------|
| Theme ↔ Mechanics | Story says "choices matter" AND mechanics have meaningful branching | Story says "choices matter" BUT all paths lead to same outcome |
| Tone ↔ Feel | Dark narrative AND weighty, consequential mechanics | Dark narrative BUT bouncy, forgiving mechanics (unless intentional contrast) |
| Character ↔ Abilities | Player character is described as weak/vulnerable AND gameplay reflects this | Character described as weak BUT player is a one-hit-kill powerhouse |
| World ↔ Systems | World has scarce resources AND economy reflects scarcity | World described as post-apocalyptic BUT shops are fully stocked |

**Intentional dissonance is valid IF the GDD acknowledges and justifies it.** Unintentional dissonance is a design flaw.

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **SDT Coverage** | 0-3 | Each SDT need (Autonomy, Competence, Relatedness) served by at least one core system = 1 point each. 0 for any unserved need |
| **Player Type Targeting** | 0-3 | Target player types explicitly identified = 1 point. Systems designed for those types = 1 point. Non-target types acknowledged = 1 point |
| **Ludonarrative Consonance** | 0-2 | 2 = mechanics and narrative reinforce each other (or intentional dissonance is justified). 1 = minor contradictions. 0 = major unacknowledged dissonance |
| **Emotional Arc** | 0-2 | 2 = session emotional arc explicitly mapped (tension/release/climax/resolution). 1 = general mood described but no arc. 0 = no emotional design consideration |

**Section 4 Score: ___/10**

### Forcing Questions (must ask at least 2)

1. "Which Bartle type does this game serve WORST, and what happens when that player type tries your game?" — Forces the designer to think about who the game ISN'T for, which clarifies who it IS for.
2. "Name a specific moment in the game where the player feels powerful. Now name a moment where they feel vulnerable. How far apart are these moments?" — Tests emotional range. Games with no vulnerability have no tension. Games with no power have no satisfaction.
3. "If the game's story says X, do the mechanics also say X? Give a specific example." — Ludonarrative consonance test. If the designer can't give an example, the mechanics and narrative are probably disconnected.

### Action Classification

- **AUTO:** Player type terminology inconsistencies, MDA aesthetic labels used incorrectly
- **ASK:** Which player types to target, emotional arc design, SDT trade-offs between systems
- **ESCALATE:** GDD has no concept of target player motivation — mechanics exist without any stated purpose for WHY a player would engage

**STOP.** One issue per AskUserQuestion.

---

## Section 5: Risk Assessment (風險評估)

### Risk Matrix

For EACH identified risk, evaluate on two axes:

| | Minor (annoyance) | Significant (friction) | Critical (game-breaking) |
|---|---|---|---|
| **High probability** | MEDIUM | HIGH | CRITICAL |
| **Medium probability** | LOW | MEDIUM | HIGH |
| **Low probability** | IGNORE | LOW | MEDIUM |

### Standard Risk Categories

Evaluate the GDD against these risk categories. Each applies differently per review mode.

**1. Design Pillar Violation Risk**
Does any designed feature CONTRADICT a stated design pillar?
- Example: Pillar says "player agency in every encounter" but a cutscene removes control for 2 minutes
- Example: Pillar says "fair competition" but paid items have stat bonuses
- **If pillars are not defined, this entire category is ESCALATE**

**2. Scope Risk — Lake vs Ocean Test**
- **Lake:** Bounded scope, clear bottom, knowable size. "10 levels with 3 enemy types each."
- **Ocean:** Unbounded scope, unknown depth, grows as you explore. "Procedurally generated infinite world with emergent narratives."
- Most failed indie games are Oceans that thought they were Lakes.
- **Forcing Q:** "Can you list every piece of content this game needs to be shippable? If the list has 'etc.' or '...' anywhere, it's an Ocean."

**3. Technical Feasibility Risk**
Does any mechanic require technology the team hasn't proven?
- Netcode for real-time multiplayer
- Procedural generation at scale
- AI-driven narrative
- Cross-platform save sync

**4. Market Differentiation Risk**
Can you describe this game without using the name of another game?
- "It's like X but Y" is a starting point, not a destination
- What is the ONE thing a player would describe to a friend?

**5. Retention Cliff Risk**
Where is the most likely point where players quit and never return?
- End of tutorial (didn't hook)
- First paywall (felt unfair)
- Content drought (ran out of things to do)
- Difficulty wall (couldn't progress)

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Risk Identification** | 0-3 | 3 = risks identified across all 5 categories with probability/impact ratings. 2 = most categories covered. 1 = only obvious risks listed. 0 = no risk analysis |
| **Mitigation Specificity** | 0-3 | 3 = every high+ risk has a specific mitigation plan with timeline. 2 = mitigations exist but are vague ("we'll playtest"). 1 = mitigations for some risks only. 0 = no mitigations |
| **Pillar Coherence** | 0-2 | 2 = no feature contradicts stated pillars, OR contradictions are acknowledged with justification. 1 = minor pillar tensions unaddressed. 0 = major pillar violations OR no pillars to check against |
| **Scope Realism** | 0-2 | 2 = scope is Lake-sized with concrete content list. 1 = scope is ambitious but bounded. 0 = scope is Ocean-sized with no cut plan |

**Section 5 Score: ___/10**

### Forcing Questions (must ask at least 2)

1. "List every piece of content needed to ship. If your list contains '...' or 'etc.' or 'and more,' it's an Ocean, not a Lake." — Tests scope realism.
2. "What is the ONE feature you would cut if you had to ship 3 months early? What breaks without it?" — Tests understanding of feature dependencies and priorities.
3. "Name one mechanic that contradicts a design pillar. If you can't find one, you haven't looked hard enough." — Forces honest pillar-violation audit.

### Action Classification

- **AUTO:** Risk probability/impact labels missing, mitigation plans that say "TBD" (flag for completion)
- **ASK:** Risk mitigation strategies, scope reduction decisions, pillar violation trade-offs
- **ESCALATE:** Ocean-sized scope with no cut plan AND no stated MVP, OR critical risks with zero mitigation

**STOP.** One issue per AskUserQuestion.

---

## Section 6: Cross-Section Consistency Check (跨段交叉驗證)

This section does NOT introduce new evaluation criteria. It cross-validates findings across Sections 1-5 to find contradictions invisible within any single section.

### Cross-Validation Matrix

| Intersection | What to Check | Red Flag Example |
|---|---|---|
| **Core Loop × Economy** | Does the loop generate currency at the rate the economy expects? | Loop takes 30s but economy assumes 5-min earning cycles |
| **Core Loop × Motivation** | Does the loop serve the stated target player types? | Targets Explorers but loop is linear with no discovery |
| **Progression × Economy** | Do progression gates align with spending opportunities? | Progression requires items only available via IAP at level 5, before D1 retention hook |
| **Progression × Motivation** | Do progression rewards match player type needs? | Achiever-targeted game but progression rewards are cosmetic-only (no measurable milestones) |
| **Economy × Retention** | Do monetization touchpoints align with retention hooks? | Paywall hits at the exact churn point instead of at a delight peak |
| **Motivation × Risk** | Do identified player types have risks addressed? | Targets Socializers but no plan for toxic behavior |
| **Risk × Core Loop** | Do core loop risks have system-level mitigations? | Core loop depends on real-time multiplayer but no offline fallback for connection issues |
| **Pillars × Everything** | Does every section's design trace back to at least one pillar? | Section 3 economy design serves no stated pillar |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Internal Consistency** | 0-4 | Start at 4. Deduct 1 for each cross-section contradiction found (max -4) |
| **Pillar Traceability** | 0-3 | 3 = every major design decision traces to a pillar. 2 = most do. 1 = some decisions seem arbitrary. 0 = no pillar connection visible |
| **System Coherence** | 0-3 | 3 = all systems reinforce each other (positive coherence). 2 = systems are independent but not contradictory. 1 = some systems work against each other. 0 = systems actively undermine each other |

**Section 6 Score: ___/10**

### Action Classification

- **AUTO:** Terminology inconsistencies across sections (e.g., "gold" in Section 1, "coins" in Section 3 for the same currency)
- **ASK:** Cross-section design tensions that require a design decision to resolve
- **ESCALATE:** Fundamental contradictions between core loop and economy, or between stated pillars and actual design

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### GDD Health Score

Calculate after all sections are reviewed. Show individual scores AND deduction reasons for transparency.

```
GDD Health Score (Mode: [A/B/C/D/E])
═══════════════════════════════════════════════
  Section 1 — Core Loop:           _/10  (weight: __%)  → weighted: _.___
  Section 2 — Progression:         _/10  (weight: __%)  → weighted: _.___
  Section 3 — Economy:             _/10  (weight: __%)  → weighted: _.___
  Section 4 — Player Motivation:   _/10  (weight: __%)  → weighted: _.___
  Section 5 — Risk Assessment:     _/10  (weight: __%)  → weighted: _.___
  Section 6 — Cross-Consistency:   _/10  (weight: __%)  → weighted: _.___
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:                  _._/10

Score Interpretation:
  8.0-10.0  SHIP-READY — GDD is comprehensive, internally consistent, ready for production
  6.0-7.9   SOLID — Good foundation, address flagged issues before full production
  4.0-5.9   NEEDS WORK — Significant gaps that will cause problems in production
  2.0-3.9   MAJOR REVISION — Fundamental design questions unanswered
  0.0-1.9   START OVER — Not a GDD yet, more of a concept note

Top 3 Deductions (biggest point losses):
  1. [Section] [Criterion]: -N because [specific reason]
  2. [Section] [Criterion]: -N because [specific reason]
  3. [Section] [Criterion]: -N because [specific reason]
```

### Completion Summary

```
/game-review Completion Summary
═══════════════════════════════════
Mode: [A/B/C/D/E] — [Mobile/PC/Multiplayer/Narrative/Tabletop]
GDD: [filename]
Branch: [branch]

Section Results:
  Step 0: Genre & Context — [established / missing items]
  Section 1 — Core Loop:         _/10, ___ issues found, ___ resolved, ___ deferred
  Section 2 — Progression:       _/10, ___ issues found, ___ resolved, ___ deferred
  Section 3 — Economy:           _/10, ___ issues found, ___ resolved, ___ deferred
  Section 4 — Player Motivation: _/10, ___ issues found, ___ resolved, ___ deferred
  Section 5 — Risk Assessment:   _/10, ___ risks identified, ___ high-impact
  Section 6 — Cross-Consistency: _/10, ___ contradictions found

WEIGHTED TOTAL: _._/10

Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All sections reviewed, all critical issues resolved, GDD Health Score ≥ 6.0
- **DONE_WITH_CONCERNS** — All sections reviewed, some issues deferred, GDD Health Score 4.0-5.9
- **BLOCKED** — Review could not complete due to ESCALATE items (missing core loop, no pillars, fundamental contradictions)
- **NEEDS_CONTEXT** — Review paused because critical context is missing (no target audience, no monetization model, etc.)

### Playtest Protocol

Write a playtest observation guide based on review findings:

- **Key moments to watch:** First 30s (FTUE), first fail, first purchase prompt, first session end, each identified churn point from Section 2
- **Questions to ask after:** "What was the most fun part?" / "When were you confused?" / "Would you play again tomorrow? Why specifically?" / "What would you tell a friend this game is about?"
- **Metrics to track:** Session length, quit points, currency earned vs spent, feature discovery rate, D1 return rate
- **Red flag behaviors:** Player pauses and looks confused for >5s, player clicks same button repeatedly, player closes app during specific sequence

### NOT in Scope

List deferred work with rationale for each item. Format:
```
- [Issue]: Deferred because [reason]. Revisit when [condition].
```

### Failure Modes

For each core feature identified in Section 1, write one realistic failure scenario:
```
- [Feature]: Fails when [specific condition]. Player reaction: [what they do]. Mitigation: [specific fix].
```

---

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-review","timestamp":"TIMESTAMP","status":"STATUS","score":"SCORE","unresolved":N,"critical_gaps":N,"mode":"MODE","sections":{"core_loop":N,"progression":N,"economy":N,"motivation":N,"risk":N,"consistency":N},"commit":"COMMIT"}' 2>/dev/null || true
```
