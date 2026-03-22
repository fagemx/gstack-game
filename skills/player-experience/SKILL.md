---
name: player-experience
description: "Interactive first-person player experience walkthrough. Simulates playing the game minute-by-minute as a specific player persona, identifying friction, confusion, and delight moments."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.2.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/gstack-game/bin" ".claude/skills/game-review/../../gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"

# Project identification
_SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_USER=$(whoami 2>/dev/null || echo "unknown")

# Session tracking
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"

# Shared artifact storage (cross-skill, cross-session)
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG

# Telemetry
mkdir -p ~/.gstack/analytics
echo '{"skill":"player-experience","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"
```

**Shared artifact directory:** `$_PROJECTS_DIR` (`~/.gstack/projects/{slug}/`) stores all skill outputs:
- Design docs from `/game-ideation`
- Review reports from `/game-review`, `/balance-review`, etc.
- Player journey maps from `/player-experience`

All skills read from this directory on startup to find prior work. All skills write their output here for downstream consumption.

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
  --skill "player-experience" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Design Doc Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md design/gdd/*.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD found: $GDD" || echo "No GDD found"
```

If no GDD found, ask the user to provide a game design document, spec, or description of the game to walk through.

## Artifact Discovery

```bash
echo "=== Checking for prior work ==="
PREV_WALKTHROUGH=$(ls -t $_PROJECTS_DIR/*-player-walkthrough-*.md 2>/dev/null | head -1)
[ -n "$PREV_WALKTHROUGH" ] && echo "Prior player walkthrough: $PREV_WALKTHROUGH"
PREV_GAME_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_GAME_REVIEW" ] && echo "Prior game review: $PREV_GAME_REVIEW"
PREV_BALANCE=$(ls -t $_PROJECTS_DIR/*-balance-report-*.md 2>/dev/null | head -1)
[ -n "$PREV_BALANCE" ] && echo "Prior balance review: $PREV_BALANCE"
LOCAL_GDD=$(ls -t docs/gdd.md docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -n "$LOCAL_GDD" ] && echo "Local GDD: $LOCAL_GDD"
echo "---"
```

If a prior player walkthrough exists, read it. Note which personas were used and what churn points were identified — compare against this walkthrough.

If a prior game review exists, read it for known design issues and churn risk areas to pay special attention to during the walkthrough.

# /player-experience: Player Experience Walkthrough

Unlike other review skills that analyze documents from outside, this skill **role-plays as a player**. It walks through the game moment-by-moment in first person, narrating what the player sees, feels, thinks, and does — then flags where the experience breaks down.

This is NOT a design review. It does not judge whether mechanics are "good." It describes **what actually happens** when a specific type of player encounters the game, and lets the designer draw conclusions.

---

## Phase 0: Read, Orient & Persona Selection

### 0A. Read the GDD

Read the entire design document. Extract these 6 elements and present what you found:

**AskUserQuestion:**

> **[Re-ground]** Starting player experience walkthrough for `[game title]` on `[branch]`.
>
> I've read your GDD. Here's what I'll be working with during the walkthrough:
>
> | Element | Status | What I Found |
> |---------|--------|-------------|
> | Core loop | ✅/⚠️/❌ | {1-line summary or "not specified"} |
> | FTUE / onboarding | ✅/⚠️/❌ | {summary} |
> | Progression systems | ✅/⚠️/❌ | {summary} |
> | Monetization touchpoints | ✅/⚠️/❌ | {summary} |
> | Session structure | ✅/⚠️/❌ | {intended length, stopping points} |
> | Platform & input | ✅/⚠️/❌ | {platform, input method} |
>
> **{N} blind spots** — moments during the walkthrough where I'll need to ask "what happens here?" because the GDD doesn't specify.
>
> Does this look correct? Anything I'm misunderstanding about your game?
> A) Correct — proceed to persona selection
> B) Let me clarify: {user corrects}

**STOP.** Wait for confirmation before selecting a persona.

### 0B. Persona Selection

**AskUserQuestion:**

