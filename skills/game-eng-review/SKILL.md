---
name: game-eng-review
description: "Game technical architecture review. Evaluates engine choice, rendering pipeline, networking, physics, data persistence, and platform adaptation."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.3.0"
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
echo '{"skill":"game-eng-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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

## Next Step Routing Protocol

After every Completion Summary, include a `Next Step:` block. Route based on status:

1. **STATUS = BLOCKED** — Do not suggest a next skill. Report the blocker only.
2. **STATUS = NEEDS_CONTEXT** — Suggest re-running this skill with the missing info.
3. **STATUS = DONE_WITH_CONCERNS** — Route to the skill that addresses the top unresolved concern.
4. **STATUS = DONE** — Route forward in the workflow pipeline.

### Workflow Pipeline

```
Layer A (Design):
  /game-import → /game-review
  /game-ideation → /game-review
  /game-review → /player-experience → /balance-review
  /game-direction → /game-eng-review
  /pitch-review → /game-direction
  /game-ux-review → /game-review (if GDD changes needed) or /prototype-slice-plan

Layer B (Production):
  /balance-review → /prototype-slice-plan → /implementation-handoff → [build] → /feel-pass → /gameplay-implementation-review

Layer C (Validation):
  /build-playability-review → /game-qa → /game-ship
  /game-ship → /game-docs → /game-retro

Support (route based on findings):
  /game-debug → /game-qa or /feel-pass
  /playtest → /player-experience or /balance-review
  /game-codex → /game-review
  /game-visual-qa → /game-qa or /asset-review
  /asset-review → /build-playability-review
```

### Backtrack Rules

When a score or finding indicates a design-level problem, route backward instead of forward:
- Core loop fundamentally broken → /game-ideation
- GDD needs rewriting → /game-review
- Scope or direction unclear → /game-direction
- Economy unsound → /balance-review

### Format

