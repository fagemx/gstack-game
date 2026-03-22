---
name: game-code-review
description: "Game-aware PR code review. Checks frame budget, memory allocation, state sync, serialization safety, and standard code quality through structured two-pass review."
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
echo '{"skill":"game-code-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-code-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-code-review: Game-Aware PR Code Review

Two-pass code review for game projects. Pass 1 catches critical issues (frame budget, memory, networking, serialization). Pass 2 flags informational findings (data-driven design, code organization, test gaps). Every finding is triaged AUTO/ASK/ESCALATE before presenting to the user.

Works with any engine (Unity, Godot, Unreal, web-based, custom). Reviews code structure and patterns, not engine-specific API usage.

---

## Step 0: Diff Scope Analysis

```bash
# Detect base branch and diff scope
_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null || echo "HEAD~1")
_DIFF_STAT=$(git diff --stat "$_BASE"...HEAD 2>/dev/null)
_DIFF_LOC=$(git diff "$_BASE"...HEAD --numstat 2>/dev/null | awk '{s+=$1+$2} END {print s+0}')
_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
echo "BASE: $_BASE"
echo "DIFF_LOC: $_DIFF_LOC"
echo "COMMIT: $_COMMIT"
echo "$_DIFF_STAT"
```

## Artifact Discovery

```bash
echo "=== Checking for prior code reviews ==="
PREV_CODE_REVIEW=$(ls -t $_PROJECTS_DIR/*-${_BRANCH}-code-review-*.md $_PROJECTS_DIR/*-code-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_CODE_REVIEW" ] && echo "Prior code review: $PREV_CODE_REVIEW"
PREV_ENG=$(ls -t $_PROJECTS_DIR/*-eng-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_ENG" ] && echo "Prior eng review: $PREV_ENG"
echo "---"
```

If a prior code review exists on this branch, read it. Note previously flagged issues — check if they were addressed or if the same patterns recur.

Read the full diff:

```bash
git diff "$_BASE"...HEAD 2>/dev/null
```

### Scope Classification (Diff-Aware)

Based on `_DIFF_LOC`, select the review depth:

| Diff Size | LOC | Review Depth |
|-----------|-----|--------------|
| Small | < 50 | Quick review. Pass 1 only. Skip adversarial. |
| Medium | 50 - 199 | Standard two-pass review. |
| Large | 200+ | Full two-pass + adversarial challenge. |

**AskUserQuestion — confirm scope before reviewing:**

> **[Re-ground]** Code review for `[branch]` → `[base]`. {N} files changed, {LOC} lines.
>
> Review depth: **{Small/Medium/Large}** based on diff size.
> File types: {list of domain categories found}
> Skipping: {any domain rules that don't apply, e.g., "no network code in diff"}
>
> A) **Proceed** — start Pass 1 (critical issues)
> B) **Adjust scope** — include/exclude specific files
> C) **Full review** — force large-depth even on small diff
>
> RECOMMENDATION: {Based on diff. Small diffs rarely need adversarial.}

**STOP.** Wait for confirmation.

### File Type Classification

Classify each changed file to determine which domain rules apply. A file may match multiple categories.

| Path Pattern | Domain | Key Rules |
|-------------|--------|-----------|
| `src/gameplay/`, `game/`, `scripts/` | Gameplay | All values from config. Delta time for time-dependent calc. No direct UI refs. State machines need transition tables. |
| `src/core/`, `src/engine/`, `engine/` | Engine | ZERO allocations in hot paths. Thread safety documented. RAII for resources. No dependency on gameplay code. |
| `src/ai/`, `ai/` | AI | 2ms per-frame budget. All params from data files. Debug visualization hooks. Telegraph intentions. |
| `src/networking/`, `src/net/`, `net/`, `network/` | Network | Server-authoritative. Versioned messages. Client prediction + reconciliation. Validate all incoming packets. |
| `src/ui/`, `ui/`, `hud/` | UI | No direct game state mutation. Event-driven communication. Screen adaptation. |
| `assets/data/`, `data/`, `config/` | Data | Schema validation. Backward compatibility. No gameplay logic in data files. |
| `shaders/`, `*.shader`, `*.glsl`, `*.hlsl` | Shader | Instruction count. Texture sample budget. No branching in fragment shaders where avoidable. |
| Everything else | Standard | General code quality review. |