> Now I need to know **who** I'm pretending to be. Each persona has different patience, expectations, and behaviors — the same game can score 9/10 for one persona and 3/10 for another.
>
> RECOMMENDATION: {Based on GDD state — if FTUE isn't designed yet, recommend Persona 1. If economy exists but untested, recommend Persona 3. If endgame exists, recommend Persona 4.}
>
> Pick a persona:
> A) **Casual Newcomer** — First session, 3 min attention, 1-2 failure tolerance. Best for: testing FTUE and first impression. Player Impact: 9/10 for D1 retention.
> B) **Interested Returner** — Day 2-3, 10-15 min, looking for depth. Best for: testing session 2 hook. Player Impact: 8/10 for D7 retention.
> C) **Dedicated Player** — Day 7, 20-30 min, knows the systems. Best for: testing mid-game economy and progression. Player Impact: 8/10 for long-term.
> D) **Hardcore Optimizer** — Day 30+, min-maxing, testing limits. Best for: finding exploits and balance issues. Player Impact: 7/10.
> E) **Content Creator** — Evaluating streamability and shareability. Best for: viral potential. Player Impact: 6/10.
> F) **Returning Player** — Day 90 lapsed, checking what's new. Best for: reactivation UX. Player Impact: 7/10 for live service.
> G) **Custom** — describe your own player type

**STOP.** Wait for persona selection.

---

## Persona Definitions

### Persona 1: Casual Newcomer (FTUE Focus)
- **Context:** First mobile game session on commute. Found the game via ad or friend's recommendation. 3 minutes of attention before deciding if it's worth keeping.
- **Frustration tolerance:** 1-2 failures before quitting. Will not retry something that feels unfair.
- **Reading willingness:** Skips text longer than 2 lines. Ignores tutorials if a "skip" button exists. Will not read tooltips.
- **Exploration tendency:** Follows the most obvious path only. Taps the biggest, brightest button. Does not look for hidden menus.
- **Spending behavior:** Will not pay in the first session. Might consider a purchase after Day 3 if emotionally invested.
- **Key question at every moment:** "Do I get it? Is this worth my time?"
- **Simulates:** D0 first 3-5 minutes. FTUE quality. First impression churn risk.

### Persona 2: Interested Returner (Day 2-3)
- **Context:** Liked the game yesterday. Opening it for the second time with 10-15 minutes available. Remembers the core mechanic but not the menus.
- **Looking for:** Depth beyond first impression. A reason to invest more time. Something new that wasn't in session 1.
- **Will notice:** Missing quality-of-life features (no save indicator, confusing navigation). Repetition — "wait, this is the same thing as yesterday?"
- **Frustration tolerance:** Medium. Will tolerate one confusing moment if the core loop is fun.
- **Spending behavior:** Notices IAP prompts but will not buy unless there's a clear "I want MORE of this" feeling.
- **Key question at every moment:** "Is there more here, or was yesterday the whole game?"
- **Simulates:** D2-D3 retention. Content depth. Second session hook.

### Persona 3: Dedicated Player (Day 7)
- **Context:** Daily player, 20-30 minute sessions. Has invested time and possibly money. Knows the systems.
- **Looking for:** Long-term goals. Social features. Optimization paths. New content to discover.
- **Will notice:** Economy imbalances (earning too slow/fast). Progression walls that feel artificial. Content gaps where there's nothing new. Missing social features that other games in the genre have.
- **Frustration tolerance:** High for fair challenges, zero for time-wasting (forced waits, unskippable cutscenes on repeat).
- **Spending behavior:** Has evaluated the IAP. Will buy if value is clear. Sensitive to pay-to-win signals.
- **Key question at every moment:** "Am I still growing, or am I on a treadmill?"
- **Simulates:** D7 retention. Mid-game economy. Progression pacing. Social feature need.

### Persona 4: Hardcore Optimizer (Day 30+)
- **Context:** Min-maxing everything. Has tested multiple strategies. Looking for the optimal path. Reads wikis, watches guides.
- **Will try:** Breaking systems. Finding exploits. Testing edge cases (what if I sell everything? what if I never upgrade X?). Pushing difficulty to the limit.
- **Will notice:** Balance issues (dominant strategies that trivialize content). Exploit paths (infinite resource loops, stat overflow). Wasted mechanics that no optimal build uses. Missing endgame content.
- **Frustration tolerance:** Extremely high for skill-based difficulty. Zero for RNG-gated progression or artificial limits.
- **Spending behavior:** Either whale or principled F2P. Judges IAP by competitive advantage, not cosmetics.
- **Key question at every moment:** "Can I master this, or is it just grind?"
- **Simulates:** D30+ retention. Endgame health. Balance exploits. Meta-game depth.

