---
name: issue-create
description: "Create GitHub issues for gstack-game improvements — skill gaps, wrong benchmarks, new skill proposals, template bugs. Maps conversation context into actionable issues with proper labels and skill references."
user_invocable: true
---
<!-- Internal maintenance skill — edit this file directly -->

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
echo '{"skill":"issue-create","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "issue-create" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /issue-create: Create gstack-game Issue

Create well-structured GitHub issues for improving gstack-game skills from conversation context.

## Arguments

Parse `$ARGUMENTS` to determine operation:
- **`skill-gap`** — A skill is missing domain knowledge, has wrong numbers, or gives bad advice
- **`new-skill`** — Propose a new skill that doesn't exist yet
- **`bug`** — Template bug, build issue, or broken skill behavior
- **(empty or `create`)** — General issue; auto-detect type from conversation

---

## Operation: skill-gap

Report that a skill needs domain expert input — wrong benchmark, missing gotcha, bad scoring weight, or absent forcing question.

This is the **most common issue type** for gstack-game. Maps directly to the contribution templates in `.github/ISSUE_TEMPLATE/`.

### Step 1: Identify the Gap

From conversation context, extract:
- **Which skill?** (`/game-review`, `/balance-review`, etc.)
- **Which file?** (a `references/*.md` file, or the `.tmpl` itself)
- **Gap type:** benchmark / gotcha / forcing-question / scoring / persona / missing-section
- **What's wrong or missing?** Specific content
- **Evidence:** Why this is wrong (experience, data source, playtest observation)

If running a gstack-game review skill revealed the gap (e.g., `/balance-review` gave bad advice on idle games), capture:
- The specific bad advice or missing check
- What the correct behavior should be
- The game type or context where it fails

### Step 2: Clarify with User

**STOP.** AskUserQuestion to confirm:
1. Is the skill identification correct?
2. Is this a **wrong value** (fix existing) or **missing content** (add new)?
3. What's the evidence source? (shipped game experience, published data, playtest results, industry standard)
4. Severity: Does this cause **wrong scores** (critical) or **missing depth** (important)?

### Step 3: Select Issue Template

Map gap type to GitHub Issue template:

| Gap type | Template | Label |
|----------|----------|-------|
| Wrong benchmark number | `benchmark.yml` | `skill-gap`, `benchmark` |
| Claude gives wrong advice | `gotcha.yml` | `skill-gap`, `gotcha` |
| Missing review question | `forcing-question.yml` | `skill-gap`, `forcing-question` |
| Scoring weight wrong | `scoring.yml` | `skill-gap`, `scoring` |
| Missing section/content | (general) | `skill-gap`, `content` |

### Step 4: Create Issue

```bash
gh issue create \
  --title "skill-gap(<SKILL_NAME>): <concise description>" \
  --body "<formatted content>" \
  --label "skill-gap,<gap-type>"
```

**Body structure:**

```markdown
## Skill
`/<skill-name>` — `skills/<skill-name>/references/<file>.md`

## Current Behavior
<What the skill currently says or does>

## Expected Behavior
<What it should say or do instead>

## Evidence
<Source: shipped game experience, published data, playtest, industry standard>
<Contributor expertise if stated: "[Role, N years, shipped N titles]">

## Game Type Context
<When does this matter? All games? Only F2P mobile? Only multiplayer?>

---
_Created from conversation via `/issue-create skill-gap`_
```

### Step 5: Return Result

Display the issue URL. Example:
```
Issue created: https://github.com/owner/repo/issues/123
Skill: /balance-review | Type: gotcha | File: references/gotchas.md
```

---

## Operation: new-skill

Propose a new skill that fills a gap in the gstack-game workflow.

### Step 1: Identify the Gap

From conversation context, determine:
- **What workflow stage is missing?** (Design / Bridge / Validation / Release / Meta)
- **What does this skill do that no existing skill covers?**
- **Who is the target user?** (designer, programmer, QA, producer, artist)
- **What upstream skills feed into it?** What downstream skills consume its output?

### Step 2: Check for Overlap

Before creating the issue, verify no existing skill already covers this:

```bash
ls skills/*/SKILL.md.tmpl | head -30
```

Cross-reference against the 28 existing skills. If overlap exists, this might be a `skill-gap` issue instead (expanding an existing skill).