**STOP.** Before proceeding, confirm the diff size classification and list the file domains detected. If the diff is empty or only documentation/comments, report `STATUS: DONE` with no issues and skip the rest of this review.

---

## Pass 1: Critical (must address before merge)

Work through each subsection. For every finding, immediately classify it as AUTO / ASK / ESCALATE (see triage rules below). Do NOT present all findings at once — present one ASK issue at a time via AskUserQuestion.

### 1.1 Frame Budget Violations

**Budget reference:** 60 FPS = 16.6ms per frame. 30 FPS = 33.3ms. Every millisecond matters.

Check for:
- **Allocations in update/tick/render paths** — `new`, `malloc`, array/dictionary creation, string concatenation, lambda captures that allocate. These cause GC spikes.
- **Unbounded loops in per-frame code** — iterating all entities without spatial partitioning, unbounded `while` in tick.
- **Heavy computation without amortization** — pathfinding, visibility checks, or sorting that should be spread across frames or run on a budget.
- **Physics queries in render thread** — raycasts, overlap tests, or shape queries that block rendering.
- **Synchronous I/O in game loop** — file reads, network calls, or asset loading that blocks the main thread.
- **Missing delta time** — time-dependent calculations using frame count instead of `delta` / `dt`.

**Severity guide:**
- Allocation in `_process` / `Update` / `tick` called every frame = Critical
- Allocation in event handler called rarely = Informational (move to Pass 2)

### 1.2 Memory & Resource Safety

Check for:
- **Asset loading without unloading path** — textures, meshes, audio loaded but never freed. Where is the matching `unload` / `free` / `release`?
- **Circular references preventing GC** — particularly in component systems, event listeners, closures capturing `self`.
- **Large assets loaded synchronously** — textures > 1MB, meshes > 10K vertices loaded on main thread cause hitches.
- **Object pool exhaustion** — pools without overflow strategy (grow? recycle oldest? drop?).
- **Resource lifecycle unclear** — who owns this resource? When is it freed? Is there a double-free path?
- **RAII / cleanup missing** — engine resources without deterministic cleanup (file handles, GPU buffers, network sockets).

### 1.3 State Synchronization (multiplayer code)

Skip this section if no network/multiplayer code is in the diff. If network code IS present:

- **Client-authoritative logic** — any gameplay-critical value computed client-side without server validation is a cheat vector. Health, damage, currency, position (without server reconciliation).
- **Missing server validation** — client sends a request, server executes without checking rules. Example: client says "I bought item X" but server doesn't check if player has enough currency.
- **Race conditions in state updates** — two players act on the same entity simultaneously. What happens? Is there a resolution strategy (last-write-wins, conflict queue, rollback)?
- **Determinism issues** — floating point operations across platforms, unseeded random, hash map iteration order. Any of these break lockstep simulation.
- **Bandwidth concerns** — message frequency (every frame?), message size (full state vs delta?), redundant data.
- **Missing versioning** — network messages without version field. How do old clients talk to new servers?

### 1.4 Serialization Safety

Check for:
- **Save file backward compatibility** — does the save format have a version field? What happens when loading a save from version N-1?
- **Network packet parsing without bounds checks** — reading fields from a buffer without checking remaining length.
- **Deserialization of untrusted data** — player-provided data (workshop content, replay files, custom maps) parsed without validation.
- **Schema evolution** — is the strategy additive-only (safe) or does it rename/remove fields (needs migration)?
- **Round-trip fidelity** — save → load → save produces identical output? If not, silent data drift.

### 1.5 Input & Responsiveness

Check for:
- **Input polling in wrong frame phase** — reading input after physics but before rendering, or vice versa, causing 1-frame lag.
- **Missing input buffering** — for action/fighting games, inputs during hitstop/animation should be queued, not dropped.
- **Fixed vs variable timestep consistency** — gameplay on fixed timestep but input on variable (or vice versa) causes desynced feel.
- **Input delay > 1 frame** — any added latency must be justified (network prediction, animation blending). Unjustified delay = sluggish feel.
- **Missing input remapping / accessibility** — hardcoded key bindings without rebind support.