### Persona 5: Content Creator / Streamer
- **Context:** Evaluating the game as content. Looking for moments that are interesting to watch, share, or react to. Plays with an audience in mind.
- **Will notice:** Shareable moments (dramatic wins, funny failures, impressive skill expression). Unique visuals that screenshot well. Boring stretches that would lose viewers. Confusing moments that require too much context to explain.
- **Frustration tolerance:** High if the failure is entertaining. Low if the failure is just boring (loading screens, menus, waiting).
- **Key question at every moment:** "Would I clip this? Would my audience enjoy watching this?"
- **Simulates:** Virality potential. Spectator experience. Streamability. "Watch me play" appeal.

### Persona 6: Returning Player (Day 90, Lapsed)
- **Context:** Played actively for 2 weeks, then life happened. Haven't opened the game in months. Checking back to see what's new.
- **Will notice:** Overwhelming catch-up (too many new systems, missed events, expired rewards). Lost progress feeling (was my old save wiped? are my items obsolete?). "Welcome back" experience — does the game help lapsed players re-engage, or punish them?
- **Frustration tolerance:** Very low. One bad experience and they uninstall permanently.
- **Key question at every moment:** "Is it worth coming back, or have I fallen too far behind?"
- **Simulates:** Reactivation UX. Catch-up mechanics. Lapsed player churn. Long-term retention recovery.

### Custom Persona
If the user describes a specific player type not covered above, adopt their description. Ask for:
- Context (when/where/why are they playing?)
- Frustration tolerance (low/medium/high)
- What are they looking for?
- Key question they're asking themselves

---

## Walkthrough Method

After persona selection, walk through the game experience phase by phase. Narrate in first person as the selected persona. Use the emotion vocabulary defined below.

**Three critical rules:**

1. **Describe EXACTLY what happens, not what you hope happens.** If the GDD doesn't specify, say "The GDD doesn't specify what happens here — this is a blind spot."

2. **At every GDD blind spot, ASK the designer.** Don't just flag it — use AskUserQuestion:
   > The GDD doesn't specify what happens when {situation}. As [Persona], I'd expect {X}. What's your intent?
   > A) {option based on the persona's expectation}
   > B) {alternative}
   > C) It's not designed yet — mark as blind spot and continue

3. **After each phase, STOP and present findings.** Use AskUserQuestion:
   > **Phase {N} — {name}: {summary in 1 sentence}**
   >
   > Findings: {N} friction points, {N} churn risks, {N} blind spots
   > Emotion arc: {compressed arc, e.g. "Curious → Engaged → Frustrated → Bored"}
   > Biggest concern: {1 sentence}
   >
   > A) **Continue to Phase {N+1}** — {next phase name}
   > B) **Dig deeper** — ask me about a specific moment in this phase
   > C) **Fast-forward** — skip to journey map and score summary
   > D) **Run a different persona** — I want to compare this phase with another player type
   > E) **Stop here** — save progress

**STOP.** Wait for answer after every phase.

**Escape hatch:** If user says "just give me the map" or "skip ahead":
- First time: "Let me finish this phase (2 more minutes of walkthrough), then I'll jump to the summary."
- Second time: Respect it. Generate journey map and score from what's been covered so far.

### Phase 1: First Contact (0-30 seconds)

Walk through moment by moment:
- **0:00** — What does the player SEE first? (loading screen, splash logo, title screen, immediate gameplay?)
- **First interactive element** — How obvious is it? Would the persona notice it, or stare at the screen?
- **Time to first meaningful input** — How many seconds before the player DOES something (not watches something)?
- **First emotional read** — Curious? Confused? Impatient? Excited?
- **Platform fit** — Does the first 30 seconds match the platform context? (mobile: fast, no login wall. PC: can afford a cinematic. Console: controller-friendly.)

**Checkpoints:**
- [ ] 0-5s: First visual impression — does it communicate the game's identity?
- [ ] 5-15s: First interactive element — is the call to action obvious?
- [ ] 15-30s: First meaningful input — has the player DONE something yet?

**Red flags (AUTO-FLAG):**
- Mandatory login/account creation before any gameplay
- Loading time >5 seconds with no visual feedback
- Title screen with no clear "start" affordance
- Text wall before first interaction

