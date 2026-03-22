# Section 1: Core Loop (核心循環)

## Nested Loop Model

Evaluate the GDD for explicit definition of ALL four loop tiers:

| Loop Tier | Timescale | What It Delivers | Example (Hades) |
|-----------|-----------|------------------|-----------------|
| **Micro-loop** | 10-30 seconds | Single satisfying action cycle | Attack → dodge → special → pick up reward |
| **Meso-loop** | 5-15 minutes | Goal-reward cycle within a session | Clear a room sequence → choose boon → advance |
| **Macro-loop** | Full session | Complete session arc with closure | Full run attempt → death → mirror upgrades |
| **Meta-loop** | Days/weeks | Long-term progression and mastery | Unlock weapons → deepen NPC relationships → reveal story |

## MDA Framework Check

Design must flow BACKWARD from Aesthetics:
1. What should the player FEEL? (target Aesthetics from the 8 MDA categories: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission)
2. What player BEHAVIORS produce that feeling? (Dynamics)
3. What RULES generate those behaviors? (Mechanics)

**If the GDD starts with mechanics and never states target feelings: -3 points.** This is designing forward (mechanic-first) instead of backward (experience-first).

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Clarity** | 0-2 | Can describe core loop in one sentence using "verb → feedback → reward → repeat" format. 2 = crystal clear, 1 = understandable but wordy, 0 = unclear or missing |
| **Session Fit** | 0-2 | Loop completion fits target session length. 2 = natural stopping point within target, 1 = roughly fits but has dead time or overruns, 0 = mismatch (e.g., 20-min loop for a 2-min mobile session) |
| **Depth** | 0-2 | Mastery comes from doing the loop BETTER, not just more. 2 = clear skill ceiling with discoverable techniques, 1 = some depth but mostly linear, 0 = flat repetition with no skill expression |
| **Fail State** | 0-2 | Failure is interesting, not just punishing. 2 = failure teaches something and creates interesting decisions, 1 = failure is tolerable but generic (respawn, retry), 0 = no fail state described OR failure is purely punitive |
| **Uniqueness** | 0-2 | The "It's the game where you..." test. 2 = describable unique verb/mechanic a player would tell a friend, 1 = recognizable genre execution with a twist, 0 = generic description indistinguishable from competitors |

**Section 1 Score: ___/10**

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route based on GDD state:

**If GDD is early / core loop unclear — ask Q1 first:**

**Q1:** "Describe the core loop in exactly one sentence using the format: **verb → feedback → reward → repeat.**"

Push until you hear: A single sentence with a clear verb. Not a paragraph. Not a feature list.
Red flags: "It depends on the mode." "There are multiple loops." — Push: "Which one is the PRIMARY 30-second loop a player does 100 times per session?"

**STOP.** Wait for answer.

**If GDD has a defined loop — ask Q2:**

**Q2:** "What is the 30-second micro-loop? Is it intrinsically fun with ZERO rewards?"

Push until you hear: The designer either confirms the raw action is satisfying (like Tetris line clears with no XP) or admits it depends on extrinsic reward. If the latter: "That's a treadmill, not a game. The micro-loop must be fun on its own."

**STOP.** Wait for answer.

**If GDD is detailed / post-playtest — ask Q3 or Q4:**

**Q3:** "What does the player do on the 100th repetition that they didn't do on the 1st?"
Tests depth. If "nothing different, just bigger numbers" → depth = 0.

**Q4:** "What happens in the 5 seconds after the player fails?"
Tests fail state design. Good: Spelunky shows the ghost of your run. Bad: "Game Over, return to menu."

**STOP after each.** Minimum 2 questions per section. Skip any whose answer is already clear from the GDD.

## Action Classification

- **AUTO:** Flag naming inconsistencies (loop described differently in different sections), missing fail state description, loop timescale math errors (stated "2-minute loop" but described steps total 8+ minutes)
- **ASK:** Core loop changes (adding/removing a verb), session length mismatch requiring redesign, depth concerns
- **ESCALATE:** No core loop defined at all. GDD describes features but never the moment-to-moment play. Review CANNOT proceed without this.

**STOP.** Present ONE issue at a time via AskUserQuestion. Proceed only after all Section 1 issues are resolved or deferred.