### 1.6 Security

Check for:
- **Injection vulnerabilities** — SQL injection in leaderboard queries, command injection in mod loading, XSS in chat.
- **Exposed secrets** — API keys, server credentials, signing keys in source code or config committed to repo.
- **Unvalidated player input** — player name length, chat message content, custom data payloads.
- **Cheat vectors** — client-trusted values that affect gameplay (see also 1.3). Speed hacks, teleportation, inventory manipulation.
- **Anti-tamper gaps** — checksum validation missing for game data files, replay files, or save files where integrity matters.

**STOP.** After completing all Pass 1 subsections: present AUTO-fixed items as a summary, then present each ASK item one at a time via AskUserQuestion. If any ESCALATE items exist, stop and report immediately.

---

## Pass 2: Informational (worth knowing, not blocking)

Only proceed to Pass 2 after all Pass 1 issues are resolved or acknowledged.

### 2.1 Data-Driven Design

- **Hardcoded gameplay values** — damage, speed, cooldown, drop rates, XP curves baked into code instead of config/data files. These should be designer-tunable without recompilation.
- **Magic numbers without named constants** — `if (distance < 5.0)` instead of `if (distance < AGGRO_RANGE)`.
- **Values that need tuning but can't be tuned** — anything a designer would want to tweak during playtesting but requires a code change.

### 2.2 Code Organization

- **Gameplay logic mixed with rendering** — game rules computed inside draw/render functions.
- **UI code directly modifying game state** — button handler that calls `player.health -= 10` instead of emitting an event.
- **God objects** — a single class handling input, physics, rendering, and networking.
- **Missing abstraction boundaries** — engine code importing gameplay types, or gameplay code importing UI types directly.
- **Dependency direction violations** — engine depends on gameplay (should be gameplay depends on engine).

### 2.3 Testing Gaps

- **Changed gameplay logic without gameplay tests** — new mechanic or modified formula with no unit test.
- **Changed serialization without round-trip test** — save/load or network message format changed but no test verifying encode/decode.
- **Changed networking without mock/integration test** — message handler modified but no test with simulated client/server.
- **Determinism-dependent code without determinism test** — lockstep simulation code without a test that runs N steps and compares checksums.

### 2.4 Performance Awareness

- **String operations in hot paths** — concatenation, formatting, regex in per-frame code.
- **Unnecessary deep copies** — copying arrays, dictionaries, or component data when a reference or view would suffice.
- **Cache-unfriendly access patterns** — iterating entities by type when data is stored by entity (or vice versa). AoS vs SoA concerns.
- **Shader complexity** — excessive texture samples, branching in fragment shaders, full-screen passes that could be combined.
- **Draw call concerns** — code patterns that prevent batching (unique materials per object, dynamic mesh generation per frame).

### 2.5 Dead Code & Consistency

- **Unused imports, variables, functions** — dead code that adds noise.
- **Inconsistent naming conventions** — `camelCase` mixed with `snake_case` within the same module.
- **Duplicated logic** — same calculation in two places that should be a shared function.
- **TODO/FIXME without owner or issue link** — untracked debt. Either add an owner tag and issue link, or remove it.

---

## Action Triage: AUTO / ASK / ESCALATE

Every finding from Pass 1 and Pass 2 must be triaged before being presented.

### AUTO (fix directly, report after)

Do these silently, then report what was done in the summary:

- Import ordering, formatting, whitespace
- Unused variable/import removal
- Adding `const` / `readonly` / `final` where missing
- Simple naming inconsistency (matching surrounding convention)
- Adding owner tag to orphaned TODO/FIXME comments
- Obvious missing `delta` multiplication on a time-dependent value (flag in summary)

**Constraint:** AUTO fixes must be mechanical and unambiguous. If there is any doubt, promote to ASK.

### ASK (present with AskUserQuestion)