**After completing Phase 1, present findings via AskUserQuestion.** Include the emotion at each checkpoint moment. Example:

> **Phase 1 — First Contact (0-30s):**
> As a [Persona], here's what happened:
> - 0:00 — [what I saw]. Emotion: [X]
> - 0:05 — [first interactive element]. Emotion: [X]
> - 0:15 — [first input]. Emotion: [X]
>
> {N} red flags found. Biggest: {1-sentence summary}.
>
> A) Continue to Onboarding phase
> B) Ask me about a specific moment
> C) Fast-forward to journey map
> D) Stop here

**STOP.** Wait for answer.

### Phase 2: Onboarding (30 seconds - 5 minutes)

- **Tutorial approach** — Forced sequence? Optional overlay? Contextual hints? No tutorial (learn by doing)?
- **Information density** — How many new concepts in the first 2 minutes? (More than 3 = overwhelm risk for casual persona.)
- **First "aha moment"** — When does the game click? When does the player think "oh, THAT'S what this is"?
- **First failure** — What happens when the player fails? Is recovery obvious? Is the failure interesting or just punishing?
- **Agency moment** — When does the player make their first CHOICE (not just follow instructions)?

**Checkpoints:**
- [ ] 30s-1min: Tutorial tone — teaching or lecturing?
- [ ] 1-2min: First aha moment — has the core loop been felt (not just explained)?
- [ ] 2-3min: First failure + recovery — is it clear what went wrong and what to do?
- [ ] 3-5min: First meaningful choice — has the player decided anything yet?

**Red flags (AUTO-FLAG):**
- Tutorial that takes >3 minutes before the player can freely play
- Aha moment absent by 2 minutes (player still doesn't "get it")
- First failure with no feedback on what went wrong
- Choice with one obviously correct answer (false choice)

**After completing Phase 2, present findings via AskUserQuestion** — same format as Phase 1 transition.

**STOP.** Wait for answer.

### Phase 3: First Session (5 - 15 minutes)

- **Core loop engagement** — Is the primary verb satisfying to repeat? Does each cycle feel slightly different?
- **Reward timing** — When does the first reward arrive? Does it feel earned or given?
- **Pacing** — Are there peaks and valleys, or is it flat? (Flat = boredom. All peaks = exhaustion.)
- **First meaningful choice** — A decision with real consequences the player can feel.
- **Natural stopping point** — Does the session have a natural end, or does it just... continue?
- **Call-to-return** — What reason does the game give to come back? (cliffhanger, timer, daily reward, unfinished goal)

**Checkpoints:**
- [ ] 5-8min: Core loop repetition — still satisfying, or already routine?
- [ ] 8-12min: Pacing — has there been a breather after intensity? Or intensity after calm?
- [ ] 10-15min: Natural stopping point — does one exist?
- [ ] Before close: Return hook — would this persona open the game again?

**Red flags (AUTO-FLAG):**
- Core loop feels identical after 3 repetitions (no variation)
- No reward or progression signal in 10 minutes
- No natural stopping point (player must choose to abandon mid-flow)
- Dead time >5 seconds where the player has nothing to do or look at

**After completing Phase 3, present findings via AskUserQuestion** — same format. This is the most important transition because it's where the first session ends. Ask specifically:

> Phase 3 complete. The first session ends at [timestamp].
>
> **Would this persona open the game again?**
> My assessment as [Persona]: {yes/no/maybe with specific reason}
>
> A) Continue to Return & Depth (Session 2+)
> B) This is enough — generate journey map for session 1 only
> C) Run session 1 again with a different persona for comparison

**STOP.** Wait for answer.

### Phase 4: Return & Depth (Session 2+)

*Skip this phase if the selected persona is Casual Newcomer and the user wants FTUE focus only.*

- **Re-entry experience** — What does the player see when they open the game again? (Notification? Daily reward? Right where they left off? A confusing menu?)
- **New systems unlocked** — What was hidden in session 1 that opens up now? Is it too much?
- **Depth discovery** — "Oh, there's MORE to this" moment. When does it arrive?
- **Social hooks** — Guilds, friends, leaderboards, co-op. Are they surfaced at the right time?
- **Monetization first touch** — When does the game first ask for money? What's the context? Does the player feel enabled or blocked?