Include in the Completion Summary code block:
```
Next Step:
  PRIMARY: /skill — reason based on results
  (if condition): /alternate-skill — reason
```

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-eng-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Architecture Doc Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
ARCH_DOC=$(ls -t docs/*arch* docs/*technical* docs/*engine* docs/*tech-design* *.arch.md 2>/dev/null | head -1)
[ -z "$ARCH_DOC" ] && ARCH_DOC=$(ls -t ~/.gstack/projects/$SLUG/*-arch-*.md 2>/dev/null | head -1)
[ -n "$ARCH_DOC" ] && echo "Architecture doc found: $ARCH_DOC" || echo "No architecture doc found"
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD found: $GDD" || echo "No GDD found — cross-validation with design will be limited"
```

If no architecture doc found, ask the user to provide one or describe the architecture verbally. Proceed with available information but note gaps.

## Artifact Discovery

```bash
echo "=== Checking for prior work ==="
PREV_ENG=$(ls -t $_PROJECTS_DIR/*-eng-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_ENG" ] && echo "Prior eng review: $PREV_ENG"
PREV_GDD=$(ls -t $_PROJECTS_DIR/*-gdd-import-*.md $_PROJECTS_DIR/*-design-*.md 2>/dev/null | head -1)
[ -n "$PREV_GDD" ] && echo "Prior GDD artifact: $PREV_GDD"
PREV_DIRECTION=$(ls -t $_PROJECTS_DIR/*-direction-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_DIRECTION" ] && echo "Prior direction review: $PREV_DIRECTION"
LOCAL_GDD=$(ls -t docs/gdd.md docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -n "$LOCAL_GDD" ] && echo "Local GDD: $LOCAL_GDD"
LOCAL_ARCH=$(ls -t docs/*arch* docs/*technical* docs/*engine* 2>/dev/null | head -1)
[ -n "$LOCAL_ARCH" ] && echo "Local architecture doc: $LOCAL_ARCH"
echo "---"
```

If a prior eng review exists, read it. Note previous Architecture Health Score and flagged issues — check if those issues have been addressed.

---

# /game-eng-review: Game Technical Architecture Review

Review a game's technical architecture interactively. Work through each section one issue at a time via AskUserQuestion. Every recommendation includes WHY and a concrete alternative. No vague praise — specific critique with actionable fixes.

This skill reviews architecture DECISIONS, not code. For code review, use `/gameplay-implementation-review`.

## Load References

Read these reference files before starting the review — they contain scoring rubrics, platform benchmarks, and Claude-specific gotchas:

- `references/scoring.md` — All 8 section rubrics with mode weight adjustments and scoring notes
- `references/gotchas.md` — Claude-specific architecture review mistakes, anti-sycophancy protocol, forcing question routing
- `references/performance-budgets.md` — Frame budgets, draw call limits, memory ceilings, texture sizes, build size limits by platform

> **Anti-sycophancy and push-back cadence:** See `references/gotchas.md`. Follow the forbidden phrases list and push-back cadence for EVERY interaction.

---

## Step 0: Architecture Context

Before reviewing, establish these anchors. If ANY are missing, ask the user before proceeding — they frame every subsequent judgment.

1. **Engine / Framework** — What engine? What version? Custom or off-the-shelf?
2. **Target Platforms** — PC? Mobile? Console? Web? Which specific hardware tiers?
3. **Performance Targets** — Target FPS? Loading time budget? Memory ceiling? Install size limit?
4. **Team Expertise** — What has the team shipped before? What's new territory?
5. **Game Scale** — Max concurrent entities? Max players (if multiplayer)? World size? Session length?
6. **GDD Reference** — Link core design requirements that drive architecture decisions. If no GDD exists, flag as concern.

**AskUserQuestion:**

> **[Re-ground]** Reviewing technical architecture for `[game title]` on `[branch]`.
>
> **[Simplify]** Before evaluating any technical decisions, I need to understand what this game needs to DO — like how an architect needs to know if they're building a house or a skyscraper before judging the foundation.
>
> **RECOMMENDATION:** Provide all six context items. Missing any of them means some sections will be reviewed with assumptions instead of facts.
>
> - **A) Provide full context** — Answer all 6 items. Most thorough review. Player Impact: 8/10.
> - **B) Provide partial context** — Answer what you know, skip unknowns. Review proceeds with flagged assumptions. Player Impact: 5/10.
> - **C) Let me infer from codebase** — I'll scan the project and infer context. Risk: wrong assumptions. Player Impact: 4/10.

---

## Review Pacing & Smart Routing

8 sections is a lot. **Smart-route based on game context** — not every game needs every section.

| Context | Priority sections | Skip/light sections |
|---------|-------------------|---------------------|
| Single-player, no networking | 1,2,4,5,6,7,8 | Section 3 (Networking) → SKIP |
| Mobile game | 1,2,5,6 (heavy), 4,7,8 | Section 3 → SKIP unless multiplayer |
| Multiplayer/online | 1,2,3 (heavy), 4,7,8 | Sections 5,6 → lighter |
| Prototype stage | 1,2 (heavy) | Sections 3-8 → structural check only |
| Near shipping | 5,6,7 (heavy) | Sections 1-3 → verify, don't redesign |

After Step 0 context is established, present the routing via AskUserQuestion:

> Based on your game ({game type}, {platform}, {stage}), I'll focus on:
> **Heavy review:** {section list}
> **Light check:** {section list}
> **Skip:** {section list} — {reason}
>
> A) Agree — proceed with this plan
> B) Adjust — I want to add/remove sections
> C) Full review — do all 8 sections (longer, more thorough)

**STOP.** Wait for answer.

**After completing EACH section**, present the score and ask:

> **Section {N} — {name}: {score}/10**
> Key finding: {1-sentence summary}
>
> A) Continue to Section {N+1}
> B) Discuss this finding further
> C) Fast-forward to score summary
> D) Stop here

**STOP.** Wait after every section.

---

## Section 1: Engine & Framework (引擎選型) — Weight: 15%

> **Scoring:** See `references/scoring.md`, Section 1. Five criteria: Fitness for Genre (0-3), Team Familiarity (0-2), Platform Support (0-2), Ecosystem & Tooling (0-1), License & Cost Risk (0-2). Total: ___/10.

### Engine Red Flags

- Custom engine for a small team with a deadline — almost always wrong unless the team has shipped a custom engine before
- Engine version locked to an old release with no upgrade plan — accumulating tech debt
- "We chose it because we like it" with no analysis of game requirements fit
- Engine requires workarounds for a core game mechanic (e.g., tile-based game on an engine with no native tilemap)
- No build pipeline established yet — "we'll figure out builds later"

### Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME:**

**Q1:** "What is the ONE thing this engine does better than alternatives for YOUR specific game?"

Push until you hear: A specific technical capability tied to a specific game requirement. "Unity is popular" = generic. "Unity's 2D tilemap system natively supports the isometric grid our GDD describes, and our artist already has a Unity tile workflow" = specific.
Red flags: "We've always used it." — Push: "Familiarity is valid, but has the team evaluated whether it's the RIGHT tool for THIS game's specific needs?"

**STOP.** Wait for answer.

**Q2:** "What is the engine's biggest limitation for your game, and what's your workaround?"

Push until you hear: A named limitation AND a concrete plan. Every engine has weaknesses. If the team can't name one, they haven't evaluated deeply enough.

**STOP.** Wait for answer.

### Action Classification

- **AUTO:** Version inconsistencies in config files, deprecated API usage flagged in docs
- **ASK:** Engine migration considerations, custom vs off-the-shelf decisions, version upgrade timing
- **ESCALATE:** Engine fundamentally cannot support a core game mechanic described in the GDD

**STOP.** Present ONE issue at a time via AskUserQuestion. Proceed only after all Section 1 issues are resolved or deferred.

---

## Section 2: Rendering & Performance (渲染與效能) — Weight: 20%

Every game has a frame budget. Check the architecture doc against platform-specific targets in `references/performance-budgets.md` (frame budgets, draw call limits, memory ceilings). If the architecture doc does not include a frame budget: **-2 points.** Without a budget, performance is being managed by hope.

> **Scoring:** See `references/scoring.md`, Section 2. Five criteria: Frame Budget Defined (0-2), Draw Call Strategy (0-2), LOD/Culling (0-2), Shader Complexity (0-2), Memory Budget (0-2). Total: ___/10.

### Performance Red Flags

- "We'll optimize later" — optimization is architectural, not a polish task
- No profiling infrastructure in the project — if you can't measure, you can't manage
- Texture sizes not standardized — a single 4K texture can blow mobile memory
- No target hardware defined — "it should run on most PCs" is not a spec
- GC-heavy language (C#, JS) with no allocation strategy for hot paths

### Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME:**

**Q1:** "What is your worst-case scene in terms of rendering cost, and have you profiled it?"

Push until you hear: A named scene AND profiling data (or admission that it hasn't been profiled). "The boss fight with 50 particle effects" = named. "We haven't profiled yet" = honest (flag for action).
Red flags: "It runs fine on my machine." — Push: "Your machine is not your minimum spec target. Have you tested on the lowest hardware you're targeting?"

**STOP.** Wait for answer.

**Q2:** "What happens when frame rate drops below target on your minimum spec device?"

Push until you hear: A graceful degradation strategy. Dynamic resolution? Particle reduction? LOD adjustment? If the answer is "it shouldn't drop" — that's hope, not engineering.

**STOP.** Wait for answer.

### Action Classification

- **AUTO:** Inconsistent texture size specs, frame budget math errors
- **ASK:** Performance target trade-offs, rendering technique choices, shader complexity decisions
- **ESCALATE:** No frame budget AND no profiling infrastructure — architecture is flying blind on performance

**STOP.** One issue per AskUserQuestion.

---

## Section 3: Networking Architecture (網路架構) — Weight: 15%

**Skip this section if the game is single-player only.** Score as N/A and redistribute weight per mode table in `references/scoring.md`.

First, classify the networking model:

| Model | Latency Tolerance | Bandwidth | Complexity | Example |
|-------|-------------------|-----------|------------|---------|
| **Client-Server Authoritative** | Low (action games) | High | High | Overwatch, Valorant |
| **Client-Server Relaxed** | Medium (RPGs, strategy) | Medium | Medium | World of Warcraft, Clash Royale |
| **Peer-to-Peer** | Variable | Low | Medium | Fighting games (GGPO), co-op |
| **Turn-Based** | High (async OK) | Low | Low | Hearthstone, chess |
| **Async/Social** | Very High | Very Low | Low | Clash of Clans attacks, leaderboards |

> **Scoring:** See `references/scoring.md`, Section 3. Five criteria: Model Fitness (0-3), State Synchronization (0-2), Latency Handling (0-2), Cheat Prevention (0-2), Failure Modes (0-1). Total: ___/10.

### Networking Red Flags

- Client-authoritative for competitive multiplayer — cheating will be trivial
- No tick rate specified — "as fast as possible" is not a design
- Rollback/prediction not planned for action games with <200ms latency requirement
- No bandwidth budget — streaming too much state will cause lag on mobile networks
- "We'll add multiplayer later" to a game designed around multiplayer — networking is foundational, not a feature

### Forcing Questions (must ask at least 2)

1. "What happens when a player has 300ms ping? Describe their exact experience." — Tests whether latency handling is designed or hoped for.
2. "Which game state lives on the server and which on the client? Can you draw the boundary?" — If this boundary is unclear, cheat prevention and desync bugs will be constant.
3. "What is the maximum bandwidth per player per second, and does it fit within mobile data constraints?" — Mobile networks have real bandwidth limits (~50-100 KB/s practical for games).

### Action Classification

- **AUTO:** Tick rate math inconsistencies, bandwidth calculation errors
- **ASK:** Network model selection, state authority boundaries, latency tolerance trade-offs
- **ESCALATE:** Competitive multiplayer game with client-authoritative architecture, OR action game with no latency compensation strategy

**STOP.** One issue per AskUserQuestion.

---

## Section 4: Data & Persistence (資料與存檔) — Weight: 10%

> **Scoring:** See `references/scoring.md`, Section 4. Five criteria: Save System Design (0-3), Schema Migration (0-2), Cloud Sync (0-2), Data Integrity (0-2), Analytics Pipeline (0-1). Total: ___/10.

### Data Red Flags

- Save file is a raw serialized object dump — any class change breaks saves
- No save versioning — first patch will corrupt existing player saves
- Cloud sync with no conflict resolution — "last write wins" loses player progress
- Player-facing data stored in plain text with no validation — trivial to cheat, easy to corrupt
- No analytics events for key game moments — can't measure retention without data

### Forcing Questions (must ask at least 2)

1. "A player updates the game and loads their old save. What happens if you added a new stat since their last play?" — Tests schema migration. If the answer is "it crashes" or "we haven't thought about it," saves will break.
2. "A player plays on their phone, then opens the game on their tablet. Both have different progress. What happens?" — Tests cloud sync conflict resolution.
3. "How large is a typical save file, and how long does saving take?" — Large saves cause hitches. Frequent autosaves with large files = frame drops.

### Action Classification

- **AUTO:** Save format inconsistencies, missing version fields in save schema
- **ASK:** Save format decisions, cloud sync strategy, analytics event design
- **ESCALATE:** No save versioning for a game that will receive updates — guaranteed data loss

**STOP.** One issue per AskUserQuestion.

---

## Section 5: Asset Pipeline (素材管線) — Weight: 10%

Check build sizes against store limits in `references/performance-budgets.md`. Check texture sizes and memory allocation against platform budgets.

> **Scoring:** See `references/scoring.md`, Section 5. Five criteria: Build Size Budget (0-2), Loading Strategy (0-3), Asset Specifications (0-2), Memory Management (0-2), Platform Variants (0-1). Total: ___/10.

### Asset Pipeline Red Flags

- No texture size standards — artists delivering 4K textures for mobile game
- Build size exceeds store limits (iOS: 200MB OTA, Google Play: 150MB base APK)
- All assets loaded at launch — long initial load, high memory usage
- No asset import pipeline automation — manual export/import prone to errors
- Audio files uncompressed in build — massive size increase for minimal quality gain

### Forcing Questions (must ask at least 2)

1. "What is your current build size per platform, and what is the limit?" — If they don't know, they haven't checked. Store limits are hard walls.
2. "What happens when a player enters a new area — is loading synchronous or streamed?" — Synchronous loading = freeze. Long freezes = player thinks game crashed.

### Action Classification

- **AUTO:** Asset spec inconsistencies, build size calculation errors
- **ASK:** Asset quality vs size trade-offs, loading strategy design, platform variant decisions
- **ESCALATE:** Build size exceeds store limits with no reduction plan

**STOP.** One issue per AskUserQuestion.

---

## Section 6: Platform Adaptation (平台適配) — Weight: 10%

> **Scoring:** See `references/scoring.md`, Section 6. Five criteria: Input Method Coverage (0-3), Resolution Scaling (0-2), Performance Tiers (0-2), Certification Requirements (0-2), Accessibility Baseline (0-1). Total: ___/10.

### Action Classification

- **AUTO:** Resolution inconsistencies in config, missing platform-specific settings
- **ASK:** Input method priority, quality tier definitions, cert requirement decisions
- **ESCALATE:** No certification awareness for console/mobile submission — guaranteed rejection

**STOP.** One issue per AskUserQuestion.

---

## Section 7: Testing Strategy (測試策略) — Weight: 10%

> **Scoring:** See `references/scoring.md`, Section 7. Five criteria: Unit Test Coverage (0-2), Integration Testing (0-2), Performance Testing (0-2), CI/CD Pipeline (0-2), Playtest Infrastructure (0-2). Total: ___/10.

### Testing Red Flags

- "We test by playing" — manual testing does not catch regressions
- No CI pipeline — builds break silently
- No crash reporting — bugs in the wild go undetected
- No automated performance tests — frame rate regressions caught by players, not developers
- Gameplay logic interleaved with rendering — untestable without full engine boot

### Action Classification

- **AUTO:** CI config errors, test framework setup issues
- **ASK:** Test coverage priorities, CI/CD pipeline design, crash reporting tool selection
- **ESCALATE:** No testing infrastructure AND approaching release

**STOP.** One issue per AskUserQuestion.

---

## Section 8: Cross-Section Consistency (跨段一致性) — Weight: 10%

This section cross-validates findings across Sections 1-7 and against the GDD (if available).

### Cross-Validation Matrix

| Intersection | What to Check | Red Flag Example |
|---|---|---|
| **Engine × GDD** | Does the engine support what the GDD requires? | GDD says "seamless open world" but engine has no streaming support |
| **Rendering × Platform** | Do rendering targets match platform capabilities? | 60 FPS target on mobile with desktop-grade shaders |
| **Networking × GDD** | Does network architecture support core gameplay? | GDD says "fast-paced combat" but tick rate is 10Hz |
| **Data × Platform** | Does save system work across all target platforms? | Cloud sync designed but one target platform has no cloud API |
| **Asset Pipeline × Platform** | Do asset specs fit platform constraints? | HD textures standard but 50% of target devices are low-end |
| **Testing × Scale** | Does test infrastructure match project complexity? | 100+ systems with no unit tests and manual-only testing |
| **Performance × GDD** | Does frame budget support the game's vision? | GDD promises 200 units on screen but frame budget only supports 50 |

> **Scoring:** See `references/scoring.md`, Section 8. Three criteria: Architecture-Design Alignment (0-4), Platform Coherence (0-3), Technical Debt Awareness (0-3). Total: ___/10.

### Action Classification

- **AUTO:** Terminology inconsistencies across architecture sections
- **ASK:** Cross-section design tensions that require architectural decisions
- **ESCALATE:** Architecture fundamentally cannot support the game design — engine/network/performance limits conflict with GDD requirements

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### Architecture Health Score

Calculate after all sections are reviewed. Use mode-adjusted weights from `references/scoring.md` (Mode Weight Adjustments table) — do NOT use default weights blindly.

Use the weighted total formula and score interpretation table from `references/scoring.md`.

Include the top 3 deductions (biggest point losses) with specific reasons:
```
Top 3 Deductions:
  1. [Section] [Criterion]: -N because [specific reason]
  2. [Section] [Criterion]: -N because [specific reason]
  3. [Section] [Criterion]: -N because [specific reason]
```

### Completion Summary

```
/game-eng-review Completion Summary
═══════════════════════════════════
Game: [title]
Branch: [branch]
Engine: [engine + version]
Target Platforms: [platforms]

Section Results:
  Step 0: Architecture Context — [established / missing items]
  Section 1 — Engine & Framework:       _/10, ___ issues found, ___ resolved, ___ deferred
  Section 2 — Rendering & Performance:  _/10, ___ issues found, ___ resolved, ___ deferred
  Section 3 — Networking Architecture:  _/10 (or N/A), ___ issues found, ___ resolved, ___ deferred
  Section 4 — Data & Persistence:       _/10, ___ issues found, ___ resolved, ___ deferred
  Section 5 — Asset Pipeline:           _/10, ___ issues found, ___ resolved, ___ deferred
  Section 6 — Platform Adaptation:      _/10, ___ issues found, ___ resolved, ___ deferred
  Section 7 — Testing Strategy:         _/10, ___ issues found, ___ resolved, ___ deferred
  Section 8 — Cross-Consistency:        _/10, ___ contradictions found

WEIGHTED TOTAL: _._/10

Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All sections reviewed, all critical issues resolved, Architecture Health Score >= 6.0
- **DONE_WITH_CONCERNS** — All sections reviewed, some issues deferred, score 4.0-5.9
- **BLOCKED** — Review could not complete due to ESCALATE items (engine cannot support GDD, no performance targets, fundamental architecture mismatch)
- **NEEDS_CONTEXT** — Review paused because critical context is missing (no target platforms, no performance targets, no GDD)

### NOT in Scope

List deferred work with rationale:
```
- [Issue]: Deferred because [reason]. Revisit when [condition].
```

### Technical Debt Register

For each identified tech debt item:
```
- [Debt]: Incurred because [reason]. Cost to fix later: [estimate]. Risk if unfixed: [consequence].
```

---

## Important Rules

- **Architecture, not code.** This skill reviews DECISIONS (engine choice, network model, save strategy), not code quality. Code review is `/gameplay-implementation-review`.
- **Section transitions are mandatory.** After each section: score + key finding + ask before continuing.
- **Smart routing is mandatory.** Not every game needs 8 sections. Skip networking for single-player. Skip asset pipeline for prototypes. Confirm the routing with the user.
- **Forcing questions: ONE AT A TIME with push patterns.** For sections not explicitly rewritten above, follow the same pattern: Ask → Push until you hear a specific answer → Red flag vague responses → STOP.
- **Cross-validate with GDD.** Every architecture decision should trace back to a game design requirement. "We use ECS" must answer "because the GDD describes 200-unit battles." If no GDD exists, flag the gap.
- **Escape hatch:** If user says "just give me the score" or has limited time:
  - First time: "Two more key sections, then I'll summarize."
  - Second time: Respect it. Complete remaining sections AUTO-only, present score summary.
- **"We'll optimize later" is a red flag, not an answer.** Optimization is architectural. If the frame budget isn't set now, it won't be set later — it'll be discovered as a crisis.
- **Never prescribe specific technology.** "You need a job system" = review. "Use Unity DOTS with Burst compiler" = consulting. This skill reviews, not consults.

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-eng-review-${_DATETIME}.md"
```

Write the Architecture Health Score + Completion Summary + Technical Debt Register to `$_PROJECTS_DIR/{user}-{branch}-eng-review-{datetime}.md`. If a prior eng review exists, include `Supersedes: {prior filename}` at the top.

This artifact is discoverable by:
- `/gameplay-implementation-review` — reads architecture decisions for code-level validation
- `/game-direction` — reads technical risk assessment and scope constraints
- `/game-ship` — checks eng review status as a release gate
- `/game-qa` — reads performance targets and platform requirements

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-eng-review","timestamp":"TIMESTAMP","status":"STATUS","score":"SCORE","unresolved":N,"critical_gaps":N,"engine":"ENGINE","platforms":"PLATFORMS","sections":{"engine":N,"rendering":N,"networking":N,"data":N,"assets":N,"platform":N,"testing":N,"consistency":N},"commit":"COMMIT"}' 2>/dev/null || true
```
