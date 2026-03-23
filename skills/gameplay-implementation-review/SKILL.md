---
name: gameplay-implementation-review
description: "Use when a PR or code change exists for a game project and you need to review it for both code quality AND design intent survival. Evolved from /game-code-review — adds Pass 0 checking whether design intent from handoff survived implementation. Not for reviewing design docs (use /game-review), not for feel evaluation (use /feel-pass), not for playability (use /build-playability-review)."
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
echo '{"skill":"gameplay-implementation-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "gameplay-implementation-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References (BEFORE any interaction)

```bash
SKILL_DIR="$(find . -path '*skills/gameplay-implementation-review/references' -type d 2>/dev/null | head -1)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(find ~/.claude -path '*skills/gameplay-implementation-review/references' -type d 2>/dev/null | head -1)"
echo "References at: $SKILL_DIR"
ls "$SKILL_DIR/" 2>/dev/null
```

Read ALL reference files now:
- `references/gotchas.md` — Claude-specific mistakes, anti-sycophancy
- `references/design-intent-checks.md` — Pass 0: handoff acceptance, soul preservation, scope boundaries, value consistency, silent experience changes
- `references/pass1-critical.md` — Pass 1: frame budget, memory, state sync, serialization, input, security
- `references/pass2-informational.md` — Pass 2: data-driven, organization, testing, performance, dead code + file type domain rules

---

# /gameplay-implementation-review: Code Quality + Design Intent Survival

Three-pass review for game projects. **Pass 0** checks whether design intent from the handoff survived. **Pass 1** catches critical code issues (frame budget, memory, networking, serialization). **Pass 2** flags informational findings.

Every finding is triaged AUTO/ASK/ESCALATE before presenting. Works with any engine.

---

## Step 0: Diff Scope Analysis

```bash
_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null || echo "HEAD~1")
_DIFF_STAT=$(git diff --stat "$_BASE"...HEAD 2>/dev/null)
_DIFF_LOC=$(git diff "$_BASE"...HEAD --numstat 2>/dev/null | awk '{s+=$1+$2} END {print s+0}')
_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
echo "BASE: $_BASE | DIFF_LOC: $_DIFF_LOC | COMMIT: $_COMMIT"
echo "$_DIFF_STAT"
```

## Artifact Discovery

```bash
echo "=== Checking for upstream artifacts ==="
PREV_REVIEW=$(ls -t $_PROJECTS_DIR/*-code-review-*.md $_PROJECTS_DIR/*-impl-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_REVIEW" ] && echo "Prior review: $PREV_REVIEW"
HANDOFF=$(ls -t $_PROJECTS_DIR/*-handoff-*.md 2>/dev/null | head -1)
[ -n "$HANDOFF" ] && echo "Handoff: $HANDOFF"
PREV_ENG=$(ls -t $_PROJECTS_DIR/*-eng-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_ENG" ] && echo "Eng review: $PREV_ENG"
echo "---"
```

Read the full diff, then read the handoff if it exists.

### Scope Classification

| Diff Size | LOC | Review Depth |
|-----------|-----|-------------|
| Small | <50 | Pass 0 + Pass 1 only |
| Medium | 50-199 | All three passes |
| Large | 200+ | All three passes + adversarial |

**AskUserQuestion — confirm scope:**

> **[Re-ground]** Reviewing `[branch]` → `[base]`. {N} files, {LOC} lines.
> Handoff: {found / not found}
> Depth: {Small/Medium/Large}
>
> A) Proceed
> B) Adjust scope
> C) Force full review

**STOP.**

---

## Pass 0: Design Intent Survival (NEW)

**Skip if no handoff exists.** Apply `references/design-intent-checks.md`:

- §0.1: Check each handoff acceptance criterion against code
- §0.2: Check soul preservation (is the one critical thing protected?)
- §0.3: Check scope boundaries (over-scope? missing MUST items?)
- §0.4: Check gameplay values match design values
- §0.5: Flag silent experience changes (refactors that alter feel)

**STOP.** Present Pass 0 findings. Each ASK item one at a time.

---

## Pass 1: Critical Issues

Apply `references/pass1-critical.md`. Six subsections: frame budget, memory, state sync, serialization, input, security.

**STOP.** Present AUTO-fixed summary, then each ASK item one at a time. ESCALATE items stop review immediately.

---

## Pass 2: Informational

Only after Pass 1 resolved. Apply `references/pass2-informational.md`. Five subsections: data-driven, organization, testing, performance, dead code.

**STOP.** Present findings. Ask: continue to adversarial, or done?

---

## Adversarial Pass (Large diffs only)

Launch independent subagent reviewing the raw diff as: (1) a cheater, (2) a crash tester, (3) a speedrunner. Cross-reference with Pass 1/2 findings.

---

## Action Triage

### AUTO — fix silently
Import ordering, formatting, unused vars, simple naming, obvious missing delta.

### ASK — one at a time
Architecture decisions, performance tradeoffs, gameplay logic vs design doc, API changes, network authority, design intent mismatches from Pass 0.

### ESCALATE — stop immediately
Security vulnerability, client-authoritative cheat vector, data loss risk, core system change with no tests, 3+ interconnected issues suggesting wrong abstraction, soul of mechanic destroyed by implementation.

---

## Pass Transitions

After each pass: present summary → ask before continuing.

> Pass 0 complete. {N} design intent findings.
> Pass 1 complete. {N} critical issues.
> A) Continue to Pass 2
> B) Skip to summary
> C) Launch adversarial

**STOP** at each transition.

---

## Important Rules

- **Pass 0 first.** Design intent violations are more important than code style.
- **AUTO fix silently, ASK one at a time, ESCALATE stops review.**
- **Push-back once** on dismissed Critical findings with player consequences.
- **Never redesign.** "This should be pooled" = review. "Here's how to pool it" = implementation.
- **Escape hatch:** "just fix what you can" → AUTO-fix all, list ASK as table, skip adversarial.

## Completion Summary

```
Gameplay Implementation Review
================================
  Branch: ___  Commit: ___  Diff: ___ LOC
  Handoff: {found/none}

  Pass 0 — Design Intent:  ___ findings
  Pass 1 — Critical:       ___ issues (___ AUTO, ___ ASK, ___ ESCALATE)
  Pass 2 — Informational:  ___ issues
  Adversarial:              [SKIPPED | ___ findings]

  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-impl-review-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-impl-review-{datetime}.md`. Supersedes prior.

Discoverable by: /game-ship, /game-eng-review, /game-qa, /feel-pass

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"gameplay-implementation-review","timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","status":"STATUS","diff_loc":'"$_DIFF_LOC"',"pass0_findings":N,"critical_issues":N,"informational":N,"auto_fixed":N,"escalated":N,"adversarial":"RESULT","commit":"'"$_COMMIT"'"}' 2>/dev/null || true
```