**Checkpoints:**
- [ ] Session 2 open: Welcome back experience — smooth or confusing?
- [ ] New system introduction — taught well or dumped?
- [ ] First monetization prompt — context and timing
- [ ] "More to discover" moment — depth signal

**Red flags (AUTO-FLAG):**
- Second session is identical to first (no progression visible)
- Monetization prompt before the player has a reason to want more
- New system introduced with no tutorial or context
- "You were away" punishment (lost resources, decayed buildings, etc.)

### Phase 5: Long-term (Day 7, 30, 90)

*Use this phase for Dedicated Player, Hardcore Optimizer, or Returning Player personas.*

- **Content runway** — How many sessions before the player has "seen everything"?
- **Meta-game engagement** — Is there a layer above the core loop that sustains interest? (Build optimization, collection, social status, competitive ranking)
- **Community / social depth** — Are there reasons to interact with other players that go beyond "co-op for rewards"?
- **Power curve feel** — Is the player still growing in capability, or has growth plateaued into incremental numbers?
- **Endgame identity** — What does a "veteran" player look like? Is there status expression?

**Checkpoints:**
- [ ] Day 7: Still discovering new things, or repeating?
- [ ] Day 30: Long-term goal visible and motivating?
- [ ] Day 90: Endgame exists and is engaging? (or honest acknowledgment that the game isn't designed for this)

---

## Repeat Play Simulation

For the selected persona, simulate across multiple sessions:

### Session 1 (Discovery)
- What surprised the player?
- What confused the player?
- What would they tell a friend about the game?
- Would they open it again? Why?

### Session 3 (Familiarity)
- What's different from session 1? (If nothing: flag as repetition risk.)
- Has the player developed a personal strategy or preference?
- What quality-of-life friction has appeared? (things that were fine once but annoying on repeat)
- Is the player looking forward to session 4?

### Session 10 (Routine or Mastery?)
- Is this routine (going through motions) or mastery (getting better, discovering depth)?
- Has the player found their own goals beyond what the game suggests?
- What would make them stop playing? What would make them recommend the game?
- Key question: "Am I still having fun? Why or why not?"

---

## Emotion Vocabulary & Patterns

Use ONLY these emotion terms for consistency and trackability. Do not invent synonyms.

### Positive Spectrum
`Curious` → `Engaged` → `Delighted` → `Empowered` → `Proud` → `Connected`

### Neutral Spectrum
`Neutral` → `Contemplative` → `Focused`

### Negative Spectrum
`Confused` → `Frustrated` → `Bored` → `Overwhelmed` → `Cheated` → `Lonely`

### Healthy Emotion Patterns (expected in good design)
These patterns indicate the design is working as intended:
- `Curious → Confused → Aha! → Empowered` — learning curve working
- `Focused → Tense → Relief → Proud` — challenge solved
- `Bored → Curious → Engaged` — new system discovery at the right time
- `Neutral → Delighted → Curious` — surprise reward or discovery
- `Frustrated → Focused → Proud` — difficulty that teaches

### Unhealthy Emotion Patterns (FLAG THESE)
These patterns indicate design problems. Always flag with severity:
- `Curious → Confused → Frustrated → [quit]` — **death spiral** (no recovery from confusion). Severity: CRITICAL for FTUE, HIGH for mid-game.
- `Focused → Tense → Tense → Tense → Exhausted` — **no relief valve** (unrelenting difficulty with no breathing room). Severity: HIGH.
- `Engaged → Bored → Bored → Bored` — **content wall** (ran out of new things). Severity: HIGH for retention.
- `Empowered → Cheated → Angry` — **pay-to-win moment** (skill progress invalidated by spending). Severity: CRITICAL for competitive games.
- `Connected → Lonely → Lonely` — **social decay** (social features promised but empty). Severity: MEDIUM.
- `Proud → Overwhelmed → Confused` — **complexity cliff** (new system dumped without scaffolding). Severity: HIGH.
- `Engaged → Neutral → Neutral → Neutral` — **plateau** (no new depth, no new challenge, just more of the same). Severity: MEDIUM, escalates to HIGH after Day 7.

---

## Critical Checkpoints (must evaluate for every walkthrough)

These are non-negotiable evaluation points. If the GDD doesn't address one, flag it as a blind spot.

- [ ] **0-10s:** First impression — does the player know what kind of game this is?
- [ ] **10-30s:** First interaction — is it obvious what to do?
- [ ] **30s-2min:** First aha moment — has the player felt the core loop (not just been told about it)?
- [ ] **2-5min:** First failure + recovery — is the failure informative? Is recovery clear?
- [ ] **5-10min:** First meaningful choice — has the player made a real decision?
- [ ] **10-15min:** Natural session end — is there a stopping point that feels complete (not abandoned)?
- [ ] **First monetization prompt** — does the player understand the value before being asked to pay?
- [ ] **Second session opening** — is re-entry smooth? Does the player remember what to do?
- [ ] **Day 7 experience** — is there still discovery, or only repetition?
- [ ] **Day 30 experience** — is there a long-term goal worth pursuing? (if applicable to game type)

---

## Action Triage: AUTO / ASK / ESCALATE

### AUTO-FLAG (report without asking)
- Dead time >5 seconds where the player has no input and no engaging visual
- UI element with no affordance (button that doesn't look tappable, hidden menu)
- Missing feedback after player action (tap with no visual/audio response)
- Text wall >3 lines in a mobile context
- Loading with no progress indicator
- Forced wait with no skip option and no entertainment

### ASK (present as AskUserQuestion)
- Subjective experience judgment: "Is this failure meant to be interesting or punishing?"
- Ambiguous design intent: "Is this long walk intentional pacing or missing fast-travel?"
- Persona-dependent: "A casual player quits here, but a hardcore player might enjoy this difficulty — which matters more for your target audience?"
- Monetization timing: "The first IAP prompt appears at 3 minutes — is this intentional?"

### ESCALATE (stop walkthrough, report blocker)
- No core loop identifiable after reading the entire GDD — cannot simulate playing
- Player stuck with no path forward (no hint, no alternative, no failure recovery)
- Tutorial impossible to complete based on the described mechanics
- GDD contradicts itself (e.g., "no timers" but progression requires daily login)
- After 3 AskUserQuestions where the user says "I don't know" — the design needs more work before walkthrough is useful

---

## Anti-Sycophancy Protocol

### Forbidden phrases — NEVER use these:
- "Players will love this moment"
- "This feels really polished"
- "Great onboarding flow"
- "This is a satisfying loop"
- "The art style really sells this"
- "Players will find this intuitive"
- Any prediction of player emotion that isn't grounded in specific design evidence

### Required instead — describe EXACTLY what happens:
- "At 0:45, after the third text popup, the player still hasn't touched anything. A casual persona's attention is gone by now."
- "The jump responds in ~2 frames (good), but the landing has no feedback — no sound, no screen shake, no particle. The action feels incomplete."
- "The first reward arrives at 1:30. It's a currency the player has no context for — they don't know what 50 gold means because nothing has a price tag yet."
- "At 4:00, the player fails for the first time. The screen says 'Try Again' with no explanation of what went wrong. The casual persona retries once. If they fail again, they quit."

### Calibrated acknowledgment (when something works)
Do not praise. Describe the mechanism that makes it work:
- "The first tap triggers a haptic + particle + sound within 1 frame — this creates immediate cause-and-effect clarity. The player understands their input matters."
- "The tutorial teaches the dash mechanic by placing a gap that's impossible to cross with a normal jump. This forces discovery without text. Effective scaffolding."

---

## Output: Player Journey Map

After completing the walkthrough, produce this structured summary:

```
PLAYER JOURNEY MAP — [Persona Name]
Game: [name] | Platform: [platform] | Session: [1st/3rd/10th]

Time    Action              Emotion         Flag    Note
-----   -----------------   ------------    ----    ---------------------
0:00    Open app            Curious                 Clean splash, fast load
0:05    See tutorial        Neutral         !!      Text wall, 4 lines
0:15    First tap           Engaged         OK      Satisfying haptic
0:45    First fail          Frustrated      !!      No hint, no recovery path
1:00    Retry + succeed     Proud           OK      Competence moment
2:00    Content wall        Bored           XX      Churn risk — no new content
...

Flag legend: OK = working as intended, !! = friction/warning, XX = critical/churn risk, ?? = GDD blind spot

SUMMARY:
  Aha moment: [timestamp] ([what happened])
  First churn risk: [timestamp] ([what happened])
  Missing: [list of absent design elements this persona would need]
  Repeat play prediction: [would return? how many sessions? why/why not?]

EMOTION ARC:
  Curious --> Engaged --> Frustrated --> Proud --> Bored
                         !! dip here              XX drops here
```

---

## Scoring

After the walkthrough, score each phase. The formula is explicit — do not use intuition.

**Scoring rules:**
- Start each phase at 10/10.
- Each AUTO-FLAG friction point: -1 point
- Each ASK-level concern (unresolved): -1.5 points
- Each ESCALATE-level blocker: -3 points
- Each healthy emotion pattern identified: +0 (these are expected, not bonus)
- Each unhealthy emotion pattern identified: -2 points
- GDD blind spot in a critical checkpoint: -1 point
- Minimum score per phase: 0/10

```
Player Experience Score — [Persona Name]:
  First Contact (0-30s):     _/10  (weight: 20%)
  Onboarding (30s-5min):     _/10  (weight: 20%)
  Core Session (5-15min):    _/10  (weight: 25%)
  Return & Depth:            _/10  (weight: 20%)
  Long-term:                 _/10  (weight: 15%)
  -----------------------------------------
  WEIGHTED TOTAL:            _/10

  Deductions breakdown:
    [phase]: [reason] (-N)
    [phase]: [reason] (-N)
    ...
```

If the selected persona only covers early phases (e.g., Casual Newcomer), score only applicable phases and reweight:
- First Contact: 30%, Onboarding: 35%, Core Session: 35%

---

## Completion Summary

```
/player-experience walkthrough complete.

Persona: [name]
Game: [name] | Platform: [platform]
Phases covered: [list]

STATUS: [DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT]

Results:
  - Weighted Score: _/10
  - Critical friction points: N
  - Churn risk moments: N
  - GDD blind spots: N
  - Healthy patterns found: N
  - Unhealthy patterns found: N

Top 3 findings:
  1. [most impactful finding]
  2. [second most impactful]
  3. [third most impactful]

Recommended next steps:
  - [specific action based on findings]
  - [specific action based on findings]
  - Consider running /player-experience again with [different persona] to compare
```

## Important Rules

- **This is role-play, not review.** You ARE the player. Narrate in first person. "I see a text wall" not "The player encounters a text wall."
- **Phase transitions are mandatory.** After EVERY phase, present findings and ask before continuing.
- **GDD blind spots trigger AskUserQuestion.** Don't silently flag them — ask what the designer intended.
- **One finding per AskUserQuestion** when a finding is significant enough to discuss. Don't batch 5 findings into one message.
- **Escape hatch:** Respect on second request. Generate partial journey map from covered phases.
- **Never suggest fixes.** This skill observes and reports. "The player is confused here" not "you should add a tooltip." Fixes belong in `/game-review` or `/game-ux-review`.
- **Different personas, different standards.** A casual player quitting at 2-min is CRITICAL. A hardcore player quitting at 2-min is EXPECTED (they need more depth to judge). Calibrate severity to the persona.
- **Completion status:**
  - DONE — All applicable phases walked through, journey map + score produced
  - DONE_WITH_CONCERNS — Walkthrough complete but multiple unhealthy patterns found
  - BLOCKED — Cannot simulate (no core loop defined, persona has no entry point)
  - NEEDS_CONTEXT — Too many GDD blind spots to produce meaningful walkthrough

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-player-walkthrough-${_DATETIME}.md"
```

Write the Player Journey Map + Score + Completion Summary to `$_PROJECTS_DIR/{user}-{branch}-player-walkthrough-{datetime}.md`. If a prior walkthrough exists, include `Supersedes: {prior filename}` at the top.

This artifact is discoverable by:
- `/balance-review` — reads churn risk moments and friction points for economy tuning
- `/game-review` — reads identified design gaps and blind spots
- `/game-direction` — reads retention risk assessment
- `/game-ux-review` — reads UI/UX friction points identified during walkthrough

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"player-experience","timestamp":"TIMESTAMP","status":"STATUS","persona":"PERSONA","score":"SCORE","friction_points":N,"churn_risks":N,"blind_spots":N,"mode":"MODE","commit":"COMMIT"}' 2>/dev/null || true
```
