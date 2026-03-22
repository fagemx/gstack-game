---
name: gstack-game
version: 0.2.0
description: |
  Game development workflow skills for Claude Code. 21 interactive review skills
  covering the full game dev pipeline — concept brainstorming to shipping.

  When you notice the user is at these stages, suggest the appropriate skill:
  - Brainstorming a game idea → suggest /game-ideation
  - Reviewing a game plan (strategy/direction) → suggest /game-direction
  - Reviewing a game design document → suggest /game-review
  - Reviewing technical architecture for a game → suggest /game-eng-review
  - Reviewing game economy or balance → suggest /balance-review
  - Simulating player experience → suggest /player-experience
  - Reviewing game UI/UX → suggest /game-ux-review
  - Evaluating a game pitch or proposal → suggest /pitch-review
  - Code review on a game project → suggest /game-code-review
  - QA testing a game → suggest /game-qa
  - Ready to ship / create PR for a game → suggest /game-ship
  - Debugging a game bug → suggest /game-debug
  - Sprint/milestone retrospective → suggest /game-retro
  - Wanting adversarial second opinion → suggest /game-codex
  - Post-release doc updates → suggest /game-docs
  - Visual quality audit → suggest /game-visual-qa
  - Reviewing game assets (art/audio pipeline) → suggest /asset-review
  - Designing a playtest protocol → suggest /playtest
  - Working with production or live systems → suggest /careful
  - Want to scope edits to one directory → suggest /guard
  - Removing edit restrictions → suggest /unfreeze

  If the user pushes back on skill suggestions ("stop suggesting", "too aggressive"):
  1. Stop suggesting for the rest of this session
  2. Run: gstack-config set proactive false
  3. Say: "Got it — I'll stop suggesting skills. Say 'be proactive' to turn them back on."

  If the user says "be proactive again" or "turn on suggestions":
  1. Run: gstack-config set proactive true
  2. Say: "Proactive suggestions are back on."
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion

---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run build -->

## Preamble (run first)

```bash
_GD_VERSION="0.2.0"
_GG_BIN=""
for _p in "bin" ".claude/skills/gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && [ -f ".claude/skills/gstack-game/bin/gstack-config" ] && _GG_BIN=".claude/skills/gstack-game/bin"
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_SESSIONS=$(find ~/.gstack/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.gstack/sessions -mmin +120 -type f -delete 2>/dev/null || true
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_TEL_START=$(date +%s)
_SESSION_ID="$$-$(date +%s)"
_LAKE_SEEN=$([ -f ~/.gstack/.completeness-intro-seen ] && echo "yes" || echo "no")
_TEL_PROMPTED=$([ -f ~/.gstack/.telemetry-prompted ] && echo "yes" || echo "no")
mkdir -p ~/.gstack/analytics
echo '{"skill":"gstack-game","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "GD_VERSION: $_GD_VERSION"
echo "SESSIONS: $_SESSIONS"
echo "LAKE_INTRO: $_LAKE_SEEN"
echo "TEL_PROMPTED: $_TEL_PROMPTED"
```

If `PROACTIVE` is `"false"`, do NOT proactively suggest gstack-game skills — only invoke
them when the user explicitly asks. The user opted out of proactive suggestions.

If `LAKE_INTRO` is `no`: Before continuing, introduce the Completeness Principle.
Tell the user: "gstack-game follows the **Boil the Lake** principle — always do the complete
thing when AI makes the marginal cost near-zero. In game dev: don't skip balance data
('we'll tune later'), don't skip FTUE design ('tutorial can wait'), don't skip controller
support ('polish later'). These are lakes, not oceans."
Then:

```bash
touch ~/.gstack/.completeness-intro-seen
```

This only happens once.

If `TEL_PROMPTED` is `no` AND `LAKE_INTRO` is `yes`: Ask the user about telemetry.
Use AskUserQuestion:

> Help gstack-game improve! Anonymous mode tracks which skills you use and how long
> they take — no code, file paths, or repo names are ever recorded.
> Change anytime with `gstack-config set telemetry off`.

Options:
- A) Sure, anonymous is fine (recommended)
- B) No thanks, fully off

If A: run `gstack-config set telemetry anonymous`
If B: run `gstack-config set telemetry off`

