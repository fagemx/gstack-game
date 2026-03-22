---
name: game-ship
description: "Game release workflow. Build, test, changelog, PR, platform submission. Supports Steam, App Store, Google Play, Web, and custom pipelines."
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
echo '{"skill":"game-ship","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
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
  --skill "game-ship" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Release Context Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
VERSION=$(cat version.txt 2>/dev/null || cat package.json 2>/dev/null | grep '"version"' | head -1 | sed 's/.*: *"\(.*\)".*/\1/' || echo "UNKNOWN")
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "no tags")
COMMITS_SINCE=$(git rev-list ${LAST_TAG}..HEAD --count 2>/dev/null || echo "?")
echo "Project: $SLUG"
echo "Current version: $VERSION"
echo "Last tag: $LAST_TAG"
echo "Commits since last release: $COMMITS_SINCE"
echo "Branch: $(git branch --show-current 2>/dev/null)"
echo "Uncommitted changes: $(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
```

If there are uncommitted changes, warn immediately — do not proceed with a dirty working tree.

---

# /game-ship: Game Release Process

A structured release workflow for shipping game builds. This is a PROCESS skill, not a review skill — completion is measured by checklist completion %, not a quality score. Every step is verified before proceeding to the next.

This skill works through each release phase one step at a time via AskUserQuestion. It does NOT auto-execute build commands — it guides the process and verifies outcomes.

## Anti-Sycophancy Protocol

**FORBIDDEN PHRASES — never use these or any paraphrase:**
- "The build looks great!"
- "Ready to ship!"
- "Players will be excited"
- "Great release"
- "Everything looks clean"
- "This is a solid build"
- "Nice changelog"

**CALIBRATED ACKNOWLEDGMENT — use this instead:**
- State facts: "Build succeeded on all 3 platforms with 0 warnings. Test suite passed 247/247. Build size is 142MB, within the 150MB App Store OTA limit."
- If a step genuinely passes, state WHAT was verified and the specific result, never just say it's "good."

**PUSH-BACK CADENCE:**
1. Push once: "Test X is failing. This blocks release."
2. Push again: If the response is "it's a known issue," ask: "Is it documented in the release notes? Does it have a hotfix timeline? Is it ship-blocking or accepted risk?"
3. Escalate: If critical test fails and team wants to ship anyway, flag as ESCALATE — "Shipping with a failing critical test requires explicit sign-off with documented risk acceptance."

---

## Phase 1: Pre-flight Check

Verify ALL of these before proceeding. Any failure blocks the release unless explicitly overridden.

### Pre-flight Checklist

| Check | Command / Method | Pass Criteria | Status |
|-------|------------------|---------------|--------|
| **Clean working tree** | `git status` | 0 uncommitted changes | [ ] |
| **On release branch** | `git branch --show-current` | On `main`, `release/*`, or designated branch | [ ] |
| **Version bumped** | Check version file | Version > last released version | [ ] |
| **All tests pass** | `npm test` / engine test runner | 0 failures | [ ] |
| **No critical bugs open** | Bug tracker / issue list | 0 critical/blocker issues | [ ] |
| **Build succeeds** | Platform build command | Exit code 0, no errors | [ ] |
| **Changelog prepared** | Check changelog file | Current version has entry | [ ] |

**AskUserQuestion:**

> **[Re-ground]** Preparing release for `[game title]` version `[version]` on `[branch]`.
>
> **[Simplify]** Before shipping anything, I need to verify the basics — like a pilot running through a pre-flight checklist before takeoff. Skipping checks here means discovering problems after players have the build.
>
> **RECOMMENDATION:** Run full pre-flight. Skipping checks has historically caused ~40% of day-one patches.
>
> - **A) Full pre-flight** — Run every check. Takes longer but catches issues before players do. Player Impact: 9/10.
> - **B) Abbreviated pre-flight** — Tests + build only. Skip changelog and version verification. Player Impact: 6/10.
> - **C) Emergency hotfix mode** — Minimal checks. Only verify the specific fix works and build succeeds. Player Impact: 3/10 (acceptable for critical hotfixes only).

### Action Classification

- **AUTO:** Flag uncommitted changes, version not bumped, changelog missing
- **ASK:** Override failing non-critical test, release branch selection
- **ESCALATE:** Critical test failing, build fails, uncommitted changes with no resolution

**STOP.** One issue per AskUserQuestion.

---

## Phase 2: Platform Detection & Configuration

Determine which platforms this release targets and configure accordingly.

**AskUserQuestion:**

> **[Re-ground]** Building release `[version]` for `[game title]`.
>
> **[Simplify]** Different stores have different rules — like how different countries have different customs forms. I need to know which platforms you're shipping to so I can check the right requirements.
>
> **RECOMMENDATION:** Select all platforms that need this release. Staggered releases (e.g., Steam first, then mobile) are fine — I'll track each separately.
>
> - **A) Steam** — Steamworks, depot upload, store page verification
> - **B) iOS / App Store** — Xcode archive, App Store Connect, review submission
> - **C) Android / Google Play** — AAB build, Play Console, staged rollout
> - **D) Web** — Build, deploy to hosting, CDN invalidation
> - **E) Console (PlayStation / Xbox / Switch)** — Platform-specific SDK build, certification submission
> - **F) Itch.io / Other** — Custom build and upload process
> - **G) Multiple platforms** — Specify which combination

For each selected platform, the following phases will be run platform-specifically.

---

## Phase 3: Build & Package

For each target platform, verify build output.

### Per-Platform Build Verification

**Steam:**
| Check | Pass Criteria |
|-------|---------------|
| Build completes | Exit code 0 |
| Depot content correct | All required files present, no debug symbols in release |
| Build size | Within expected range (flag if >20% change from last release) |
| DRM / Steamworks SDK | Integrated correctly, API calls succeed |

**iOS / App Store:**
| Check | Pass Criteria |
|-------|---------------|
| Archive succeeds | Valid .ipa generated |
| Signing valid | Correct provisioning profile, distribution certificate |
| Info.plist correct | Bundle version matches, required keys present |
| Size check | < 200MB for OTA install, or App Thinning configured |
| Privacy manifest | NSPrivacyTracking declarations complete |

**Android / Google Play:**
| Check | Pass Criteria |
|-------|---------------|
| AAB build succeeds | Valid .aab generated |
| Signing correct | Release keystore used (NOT debug) |
| Target API level | Meets current Play Store requirement |
| Permissions | Only declared permissions are justified |
| 64-bit requirement | All native libs include arm64-v8a |

**Web:**
| Check | Pass Criteria |
|-------|---------------|
| Build succeeds | All assets compiled, no missing references |
| Bundle size | Within budget, source maps separated |
| Service worker | Updated with new version hash |
| HTTPS | All resources served over HTTPS |

### Action Classification

- **AUTO:** Flag build warnings, missing files, signing errors
- **ASK:** Build configuration choices, DRM decisions, size optimization trade-offs
- **ESCALATE:** Build fails on any target platform, signing certificate expired

**STOP.** One issue per AskUserQuestion.

---

## Phase 4: Changelog & Patch Notes

Generate TWO versions of the changelog from commits since last release.

### Internal Changelog (for team)

```
## [version] — [date]

### Added
- [Technical description of new feature] (commit: abc1234)

### Changed
- [Technical description of change] (commit: def5678)

### Fixed
- [Bug description with root cause] (commit: ghi9012)

### Known Issues
- [Issue description] — [workaround if any] — [planned fix timeline]
```

### Player-Facing Patch Notes (for players)

Rules for player-facing notes:
1. **No technical jargon.** "Fixed a crash" not "fixed null reference in EntityManager.Update"
2. **Lead with what players care about.** New content first, then balance changes, then bug fixes
3. **Be specific about balance changes.** "Warrior base damage: 25 → 30" not "buffed Warrior"
4. **Acknowledge known issues.** Players respect honesty more than silence
5. **Credit the community.** If a bug was reported by players, say so

```
## [Game Title] — Update [version]

### New
- [What players can now DO that they couldn't before]

### Balance Changes
- [Specific change with old → new values]

### Bug Fixes
- [What was broken, now fixed — in player language]

### Known Issues
- [What's still broken and when you plan to fix it]
```

**AskUserQuestion:**

> **[Re-ground]** Drafting patch notes for `[game title]` version `[version]`.
>
> **[Simplify]** Patch notes are how players learn what changed. Good notes build trust; bad notes cause confusion. I'll draft both internal (for team) and player-facing (for players) versions.
>
> **RECOMMENDATION:** Review and edit the draft. Auto-generated changelogs from commits are a starting point, not a finished product.
>
> - **A) Draft from commits** — I'll generate both versions from git log. You review and edit. (CC: ~5 min)
> - **B) You provide notes** — Paste your changelog, I'll review for completeness and clarity.
> - **C) Skip changelog** — Not recommended. Undocumented changes frustrate players and team.

### Action Classification

- **AUTO:** Format inconsistencies, missing version header, date errors
- **ASK:** Changelog wording, what to include/exclude, tone and phrasing
- **ESCALATE:** No changelog for a player-facing release — players deserve to know what changed

**STOP.** One issue per AskUserQuestion.

---

## Phase 5: Submission Checklist

Per-platform submission requirements. Each item must be verified.

### Steam Submission

| Step | Details | Status |
|------|---------|--------|
| Store page updated | Screenshots, description, system requirements current | [ ] |
| Depot configured | Correct branch/depot mapping | [ ] |
| Build uploaded | `steamcmd` upload successful | [ ] |
| Set build live | On correct branch (default / beta / prerelease) | [ ] |
| Community announcement | Patch notes posted to Steam community | [ ] |
| Achievement changes | Any new achievements propagated | [ ] |

### App Store Submission

| Step | Details | Status |
|------|---------|--------|
| Screenshots current | Per-device size, current UI reflected | [ ] |
| Privacy policy URL | Valid, accessible, up to date | [ ] |
| Age rating | Accurate for current content | [ ] |
| In-app purchases | All IAPs configured and tested | [ ] |
| App Review notes | Explain any non-obvious features to reviewer | [ ] |
| Phased release | Percentage rollout configured (recommended: 10% start) | [ ] |

### Google Play Submission

| Step | Details | Status |
|------|---------|--------|
| Target API level | Meets current requirement | [ ] |
| Content rating | IARC questionnaire current | [ ] |
| Data safety | Privacy declarations accurate | [ ] |
| Release track | Production / Open testing / Closed testing | [ ] |
| Staged rollout | Percentage configured (recommended: 10% start) | [ ] |
| Crash rate baseline | Current crash rate documented for comparison | [ ] |

### Web Deployment

| Step | Details | Status |
|------|---------|--------|
| Deploy to staging | Staging environment verified | [ ] |
| CDN cache invalidated | All edge nodes serving new version | [ ] |
| Service worker updated | Old cache cleared, new assets cached | [ ] |
| Analytics verified | Events firing correctly for new features | [ ] |
| Rollback tested | Previous version can be restored within [X] minutes | [ ] |

### Action Classification

- **AUTO:** Flag missing checklist items, incomplete store metadata
- **ASK:** Release track selection, rollout percentage, phased release timing
- **ESCALATE:** Submission rejection from platform, missing required metadata that blocks submission

**STOP.** One issue per AskUserQuestion.

---

## Phase 6: Smoke Test

After deployment, verify critical player paths work on the live build.

### Critical Path Verification

Run through this sequence on EACH target platform:

```
1. Launch game                    → Game loads to main menu?          [ ]
2. Start new game / play          → Core loop accessible?             [ ]
3. Complete first meaningful action → Mechanic works as expected?     [ ]
4. Trigger save (manual or auto)  → Save completes without error?     [ ]
5. Quit game                      → Clean exit, no crash?             [ ]
6. Relaunch game                  → Game loads, main menu appears?    [ ]
7. Load save / continue           → Progress restored correctly?      [ ]
8. Access store / IAP (if any)    → Prices correct, purchase works?   [ ]
9. Connect multiplayer (if any)   → Can join/create session?          [ ]
10. Check version display         → Shows correct version number?     [ ]
```

### Smoke Test Results

```
Platform: [platform]
Build: [version] ([build number])
Time: [timestamp]

Results:
  Steps passed: _/10
  Steps failed: _ (list: ___)
  Steps skipped: _ (list: ___)

Verdict: PASS / FAIL / PASS_WITH_KNOWN_ISSUES
```

### Action Classification

- **AUTO:** Version number mismatch
- **ASK:** Non-critical smoke test failure — ship with known issue or hotfix?
- **ESCALATE:** Critical path failure (crash on launch, save corruption, purchase broken)

**STOP.** One issue per AskUserQuestion.

---

## Phase 7: Rollback Plan

Document the rollback procedure BEFORE shipping. Do not wait for a crisis.

### Rollback Checklist

| Platform | Rollback Method | Time to Rollback | Tested? |
|----------|-----------------|------------------|---------|
| Steam | Set previous build live on branch | ~5 minutes | [ ] |
| App Store | Withdraw update (if not yet approved) or submit revert build | 24-48 hours (review) | [ ] |
| Google Play | Halt staged rollout + upload revert build | ~2 hours (staged), 24h (full) | [ ] |
| Web | Redeploy previous build from CI/CD or CDN rollback | ~5-15 minutes | [ ] |

### Rollback Trigger Criteria

Define BEFORE shipping what constitutes a rollback trigger:
- Crash rate > [X]% (recommend: >2% of sessions)
- Revenue drop > [X]% vs previous day (recommend: >20%)
- Player-reported data loss
- Multiplayer unplayable
- Certification failure post-launch

**AskUserQuestion:**

> **[Re-ground]** Finalizing release plan for `[game title]` version `[version]`.
>
> **[Simplify]** A rollback plan is like a fire escape — you need to know where it is BEFORE you need it. If the release goes badly, how fast can we get players back to a working version?
>
> **RECOMMENDATION:** Define rollback triggers and test the rollback procedure on at least one platform.
>
> - **A) Full rollback plan** — Define triggers, document procedure, test on all platforms. (human: ~30 min)
> - **B) Basic rollback plan** — Document procedure, skip testing. (human: ~10 min)
> - **C) Skip rollback plan** — Not recommended for any non-trivial release. Player Impact: -8/10 if needed.

### Action Classification

- **AUTO:** Missing rollback documentation
- **ASK:** Rollback trigger thresholds, platform-specific rollback strategy
- **ESCALATE:** No rollback mechanism exists for a live-service game

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### Release Completion Report

```
/game-ship Release Report
═══════════════════════════════════
Game: [title]
Version: [version]
Date: [date]
Branch: [branch]
Platforms: [list]

Phase Completion:
  Phase 1 — Pre-flight:        _/7 checks passed    [PASS/FAIL]
  Phase 2 — Platform Config:   [platforms selected]  [DONE]
  Phase 3 — Build & Package:   _/_ platforms built   [PASS/FAIL]
  Phase 4 — Changelog:         [drafted/reviewed]    [DONE/SKIP]
  Phase 5 — Submission:        _/_ items verified    [PASS/FAIL]
  Phase 6 — Smoke Test:        _/10 steps passed     [PASS/FAIL]
  Phase 7 — Rollback Plan:     [documented/tested]   [DONE/SKIP]

Overall Completion: ___%
Status: SHIPPED / SHIPPED_WITH_KNOWN_ISSUES / BLOCKED / ABORTED
```

**Status definitions:**
- **SHIPPED** — All phases complete, all checks passed, build live on all target platforms
- **SHIPPED_WITH_KNOWN_ISSUES** — Build live but with documented known issues and hotfix timeline
- **BLOCKED** — Release blocked by critical failure (build fails, critical test fails, submission rejected)
- **ABORTED** — Release cancelled (by user decision or ESCALATE trigger)

### Known Issues (if SHIPPED_WITH_KNOWN_ISSUES)

```
- [Issue]: [description]. Severity: [Critical/High/Medium/Low]. Hotfix ETA: [date]. Workaround: [if any].
```

### Post-Release Monitoring Checklist

```
  [ ] Crash rate monitored for 24 hours
  [ ] Revenue metrics compared to baseline
  [ ] Player reviews/feedback checked (Steam reviews, App Store reviews, social media)
  [ ] Multiplayer stability verified (if applicable)
  [ ] Analytics events firing correctly for new features
  [ ] Community announcement posted
```

### NOT in Scope

List deferred work:
```
- [Issue]: Deferred because [reason]. Revisit when [condition].
```

---

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-ship","timestamp":"TIMESTAMP","status":"STATUS","version":"VERSION","platforms":"PLATFORMS","completion_pct":N,"phases":{"preflight":"RESULT","build":"RESULT","changelog":"RESULT","submission":"RESULT","smoke":"RESULT","rollback":"RESULT"},"commit":"COMMIT"}' 2>/dev/null || true
```