Present one at a time. Follow the standard 4-part AskUserQuestion format:

1. **Re-ground** — project, branch, file, what the code does.
2. **Simplify** — explain the issue in plain language. Use game analogies (Minecraft, Genshin, Among Us) if helpful.
3. **Recommend** — `RECOMMENDATION: Choose [X] because [reason]`. Include `Player Impact: X/10` for each option.
4. **Options** — lettered choices with effort estimates.

ASK applies to:
- Architecture decisions — where should this logic live? Which system owns this?
- Performance tradeoffs — readability vs frame budget
- Gameplay logic that behaves differently than described in design docs
- API / interface changes that affect other systems
- Network authority decisions — what should the server validate?
- Any finding where reasonable developers would disagree

### ESCALATE (stop review, report immediately)

Stop the review and report to the user. Do not continue to the next finding.

ESCALATE triggers:
- **Security vulnerability** — injection, exposed secrets, unvalidated external input
- **Client-authoritative cheat vector in multiplayer** — gameplay-critical state trusted from client
- **Data loss risk** — save corruption path, migration missing for schema change, silent data truncation
- **Core system change with no tests and no test plan** — physics, networking, save system, economy modified with zero test coverage
- **3+ interconnected issues suggesting wrong abstraction** — when individual fixes won't help because the underlying structure is wrong

ESCALATE format:
```
ESCALATE: [category]
File: [path]:[line]
Issue: [one sentence]
Why this blocks: [one sentence]
Suggested next step: [concrete action]
```

---

## Adversarial Pass (Large diffs only, 200+ LOC)

**Skip this section for Small and Medium diffs.**

For Large diffs, launch a subagent with independent context. The subagent must NOT see the Pass 1/Pass 2 findings — it works from the raw diff only.

Adversarial prompt:

```
You are reviewing a game code diff. Think like three people simultaneously:

1. A player who wants to cheat — find client-authoritative values, exploitable race
   conditions, ways to manipulate local state for advantage.

2. A QA tester who wants to crash the game — find null dereferences, array out-of-bounds,
   division by zero, resource exhaustion, stack overflow from recursion, infinite loops
   triggered by unexpected input.

3. A speedrunner who wants to exploit every edge case — find state that persists when it
   shouldn't, transitions that skip validation, combinations of inputs that produce
   unintended behavior, frame-perfect exploits.

For each finding, state:
- WHERE (file:line)
- WHAT (the specific exploit/crash/edge case)
- HOW (step-by-step reproduction)
- SEVERITY (crash / exploit / desync / data loss / annoyance)

Be adversarial. No compliments. No "the code looks good overall." Just the problems.
```

After the adversarial pass, cross-reference findings with Pass 1/Pass 2:
- **Both found it** = high confidence, present as Critical
- **Only adversarial found it** = needs human judgment, present as ASK
- **Only main review found it** = keep original triage level

---

## Pass Transitions

**After Pass 1, present findings and ask before continuing:**

> **Pass 1 — Critical Issues:**
> - AUTO-fixed: {N} (import ordering, unused vars, etc.)
> - ASK items: {N} (presenting one at a time below)
> - ESCALATE: {N} (review-blocking)
>
> {If ASK items exist, present the FIRST one as AskUserQuestion with options: Fix / Defer / Dismiss}

**After all ASK items in Pass 1 are resolved, ask:**

> Pass 1 complete. {N} critical issues found ({N} fixed, {N} deferred, {N} dismissed).
>
> A) **Continue to Pass 2** — informational findings (code org, test gaps, performance)
> B) **Skip Pass 2** — enough information, go to summary
> C) **Launch adversarial pass** — skip Pass 2, go straight to chaos engineering mode (Large diffs only)

**STOP.** Wait for answer.

**After Pass 2 (if run), ask before adversarial:**

> Pass 2 complete. {N} informational findings.
>
> A) **Done** — proceed to summary
> B) **Launch adversarial pass** — independent context, chaos engineer mindset (adds 2-5 min)
>
> RECOMMENDATION: {Adversarial recommended if diff is 200+ LOC or touches networking/serialization/economy}