Always run:
```bash
touch ~/.gstack/.telemetry-prompted
```

This only happens once.

## Session Awareness

If `SESSIONS` is `3` or more: The user has 3+ concurrent Claude Code windows.
For EVERY AskUserQuestion in this session, prepend a re-ground line:

> **[{repo} / {branch}]** You're working on {current task}.

This prevents context confusion when switching between windows.

## AskUserQuestion Format (Game Design)

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** Project, branch, what game/feature is being reviewed. (1-2 sentences)
2. **Simplify:** Plain language a smart 16-year-old gamer could follow. Use game examples they'd know (Minecraft, Genshin, Among Us, Celeste, Hades) as analogies.
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

## Completeness Principle — Boil the Lake

AI-assisted development makes the marginal cost of completeness near-zero.

- If Option A is complete and Option B is a shortcut — **always recommend A**.
- **Lake:** Full balance spreadsheet, complete FTUE flow, all input methods, regression tests.
- **Ocean:** Rewriting the engine, porting platforms from scratch, building custom MMO networking.

**When estimating effort**, show both scales:

| Task type | Human team | CC+gstack-game | Compression |
|-----------|-----------|----------------|-------------|
| GDD section drafting | 2 days | 30 min | ~50x |
| Balance spreadsheet | 1 day | 15 min | ~50x |
| Playtest protocol | 4 hours | 15 min | ~15x |
| Economy model review | 1 day | 30 min | ~30x |
| Code review (gameplay) | 2 hours | 10 min | ~12x |
| Architecture design | 2 days | 4 hours | ~5x |

**Anti-patterns:**
- "We'll balance it later." (Balance data is the cheapest lake.)
- "Tutorial can wait." (FTUE determines D1 retention.)
- "Skip controller support." (If target platform, input is a lake.)
- "Tests are overkill for a game." (Gameplay regression tests catch silent balance breaks.)

## Search Before Building

Before building any game system, search first.

**Three layers:**
- **Layer 1** (tried and true): ECS, A*, behavior trees, sink/faucet. Don't reinvent.
- **Layer 2** (new and popular): Latest networking framework, procedural gen. Scrutinize.
- **Layer 3** (first principles): "What if death IS the progression?" — prize these above all.

**Eureka moment:** When first-principles reasoning challenges conventional game design:

```bash
jq -n --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --arg skill "SKILL_NAME" --arg branch "$(git branch --show-current 2>/dev/null)" --arg insight "ONE_LINE_SUMMARY" '{ts:$ts,skill:$skill,branch:$branch,insight:$insight}' >> ~/.gstack/analytics/eureka.jsonl 2>/dev/null || true
```

## Completion Status Protocol

- **DONE** — All steps completed. Evidence provided.
- **DONE_WITH_CONCERNS** — Completed, with issues listed.
- **BLOCKED** — Cannot proceed. State what's blocking.
- **NEEDS_CONTEXT** — Missing information. State what you need.

Escalation: 3 failed attempts → STOP. Security/balance uncertainty → STOP. Bad work is worse than no work.

## Skill Routing

| User is doing... | Suggest |
|-------------------|---------|
| "I have a game idea" | `/game-ideation` |
| "Should we build this?" | `/game-direction` |
| "Review this GDD" | `/game-review` |
| "Is the architecture right?" | `/game-eng-review` |
| "Is the economy balanced?" | `/balance-review` |
| "What does the player experience?" | `/player-experience` |
| "Is the UI good?" | `/game-ux-review` |
| "Will this pitch work?" | `/pitch-review` |
| "Review this PR/code" | `/game-code-review` |
| "Test this build" | `/game-qa` |
| "Ship this" | `/game-ship` |
| "Why is this broken?" | `/game-debug` |
| "How was this sprint?" | `/game-retro` |
| "Find holes in this" | `/game-codex` |
| "Update the docs" | `/game-docs` |
| "Does this look right?" | `/game-visual-qa` |
| "Check these assets" | `/asset-review` |
| "Plan a playtest" | `/playtest` |
| "Be careful" | `/careful` |
| "Lock edits to this folder" | `/guard` |
| "Unlock editing" | `/unfreeze` |

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "gstack-game" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```
