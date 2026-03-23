---
name: game-qa
description: "Systematic game QA. Tests functional correctness, visual quality, performance, audio, input, compatibility, localization, and progression integrity."
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
echo '{"skill":"game-qa","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-qa" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## QA Scope Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
VERSION=$(cat version.txt 2>/dev/null || cat package.json 2>/dev/null | grep '"version"' | head -1 | sed 's/.*: *"\(.*\)".*/\1/' || echo "UNKNOWN")
LAST_QA=$(ls -t ~/.gstack/reviews/$SLUG/game-qa-*.json 2>/dev/null | head -1)
[ -n "$LAST_QA" ] && echo "Last QA: $(cat "$LAST_QA" | grep -o '"timestamp":"[^"]*"' | head -1)" || echo "No previous QA found"
echo "Project: $SLUG"
echo "Version: $VERSION"
echo "Branch: $(git branch --show-current 2>/dev/null)"
```

---

# /game-qa: Systematic Game QA Testing

Structured QA testing across 8 categories. Each category is scored independently and combined into a weighted QA Health Score. Every bug is classified by severity and category before counting.

This skill tests the BUILT game, not design documents. For design review, use `/game-review`. For code review, use `/gameplay-implementation-review`.

## Anti-Sycophancy Protocol

**FORBIDDEN PHRASES — never use these or any paraphrase:**
- "The game runs great!"
- "No issues found"
- "Everything looks polished"
- "Smooth experience"
- "Players won't notice"
- "This is a minor thing"
- "Looking good overall"

**CALIBRATED ACKNOWLEDGMENT — use this instead:**
- State test results as facts: "8/8 core mechanics function correctly under normal input. Edge case: rapid-fire pause/unpause during save causes 200ms hitch but no data loss."
- If a test passes, describe WHAT was tested and the specific result. If an area has no bugs, say "0 bugs found in [N] test cases" — absence of bugs is a measurement, not a compliment.

**PUSH-BACK CADENCE:**
1. Push once: "This bug affects [X]% of the test surface. Severity: [level]."
2. Push again: If the response is "we'll fix it later," ask: "Is it tracked? What's the fix timeline? Is this blocking release?"
3. Escalate: If a critical bug is dismissed without a plan, flag as ESCALATE — "Critical bug without fix plan or timeline. Release risk: [specific impact on players]."

---

## Step 0: QA Scope & Mode Selection

Before testing, define what's being tested and how thoroughly.

**AskUserQuestion:**

> **[Re-ground]** Starting QA for `[game title]` version `[version]` on `[branch]`.
>
> **[Simplify]** QA can mean testing everything or testing one specific thing. Like a car inspection — sometimes you need a full MOT, sometimes you just need to check the brakes after a repair. Tell me what you need.
>
> **RECOMMENDATION:** Choose based on release stage. Pre-release = Full QA. Mid-development = Targeted. Post-hotfix = Regression.
>
> - **A) Full QA** — All 8 categories, all platforms. For pre-release or milestone builds. Player Impact: 10/10. (CC: ~60-90 min)
> - **B) Targeted QA** — Specific categories only (e.g., just Performance + Functional after optimization work). Player Impact: 7/10. (CC: ~20-30 min)
> - **C) Regression QA** — Test only areas affected by recent changes + critical path smoke test. Player Impact: 6/10. (CC: ~15-20 min)
> - **D) Platform-specific QA** — Full QA but focused on one platform (e.g., "does it work on iOS?"). Player Impact: 8/10. (CC: ~30-45 min)

### QA Context Required

1. **Build identifier** — Version, build number, commit hash
2. **Target platforms** — Which platforms are being tested?
3. **Test devices** — Specific devices/hardware being used
4. **Recent changes** — What changed since last QA? (for regression focus)
5. **Known issues** — Existing bugs to exclude from new findings

---

## Bug Severity Classification

**EVERY bug must be classified before counting. No exceptions.**

| Severity | Definition | Example | Score Impact |
|----------|------------|---------|--------------|
| **Critical** | Game-breaking. Crash, data loss, softlock, progression blocker. Player CANNOT continue. | Crash to desktop on level 3 boss. Save file corrupted after update. | -25 per bug |
| **High** | Major functionality broken. Player CAN continue but experience is significantly degraded. | Ability doesn't deal damage. Audio completely missing in a level. UI overlaps making menu unusable. | -15 per bug |
| **Medium** | Noticeable issue. Player experience affected but gameplay functional. | Animation glitch on death. Wrong sound effect for pickup. Minor frame drop in specific area. | -8 per bug |
| **Low** | Minor polish issue. Most players won't notice or won't care. | Pixel-off UI alignment. Subtitle slightly delayed. Texture seam visible only up close. | -3 per bug |

### Severity Disputes

If there's disagreement about severity, use this test:
- **Would a player quit the game because of this bug?** → Critical
- **Would a player complain about this bug in a review?** → High
- **Would a player notice this bug during normal play?** → Medium
- **Would a player only notice this if looking for it?** → Low

---

## Section 1: QA Scope Definition — (no score, framing only)

Document what is being tested. This section produces no score but frames all subsequent sections.

```
QA Scope
════════
Build: [version] ([build number]) — commit: [hash]
Platforms: [list]
Test devices: [list with specs]
Mode: [Full / Targeted / Regression / Platform-specific]
Categories in scope: [list]
Recent changes: [summary]
Known issues excluded: [list]
```

---

## Section 2: Functional Testing (功能測試) — Weight: 25%

Test that game mechanics work as designed.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Core mechanics** | Every verb in the core loop functions correctly | Critical |
| **Edge cases** | Rapid input, simultaneous actions, boundary values | High |
| **Save / Load** | Save, quit, reload — is state identical? | Critical |
| **Progression** | Can player advance through all gates? Any softlocks? | Critical |
| **Economy** | Purchase, earn, spend — are values correct? | High |
| **Tutorial** | Complete FTUE without errors or confusion | High |
| **Menu functions** | Every button/option works, settings persist | Medium |
| **State transitions** | Scene changes, pause/resume, backgrounding | Medium |

### Scoring

Start at 100. Deduct per bug found:
- Critical: -25
- High: -15
- Medium: -8
- Low: -3

**Section 2 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "Does the save file survive a force-quit mid-save?" — The most common data corruption scenario.
2. "What happens when you do the 'wrong' thing in the tutorial?" — Tutorials that only work on the happy path break immediately.
3. "Can you reach every progression milestone? Is there any point where forward progress is impossible?" — Softlocks are the worst functional bugs.

### Action Classification

- **AUTO:** Flag crashes with stack traces, obvious broken UI elements
- **ASK:** Severity classification for ambiguous bugs, edge case vs expected behavior disputes
- **ESCALATE:** Crash in core loop, save data corruption, progression softlock

**STOP.** One issue per AskUserQuestion.

---

## Section 3: Visual Testing (視覺測試) — Weight: 15%

Test rendering quality and visual consistency.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Rendering artifacts** | Z-fighting, texture pop-in, LOD transitions, shadow acne | High |
| **Animation** | Blending, transitions, T-pose, foot sliding, clipping | High |
| **UI rendering** | Overlap, overflow, scaling, font rendering, safe areas | High |
| **Particle effects** | Spawn correctly, despawn correctly, no lingering | Medium |
| **Camera** | Clipping through geometry, stuck states, smooth transitions | Medium |
| **Lighting** | Consistent across scenes, no light leaking, shadows correct | Medium |

### Scoring

Start at 100. Deduct per bug found:
- Critical: -25 (rendering makes game unplayable — black screen, extreme flicker)
- High: -15 (major visual bug always visible during normal play)
- Medium: -8 (visual bug visible sometimes during normal play)
- Low: -3 (visual bug only visible when looking for it)

**Section 3 Score: ___/100**

### Action Classification

- **AUTO:** Flag clearly broken rendering (black textures, missing models)
- **ASK:** Severity of visual glitches, "intended vs bug" visual decisions
- **ESCALATE:** Rendering makes game unplayable on a supported device

**STOP.** One issue per AskUserQuestion.

---

## Section 4: Performance Testing (效能測試) — Weight: 15%

Test frame rate, loading times, memory usage, and stability.

### Test Areas

| Area | What to Test | Benchmark |
|------|-------------|-----------|
| **Frame rate** | Average FPS, 1% lows, 0.1% lows in gameplay | Target FPS ±10% |
| **Loading times** | Initial load, scene transitions, respawn | <3s scene transition, <10s initial (mobile), <30s initial (PC/console) |
| **Memory usage** | Peak memory, memory growth over time (leak detection) | Below platform ceiling, no unbounded growth |
| **Hitches / Stutters** | Frame time spikes during gameplay | <3 hitches >100ms per minute |
| **Thermal** | Device temperature during extended play (mobile) | Device stays within normal thermal range after 30 min |
| **Battery** | Battery drain rate (mobile) | <15% per hour of active play |
| **Install / Update size** | Download and installed size per platform | Within platform limits |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (crash from memory, unplayable frame rate on target hardware)
- High: -15 (consistent FPS below target, loading >30s, memory leak)
- Medium: -8 (occasional hitches, loading slightly above target)
- Low: -3 (minor frame dips in non-critical moments)

**Section 4 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "What is the frame rate in the heaviest scene on the lowest-spec target device?" — If untested, performance is unknown where it matters most.
2. "Play for 30 minutes without restarting. Does memory usage grow continuously?" — Memory leaks only show under sustained play.

### Action Classification

- **AUTO:** Flag measured values that exceed benchmarks
- **ASK:** Performance vs quality trade-offs, acceptable frame rate thresholds
- **ESCALATE:** Crash from memory exhaustion, sustained frame rate below 50% of target

**STOP.** One issue per AskUserQuestion.

---

## Section 5: Audio Testing (音效測試) — Weight: 10%

Test sound effects, music, and audio system behavior.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Sound triggers** | Every action has its expected sound, at the right time | High |
| **Volume balance** | SFX vs music vs UI sounds — nothing overpowers others | High |
| **Music transitions** | Crossfades between tracks, correct music for scene | Medium |
| **Missing audio** | Any action or event with no sound when one is expected | High |
| **Audio overlap** | Rapid actions don't create ear-splitting stacking | Medium |
| **Mute / Settings** | Volume sliders work, mute persists across sessions | Medium |
| **Spatial audio** | 3D sound positioning correct (if applicable) | Low |

### Scoring

Start at 100. Deduct per bug:
- Critical: -25 (audio causes crash, audio completely absent)
- High: -15 (wrong sound for major action, music doesn't play)
- Medium: -8 (volume imbalance, missing sound for minor action)
- Low: -3 (subtle timing issue, minor spatial audio error)

**Section 5 Score: ___/100**

### Action Classification

- **AUTO:** Flag silent events that should have sound
- **ASK:** Volume balance preferences, music transition style
- **ESCALATE:** Audio system crash, all audio missing

**STOP.** One issue per AskUserQuestion.

---

## Section 6: Input Testing (輸入測試) — Weight: 10%

Test all supported input methods.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Primary input** | Every action responsive with correct input method | Critical |
| **Input switching** | Hot-swap between controller/keyboard/touch mid-game | High |
| **Button prompts** | Displayed prompts match active input device | High |
| **Rebinding** | Custom keybinds work and persist | Medium |
| **Dead zones** | Analog stick dead zones appropriate (not too sensitive, not too dead) | Medium |
| **Simultaneous input** | Multiple buttons, multi-touch, modifier keys | Medium |
| **Touch targets** | Touch targets >=44px, no overlapping hit areas (mobile) | High (mobile) |

### Scoring

Start at 100. Deduct per bug:
- Critical: -25 (input doesn't respond, game unplayable with target input method)
- High: -15 (wrong button prompt, rebinding broken, touch target too small for core action)
- Medium: -8 (minor dead zone issue, prompt flicker on input switch)
- Low: -3 (cosmetic prompt issue, slightly off touch target for non-critical button)

**Section 6 Score: ___/100**

### Action Classification

- **AUTO:** Flag obvious prompt mismatches
- **ASK:** Dead zone tuning, touch target sizing, input priority decisions
- **ESCALATE:** Core input method non-functional on target platform

**STOP.** One issue per AskUserQuestion.

---

## Section 7: Compatibility Testing (相容性測試) — Weight: 10%

Test across target devices, OS versions, and screen configurations.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Target devices** | Game runs on all stated supported devices | Critical |
| **OS versions** | Minimum supported OS version works | Critical |
| **Screen resolutions** | All target resolutions render correctly | High |
| **Aspect ratios** | 16:9, 18:9, 21:9, 4:3 — no cut-off, no stretching | High |
| **Notch / Safe area** | UI respects device notches and rounded corners | Medium (mobile) |
| **Low-end fallback** | Quality settings degrade gracefully on weak hardware | Medium |
| **External displays** | HDMI out, screen mirroring, ultrawide (if applicable) | Low |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (game doesn't launch on supported device/OS)
- High: -15 (major rendering issue on specific device, UI cut off)
- Medium: -8 (minor rendering difference, suboptimal performance tier)
- Low: -3 (cosmetic difference between devices)

**Section 7 Score: ___/100**

### Action Classification

- **AUTO:** Flag devices where game fails to launch
- **ASK:** Supported device list decisions, minimum spec adjustments
- **ESCALATE:** Game non-functional on primary target platform

**STOP.** One issue per AskUserQuestion.

---

## Section 8: Localization Testing (在地化測試) — Weight: 5%

Test localized text, layout, and cultural appropriateness.

**Skip if game is single-language only.** Score as N/A and redistribute 5% weight to Functional (+3%) and Visual (+2%).

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Text overflow** | Translated text fits within UI containers (German +30%, Japanese variable) | High |
| **Missing translations** | Any untranslated strings in non-source language | High |
| **Font support** | All characters render correctly (CJK, Arabic RTL, diacritics) | Critical |
| **Cultural issues** | Icons, colors, gestures that may be offensive in target locales | Medium |
| **Number/Date formats** | Currency, dates, numbers formatted per locale | Medium |
| **Concatenated strings** | Strings built by concatenation often break in other languages | Medium |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (missing font causes crash or tofu characters for entire language)
- High: -15 (text overflow hides gameplay information, missing translations)
- Medium: -8 (minor overflow, wrong number format)
- Low: -3 (cosmetic spacing difference)

**Section 8 Score: ___/100**

### Action Classification

- **AUTO:** Flag obviously untranslated strings, text overflow
- **ASK:** Cultural sensitivity questions, locale-specific formatting decisions
- **ESCALATE:** Entire language unreadable due to font issue

**STOP.** One issue per AskUserQuestion.

---

## Section 9: Progression Testing (進度完整性測試) — Weight: 10%

Test that a player can complete the game from start to finish without blocks.

### Test Areas

| Area | What to Test | Priority |
|------|-------------|----------|
| **Full playthrough** | Can a player reach the end/endgame from a fresh start? | Critical |
| **Softlock check** | Any state where player cannot progress forward or backward? | Critical |
| **Achievement triggers** | All achievements/trophies attainable? | High |
| **Save migration** | Old saves work after update? | Critical (for updates) |
| **Alternative paths** | All branches/choices lead somewhere valid? | High |
| **Endgame loop** | Post-completion content accessible and functional? | Medium |
| **New game plus** | If applicable, NG+ works with carried-over state | Medium |

### Scoring

Start at 100. Deduct per issue:
- Critical: -25 (softlock, save migration failure, impossible achievement)
- High: -15 (progression requires unintended workaround, dead-end branch)
- Medium: -8 (minor progression confusion, misleading objective)
- Low: -3 (cosmetic progression display issue)

**Section 9 Score: ___/100**

### Forcing Questions (must ask at least 2)

1. "Can you reach the credits / endgame from a fresh save without exploits?" — The definitive progression test.
2. "Load a save from the previous version. Does everything work?" — Save migration failures cause the most player anger.

### Action Classification

- **AUTO:** Flag unreachable achievements, dead-end state machines
- **ASK:** Intended vs unintended progression sequence, difficulty-gated progression disputes
- **ESCALATE:** Softlock in main progression path, save migration data loss

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### QA Health Score

Calculate after all sections are tested:

```
QA Health Score
═══════════════════════════════════════════════
  Section 2 — Functional:       ___/100  (weight: 25%)  → weighted: __.__
  Section 3 — Visual:           ___/100  (weight: 15%)  → weighted: __.__
  Section 4 — Performance:      ___/100  (weight: 15%)  → weighted: __.__
  Section 5 — Audio:            ___/100  (weight: 10%)  → weighted: __.__
  Section 6 — Input:            ___/100  (weight: 10%)  → weighted: __.__
  Section 7 — Compatibility:    ___/100  (weight: 10%)  → weighted: __.__
  Section 8 — Localization:     ___/100  (weight:  5%)  → weighted: __.__
  Section 9 — Progression:      ___/100  (weight: 10%)  → weighted: __.__
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:               __.__/100

Score Interpretation:
  90-100  RELEASE-READY — Ship with confidence
  75-89   GOOD — Minor issues, shippable with known issues list
  60-74   NEEDS WORK — Significant bugs, fix before release
  40-59   POOR — Major quality issues, not ready for players
  0-39    CRITICAL — Game-breaking issues, needs fundamental fixes

Bug Summary:
  Critical: ___ (list each)
  High:     ___
  Medium:   ___
  Low:      ___
  Total:    ___

Top 3 Score Impacts:
  1. [Category] [Bug]: -___ because [specific reason]
  2. [Category] [Bug]: -___ because [specific reason]
  3. [Category] [Bug]: -___ because [specific reason]
```

---

## Phase: Baseline Score

After all sections are tested, calculate the QA Health Score. This is the **baseline** — the state BEFORE any fixes.

```bash
_BASELINE_FILE="/tmp/game-qa-baseline-${_BRANCH}.json"
echo '{"timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","score":BASELINE_SCORE,"bugs":{"critical":N,"high":N,"medium":N,"low":N}}' > "$_BASELINE_FILE"
echo "Baseline saved: $_BASELINE_FILE"
```

Present the baseline:

> **QA Baseline: ___/100**
> Critical: ___ | High: ___ | Medium: ___ | Low: ___
> Release status at baseline: [SHIP / SHIP_WITH_KNOWN / DO_NOT_SHIP]
>
> A) **Enter fix loop** — fix what I can, re-test, re-score
> B) **Report only** — no fixes, just the bug report (like /qa-only)
> C) **Stop here** — save baseline, fix manually, re-run /game-qa later

**STOP.** Wait for answer.

If B or C: skip to Completion Summary with baseline as final score.

---

## Phase: Triage

Sort all bugs by severity (Critical → High → Medium → Low). For each severity tier, classify:

| Bug | Fixable by agent? | Action |
|-----|------------------|--------|
| [bug] | YES — code fix | Enter fix loop |
| [bug] | YES — config/data change | Enter fix loop |
| [bug] | NO — needs design decision | Report as ASK |
| [bug] | NO — needs assets/content | Report as deferred |
| [bug] | NO — platform/hardware issue | Report as deferred |

Present triage results:

> **Fix loop will address:** ___ bugs (___ critical, ___ high, ___ medium)
> **Deferred (need human):** ___ bugs
> **Skipped (low severity, below tier):** ___ bugs
>
> Proceed with fix loop?
> A) Yes — fix all fixable bugs
> B) Fix critical + high only
> C) Skip fixes, report only

**STOP.** Wait for answer.

---

## Phase: Fix Loop

For each fixable bug, in severity order (Critical first):

### Step A: Locate Source

```bash
# Find the relevant source file
grep -rn "KEYWORD_FROM_BUG" src/ scripts/ game/ 2>/dev/null | head -10
```

Only modify files directly related to the bug. No refactoring. No "improvements."

### Step B: Fix (minimal change)

Apply the smallest possible fix. One bug = one change.

**Rules:**
- Fix the bug, nothing else
- No refactoring adjacent code
- No "while I'm here" improvements
- If fix requires changing >3 files → flag as ASK, don't auto-fix

### Step C: Atomic Commit

```bash
git add <only-changed-files>
git commit -m "fix(qa): BUG-NNN — short description"
```

One commit per bug. Never bundle.

### Step D: Re-test

Re-test the specific bug:
- Does the fix resolve the issue?
- Does it introduce any visible regression?

### Step E: Classify

| Result | Action |
|--------|--------|
| **verified** | Bug fixed, confirmed by re-test. Continue. |
| **best-effort** | Fix applied but can't fully verify (needs specific device, auth state, etc.). Note limitation. |
| **reverted** | Fix caused regression or didn't work. `git revert HEAD`. Mark as deferred. |

### Step F: WTF-Likelihood Check (every 5 fixes)

```
WTF-LIKELIHOOD:
  Start at 0%
  Each revert:                +15%
  Each fix touching >3 files: +5%
  After fix 15:               +1% per additional fix
  All remaining Low severity: +10%

  > 20% → STOP. Ask user: "I've made N fixes. M reverted. Continue or stop?"
  Hard cap: 30 fixes → stop regardless
```

---

## Phase: Final Re-score

After all fixes (or fix loop stopped):

1. Re-test all sections that had bugs fixed
2. Calculate final QA Health Score
3. Compare to baseline

```
Score Delta:
  Section           Baseline    Final    Change
  Functional:       ___/100     ___/100  +___
  Visual:           ___/100     ___/100  +___
  Performance:      ___/100     ___/100  +___
  Audio:            ___/100     ___/100  +___
  Input:            ___/100     ___/100  +___
  Compatibility:    ___/100     ___/100  +___
  Localization:     ___/100     ___/100  +___
  Progression:      ___/100     ___/100  +___
  WEIGHTED TOTAL:   ___/100     ___/100  +___
```

**⚠️ If final score < baseline: WARN prominently.** A fix introduced a regression. List which fixes were made since baseline and which section regressed.

---

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-qa-report-${_DATETIME}.md"
```

Write the full QA report (Baseline + Fixes Applied + Final Score + Delta + Bug List) to `$_PROJECTS_DIR/{user}-{branch}-qa-report-{datetime}.md`. If prior QA report exists, include `Supersedes: {prior}`.

This artifact is discoverable by:
- `/game-ship` — checks QA status as release gate
- `/game-retro` — reads bug counts for sprint metrics
- `/game-debug` — reads bug details for investigation

---

### Completion Summary

```
/game-qa Completion Summary
═══════════════════════════════════
Game: [title]
Version: [version] ([build number])
Branch: [branch]
Mode: [Full / Targeted / Regression / Platform-specific]
Platforms tested: [list]
Devices tested: [list]

Section Results:
  Section 1 — Scope:           [defined]
  Section 2 — Functional:      ___/100, ___ bugs found (___ critical, ___ high, ___ medium, ___ low)
  Section 3 — Visual:          ___/100, ___ bugs found
  Section 4 — Performance:     ___/100, ___ issues found
  Section 5 — Audio:           ___/100, ___ bugs found
  Section 6 — Input:           ___/100, ___ bugs found
  Section 7 — Compatibility:   ___/100, ___ issues found
  Section 8 — Localization:    ___/100 (or N/A), ___ issues found
  Section 9 — Progression:     ___/100, ___ issues found

WEIGHTED TOTAL (baseline): __.__/100
WEIGHTED TOTAL (final):    __.__/100  (+__.__)

Fix Loop:
  Bugs fixed (verified): ___
  Bugs fixed (best-effort): ___
  Bugs reverted: ___
  Bugs deferred: ___

Release Recommendation: SHIP / SHIP_WITH_KNOWN_ISSUES / DO_NOT_SHIP / BLOCKED
Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All in-scope sections tested, QA Health Score >= 75
- **DONE_WITH_CONCERNS** — All tested, score 60-74 or unresolved high-severity bugs
- **BLOCKED** — Testing could not complete (build crashes, cannot install on target device)
- **NEEDS_CONTEXT** — Testing paused (no build available, no test devices, scope undefined)

**Release Recommendation definitions:**
- **SHIP** — Score >= 90, 0 critical bugs, 0 high bugs
- **SHIP_WITH_KNOWN_ISSUES** — Score >= 75, 0 critical bugs, high bugs documented with timeline
- **DO_NOT_SHIP** — Score < 75 OR any critical bugs
- **BLOCKED** — Cannot produce a recommendation (testing incomplete)

### Bug Report Template

For each bug found:
```
BUG-[number]
  Severity: [Critical / High / Medium / Low]
  Category: [Functional / Visual / Performance / Audio / Input / Compatibility / Localization / Progression]
  Summary: [one-line description]
  Steps to Reproduce:
    1. [step]
    2. [step]
    3. [step]
  Expected: [what should happen]
  Actual: [what actually happens]
  Platform: [platform + device]
  Frequency: [always / sometimes (~X%) / rare]
  Screenshot/Video: [reference if available]
```

### NOT in Scope

```
- [Area]: Not tested because [reason]. Recommend testing when [condition].
```

---

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-qa","timestamp":"TIMESTAMP","status":"STATUS","score":"SCORE","mode":"MODE","bugs":{"critical":N,"high":N,"medium":N,"low":N,"total":N},"release_recommendation":"RECOMMENDATION","sections":{"functional":N,"visual":N,"performance":N,"audio":N,"input":N,"compatibility":N,"localization":N,"progression":N},"commit":"COMMIT"}' 2>/dev/null || true
```