**STOP.** Wait for answer.

---

## Anti-Sycophancy Rules

**Forbidden phrases — never use these in review output:**

- "Clean code"
- "Well-structured"
- "Good use of [pattern]"
- "Nice refactor"
- "Looks good overall"
- "Solid implementation"
- "Well-organized"

**Instead:** State what the code does, what could go wrong, and what is missing. If there are no issues in a section, say "No issues found in [section]" and move on. Do not pad with compliments.

**Push-back cadence:** If the user dismisses a Critical finding, push back once with specific consequences ("If a player sends a negative damage value, they heal instead of taking damage. This is exploitable in PvP."). If dismissed again, record it as an acknowledged risk in the summary and move on.

---

## Completion Summary

After all passes are complete and all ASK items are resolved, produce this summary:

```
Game Code Review Summary
========================
  Branch: ___
  Commit: ___
  Diff size: ___ LOC (___ files changed)
  Review depth: Small / Medium / Large

  Pass 1 — Critical:
    1.1 Frame budget:      ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    1.2 Memory safety:     ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    1.3 State sync:        ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    1.4 Serialization:     ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    1.5 Input:             ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    1.6 Security:          ___ issues (___ AUTO-fixed, ___ ASK, ___ ESCALATE)
    Pass 1 total:          ___ issues

  Pass 2 — Informational:
    2.1 Data-driven:       ___ issues
    2.2 Organization:      ___ issues
    2.3 Testing gaps:      ___ issues
    2.4 Performance:       ___ issues
    2.5 Dead code:         ___ issues
    Pass 2 total:          ___ issues

  Adversarial pass:        [SKIPPED | ___ additional findings (___ new, ___ confirmed)]

  AUTO-fixed total:        ___
  Acknowledged risks:      ___ (user dismissed but recorded)

  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

**Status rules:**
- `DONE` — all Critical issues resolved or AUTO-fixed, no ESCALATE items.
- `DONE_WITH_CONCERNS` — Critical issues acknowledged but not fixed (user chose to defer). List each concern.
- `BLOCKED` — ESCALATE item found that prevents merge. List the blocking issue and suggested next step.

---

## NOT in Scope

After the summary, list anything intentionally skipped:
- Files excluded from review and why
- Sections skipped due to diff size
- Domain rules that don't apply (e.g., "No network code in diff — skipped 1.3")

---

## Important Rules

- **AUTO items: fix silently, report after.** Don't ask about import ordering. Just fix it and list in summary.
- **ASK items: ONE AT A TIME.** Present each with: file:line, what's wrong, why it matters, fix options.
- **ESCALATE items: stop and report immediately.** Don't continue reviewing if a security hole or data loss vector is found.
- **Pass transitions are mandatory.** Present Pass 1 summary before starting Pass 2. Present Pass 2 summary before adversarial.
- **Push-back when user dismisses Critical:** Push once with consequences ("negative damage = healing in PvP"). If dismissed again, record as acknowledged risk.
- **Never redesign.** "This allocation should be pooled" = review. "Here's how to implement an object pool using {specific pattern}" = implementation. Stay in review.
- **Escape hatch:** If user says "just fix what you can":
  - AUTO-fix everything possible
  - List ASK items as a table (don't present one by one)
  - Skip adversarial
  - Present summary

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-code-review-${_DATETIME}.md"
```

Write the Game Code Review Summary to `$_PROJECTS_DIR/{user}-{branch}-code-review-{datetime}.md`. If a prior code review exists on this branch, include `Supersedes: {prior filename}` at the top.

This artifact is discoverable by:
- `/game-ship` — checks code review status as a merge/release gate
- `/game-eng-review` — reads recurring code-level issues for architecture-level assessment
- `/game-qa` — reads flagged areas for targeted testing

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-code-review","timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","status":"STATUS","diff_loc":'"$_DIFF_LOC"',"critical_issues":N,"informational_issues":N,"auto_fixed":N,"escalated":N,"adversarial":"SKIPPED_OR_COUNT","commit":"'"$_COMMIT"'"}' 2>/dev/null || true
```

## Telemetry

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-code-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```
