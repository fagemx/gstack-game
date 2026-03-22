# Walkthrough Phases

## Walkthrough Method

After persona selection, walk through the game experience phase by phase. Narrate in first person as the selected persona. Use the emotion vocabulary from emotion-vocabulary.md.

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

---

## Phase 1: First Contact (0-30 seconds)

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

---

## Phase 2: Onboarding (30 seconds - 5 minutes)

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

---

## Phase 3: First Session (5 - 15 minutes)

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

---

## Phase 4: Return & Depth (Session 2+)

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

---

## Phase 5: Long-term (Day 7, 30, 90)

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
