---
name: issue-plan
description: "Plan implementation for a gstack-game GitHub issue. Researches affected skills, analyzes domain gaps, designs changes, and posts a structured plan to the issue. Run as: /issue-plan 123"
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
echo '{"skill":"issue-plan","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "issue-plan" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /issue-plan: Plan a gstack-game Issue

Research, analyze, and plan implementation for a gstack-game GitHub issue. Posts structured findings back to the issue for review before execution.

## Arguments

Parse `$ARGUMENTS` to get the issue number. If args is `123`, plan issue #123.

If no issue number provided, ask: "Which issue would you like to plan? Provide the issue number."

---

## Step 1: Fetch Issue Details

```bash
gh issue view <ISSUE_NUM> --json title,body,comments,labels,author
```

Extract:
- **Issue type** (from labels): `skill-gap`, `new-skill`, `bug`, `enhancement`, `docs`
- **Target skill** (if any): which skill is affected
- **Scope**: single file fix, multi-file change, new skill creation, cross-skill refactor
- **Contributor context**: domain expertise stated, evidence provided

If the issue is unclear or missing critical information:

**STOP.** AskUserQuestion:
1. What exactly needs to change?
2. Which skill(s) are affected?
3. Is domain expertise needed that we don't have?

---

## Step 2: Research Phase

### For skill-gap issues (wrong content, missing knowledge)

Read the affected skill's current state:

```bash
SKILL_NAME="<from issue>"
cat "skills/$SKILL_NAME/SKILL.md.tmpl"
ls "skills/$SKILL_NAME/references/" 2>/dev/null
```

Read ALL reference files in the affected skill. Then assess:

1. **Where does the gap live?**
   - In `SKILL.md.tmpl` (embedded in template logic)
   - In `references/*.md` (externalized domain knowledge)
   - Both (template references content that doesn't exist)

2. **What's the blast radius?**
   - Single value fix (change one number) → Small
   - New section in references/ → Medium
   - Template logic change (affects scoring, routing, or flow) → Large
   - Cross-skill (multiple skills reference this content) → Large

3. **Does the issue contradict existing content?**
   - If yes: flag both values, do NOT pick a side
   - If no: straightforward addition

4. **Check `docs/domain-judgment-gaps.md`** — is this gap already known?

```bash
cat docs/domain-judgment-gaps.md
```

### For new-skill issues

Research the workflow gap:

1. **Read the skill map** to understand where this fits:

```bash
cat docs/DEVELOPMENT.md
```

2. **Read 2-3 similar existing skills** to understand the pattern:
   - Pick the closest skill by workflow position
   - Pick the closest skill by domain type
   - Note: template structure, reference count, scoring approach

3. **Check the quality rubric**:

```bash
cat skills/skill-review/references/rubric.md
```

4. **Assess feasibility**:
   - Can this be built without domain expert input? (A-type, ~60%)
   - Does it need expert calibration? (B-type, ~75%)
   - Is it fundamentally subjective? (may never exceed 50%)

### For bug issues

1. **Reproduce the problem**:

```bash
bun test
bun run gen:skill-docs:check
```

2. **Read the affected files** to understand root cause
3. **Check if the fix is straightforward** or requires architectural understanding

---

## Step 3: Analyze Phase

Based on research, determine:

### Change Classification

| Scope | Description | Examples |
|-------|-------------|---------|
| **Patch** | Single value or sentence fix | Fix a benchmark number, typo, wrong label |
| **Section** | Add/rewrite a section in references/ | New gotcha entry, updated scoring table |
| **Template** | Modify .tmpl logic or flow | Add a mode, change routing, restructure sections |
| **New skill** | Create entire skill directory | New SKILL.md.tmpl + references/ + build + test |
| **Cross-skill** | Changes that affect multiple skills | Preamble change, shared vocabulary, workflow routing |

### Risk Assessment

- **Domain risk:** Are we confident the new content is correct? (Do we have evidence, or are we guessing?)
- **Regression risk:** Could this change break existing behavior? (Scoring changes, template restructuring)
- **Build risk:** Does this affect the template engine or tests? (Changes to .tmpl structure)

If domain risk is HIGH (no evidence, contradicts existing content, affects scoring):

**STOP.** AskUserQuestion:
1. Do we have enough domain evidence to make this change?
2. Should we tag a domain expert for review?
3. Is a partial fix (add the question, leave the score unchanged) safer?

---

## Step 4: Plan Phase

Write a structured implementation plan.

### For Patch/Section scope

```markdown
## Plan: <issue title>

### Summary
<1-2 sentences: what changes and why>

### Files to Change
1. `skills/<name>/references/<file>.md` — <what changes>

### Change Detail
<Exact content to add/modify, with before/after if applicable>

### Verification
- [ ] `bun test` passes
- [ ] Content doesn't contradict other references in same skill
- [ ] If scoring change: recalculate one example to verify formula still works

### Domain Confidence
<HIGH: based on cited evidence / MEDIUM: reasonable inference / LOW: needs expert review>
```

### For Template scope

```markdown
## Plan: <issue title>

### Summary
<1-2 sentences: what changes and why>

### Files to Change
1. `skills/<name>/SKILL.md.tmpl` — <what changes>
2. `skills/<name>/references/<new-file>.md` — <if adding references>

### Architecture Decision
<Why this approach? What alternatives were considered?>

### Change Detail
<Section-by-section description of template modifications>
- New/modified sections with purpose
- Routing logic changes (if any)
- Scoring formula changes (if any)
- Anti-sycophancy additions (if any)

### Migration
- Does this change generated SKILL.md output? → `bun run build` required
- Does this affect artifact format? → Downstream skills need checking

### Verification
- [ ] `bun run build` succeeds
- [ ] `bun test` passes (all 11 tests)
- [ ] `bun run gen:skill-docs:check` shows no unexpected drift
- [ ] Manual walkthrough: invoke the skill and verify flow makes sense

### Domain Confidence
<HIGH / MEDIUM / LOW>
```

### For New skill scope

```markdown
## Plan: new skill /<name>

### Summary
<What this skill does, who uses it, where it fits in the workflow>

### Workflow Position
- **Layer:** Design / Bridge / Validation / Meta
- **Upstream:** <skills that feed into this>
- **Downstream:** <skills that consume this output>

### Files to Create
1. `skills/<name>/SKILL.md.tmpl` — main template
2. `skills/<name>/references/` — domain knowledge files (list each)

### Template Structure
1. Preamble (`## Preamble (run first)

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
echo '{"skill":"issue-plan","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "issue-plan" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```
`)
2. Mode selection (if applicable)
3. <Section 1> — <purpose>
4. <Section 2> — <purpose>
...
N. Completion Summary
N+1. Save Artifact
N+2. Review Log

### Scoring Approach
<Explicit formula, not AI intuition. State dimensions and weights.>

### Anti-Sycophancy
<At minimum: 3 forbidden phrases + 3 calibrated alternatives>

### Quality Target
<A-type (55-65%) or B-type (70-80%) — and what would be needed to reach the next tier>

### Verification
- [ ] `bun run build` succeeds
- [ ] `bun test` passes
- [ ] New skill appears in generated output
- [ ] Manual walkthrough produces useful output

### Documentation Updates
- [ ] CLAUDE.md skill tree
- [ ] README.md / README.zh-TW.md skill count and lists
- [ ] docs/DEVELOPMENT.md skill map
- [ ] CONTRIBUTING.md / CONTRIBUTING.zh-TW.md (if skeleton, add to table)
- [ ] CHANGELOG.md
```

---

## Step 5: Post Plan to Issue

Save the plan locally, then post to the issue:

```bash
mkdir -p .tmp/issue-plan
# Plan is written to .tmp/issue-plan/issue-<NUM>.md
```

```bash
gh issue comment <ISSUE_NUM> --body-file .tmp/issue-plan/issue-<NUM>.md
```

Add label to signal plan is ready for review:

```bash
gh issue edit <ISSUE_NUM> --add-label "planned"
```

If "planned" label doesn't exist:
```bash
gh label create planned --description "Implementation plan posted, awaiting approval" --color 0E8A16
```

---

## Step 6: Wait for Approval

**STOP.** Tell the user:

> Plan posted to issue #<NUM>. Review the plan on GitHub.
> When ready to implement, run `/issue-plan <NUM> --execute` or start manually.

Do NOT begin implementation without user approval.

---

## AUTO/ASK/ESCALATE

- **AUTO:** Reading files, counting lines, checking test status, posting comments
- **ASK:** Change scope confirmation, domain confidence assessment, architecture decisions
- **ESCALATE:** Cross-skill changes, scoring formula modifications, contradictions with existing domain content, changes that affect >3 files

## Anti-Sycophancy

Forbidden:
- ❌ "This is a straightforward fix"
- ❌ "Easy change"
- ❌ "Should be quick"

Instead: State scope and risk honestly. "This changes the scoring formula in `/balance-review` Section 3. The idle game economy model needs a genre-conditional branch — this is a template logic change with medium regression risk because it affects all economy scores."

## Completion Summary

```
Issue Plan:
  Issue: #<NUM> — <title>
  Type: skill-gap / new-skill / bug / enhancement
  Scope: patch / section / template / new-skill / cross-skill
  Files affected: N
  Domain confidence: HIGH / MEDIUM / LOW
  Plan posted: yes / no
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-issue-plan-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-issue-plan-{datetime}.md`.

Discoverable by: /contribute-review, /skill-review

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"issue-plan","timestamp":"TIMESTAMP","status":"STATUS","issue":"ISSUE_NUM","scope":"SCOPE","domain_confidence":"CONFIDENCE","commit":"COMMIT"}' 2>/dev/null || true
```