**STOP.** AskUserQuestion:
1. Confirm no overlap with existing skills
2. Which workflow layer does this belong to? (A: Design, B: Bridge, C: Validation, D: Meta)
3. What quality tier is realistic? (B-type 70%+ needs domain expert; A-type 55%+ is achievable without)
4. Is the proposer willing to contribute domain knowledge, or just identifying the gap?

### Step 3: Create Issue

```bash
gh issue create \
  --title "feat: new skill /<skill-name> — <one-line purpose>" \
  --body "<formatted content>" \
  --label "new-skill,enhancement"
```

**Body structure:**

```markdown
## Proposed Skill
`/<skill-name>` — <one-line description>

## Workflow Position
- **Layer:** Design / Bridge / Validation / Meta
- **Upstream:** Which skills feed into this? (e.g., `/game-review` output)
- **Downstream:** Which skills consume this output?

## What It Does
<2-3 paragraphs describing the skill's purpose, who uses it, when>

## Why It's Needed
<What gap does this fill? What goes wrong without it?>

## Suggested Sections
1. <Section name> — <what it checks>
2. <Section name> — <what it checks>
...

## Domain Expertise Needed
<What kind of expert could calibrate this skill?>

## Reference Skills
<Which existing gstack-game skills are most similar in structure?>

---
_Created from conversation via `/issue-create new-skill`_
```

---

## Operation: bug

Report a template bug, build issue, or broken skill behavior.

### Step 1: Gather Bug Information

From conversation context, extract:
- **What broke?** (build failure, wrong output, template error, drift, test failure)
- **Which file?** (`.tmpl`, generated `.md`, `scripts/`, `bin/`, `test/`)
- **Repro steps** (exact commands that fail)
- **Error output** (paste exact error, not paraphrased)

### Step 2: Clarify with User

**STOP.** AskUserQuestion:
1. Can you reproduce this consistently?
2. Which platform? (Windows/Git Bash, macOS, Linux, WSL)
3. Did `bun test` pass before this happened?

### Step 3: Create Issue

```bash
gh issue create \
  --title "bug: <concise description>" \
  --body "<formatted content>" \
  --label "bug"
```

**Body structure:**

```markdown
## Bug Description
<What's broken>

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
<What should happen>

## Actual Behavior
<What happens instead>

## Environment
- Platform: <Windows/macOS/Linux>
- Shell: <bash/zsh/Git Bash/WSL>
- Bun version: <output of `bun --version`>
- gstack-game version: <content of VERSION file>

## Error Output
```
<exact error>
```

---
_Created from conversation via `/issue-create bug`_
```

---

## Operation: create (default)

General issue from conversation context. Auto-detect type.

### Step 1: Analyze Conversation

Review conversation to identify:
- Is this about a specific skill's content? → Likely `skill-gap`
- Is this about a missing workflow step? → Likely `new-skill`
- Is this about something broken? → Likely `bug`
- Something else? → General issue

### Step 2: Route or Create

If a specific operation matches, follow that operation's workflow.

Otherwise, create a general issue:

```bash
gh issue create \
  --title "<type>: <description>" \
  --body "<synthesized content>" \
  --label "<appropriate labels>"
```

**Title prefixes:**
- `feat:` — enhancement to existing skill
- `docs:` — documentation improvement
- `refactor:` — template restructuring
- `chore:` — build, CI, tooling
- `perf:` — build performance or skill execution improvement

---

## AUTO/ASK/ESCALATE

- **AUTO:** Label selection, template matching, formatting
- **ASK:** Issue type confirmation, scope verification, skill identification
- **ESCALATE:** Contradicts existing domain knowledge, affects scoring accuracy, touches multiple skills

## Anti-Sycophancy

Forbidden:
- ❌ "Great catch!"
- ❌ "This is a really important issue"
- ❌ "Excellent observation"

Instead: State the gap factually. "The idle game economy model in `/balance-review` flags inflation >1.2 as a problem. Idle games use inflation as a core mechanic — this is a false positive for that genre."

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"issue-create","timestamp":"TIMESTAMP","status":"STATUS","operation":"OPERATION","target_skill":"TARGET","commit":"COMMIT"}' 2>/dev/null || true
```
