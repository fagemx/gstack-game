---
name: pr-review-loop
description: Iteratively review PR, post comment, fix issues, and re-review until LGTM
user_invocable: true
---
<!-- Internal maintenance skill — edit this file directly -->

You are a PR review-and-fix specialist for the gstack-game project. Your role is to iteratively review a pull request, post findings as a PR comment each round, fix all high-priority issues, and repeat until the review verdict is LGTM.

## Architecture

Loop control is handled by a **bash driver script**, not by your memory. You MUST follow the ACTION output from the driver script at every step. The driver script is deterministic — it enforces the review-comment-fix cycle.

```
┌──────────┐     ACTION: REVIEW      ┌─────────┐
│  Driver   │ ──────────────────────→ │   LLM   │  ← run gstack-game review checks
│  Script   │ ←────────────────────── │ (you)   │
│           │   review-done {p0} {p1} │         │
│           │                         │         │
│           │     ACTION: COMMENT     │         │  ← post PR comment with findings
│           │ ──────────────────────→ │         │
│           │ ←────────────────────── │         │
│           │       comment-done      │         │
│           │                         │         │
│           │     ACTION: FIX         │         │  ← fix P0/P1 issues, commit, push
│           │ ──────────────────────→ │         │
│           │ ←────────────────────── │         │
│           │       fix-done          │         │
│           │                         │         │
│           │     ACTION: LGTM        │         │  ← post LGTM comment, done
│           │ ──────────────────────→ │         │
└──────────┘                          └─────────┘
```

---

## Phase 1: Setup

### 1a: Identify PR

**CRITICAL — do this FIRST before anything else.**

Your args are: `$ARGUMENTS`

Extract the PR number from the args above using these rules:
1. **Args is a URL** containing `/pull/<number>` or `/issues/<number>` → extract `<number>`
2. **Args is a plain number** → use it directly (e.g., `42`)
3. **Args is empty** → detect from current branch using `gh pr list --head "$(git branch --show-current)" --json number --jq '.[0].number'`

Once you have the PR number, **hardcode it as a literal** in all subsequent bash commands. Never use shell variables for the PR number derived from args — always substitute the actual number directly.

### 1b: Checkout PR Branch

Switch to the PR branch so that fixes are applied to the correct code:

```bash
gh pr checkout <PR_NUMBER>
```

### 1c: Create Driver Script

Write this script to `/tmp/pr-review-loop-driver.sh` and make it executable:

```bash
cat > /tmp/pr-review-loop-driver.sh << 'DRIVER'
#!/bin/bash
set -euo pipefail

PR="$1"
CMD="$2"
STATE="/tmp/pr-review-loop-${PR}.state"

case "$CMD" in
  init)
    echo "0" > "$STATE"
    echo "ACTION: REVIEW"
    ;;
  review-done)
    P0="${3:-0}"
    P1="${4:-0}"
    ITER=$(cat "$STATE")
    ITER=$((ITER + 1))
    echo "$ITER" > "$STATE"
    if [ "$P0" -eq 0 ] && [ "$P1" -eq 0 ]; then
      echo "ACTION: LGTM"
    elif [ "$ITER" -ge 3 ]; then
      echo "ACTION: COMMENT_FINAL"
    else
      echo "ACTION: COMMENT"
    fi
    ;;
  comment-done)
    echo "ACTION: FIX"
    ;;
  fix-done)
    echo "ACTION: REVIEW"
    ;;
esac
DRIVER
chmod +x /tmp/pr-review-loop-driver.sh
```

### 1d: Initialize

```bash
ACTION=$(/tmp/pr-review-loop-driver.sh <PR_NUMBER> init)
# Output: ACTION: REVIEW
```

Display PR metadata, then proceed to Phase 2 following the ACTION.

---

## Phase 2: Action Loop

Read the ACTION output from the driver script and execute the corresponding action. **Always call the driver script after completing an action to get the next ACTION.**

### On `ACTION: REVIEW`

1. **Run build verification:**

```bash
bun run build
bun test
bun run gen:skill-docs:check
```

   Record pass/fail for each.

2. **Fetch the PR diff and identify changed files:**

```bash
gh pr diff <PR_NUMBER>
```

3. **Template Quality** — for each changed `.tmpl` file, check:

   **P0 (Critical — blocks merge):**
   - Missing frontmatter (name, description, user_invocable)
   - Missing `{{PREAMBLE}}` after frontmatter
   - `bun run build` fails
   - `bun test` fails

   **P1 (High — should fix before merge):**
   - Missing anti-sycophancy section (forbidden phrases + calibrated alternatives)
   - Missing AUTO/ASK/ESCALATE classification
   - Missing STOP gates between interactive sections
   - Missing Completion Summary with status protocol
   - Template over 300 lines without `references/` split

   **P2 (Low — nice to have):**
   - Missing Save Artifact section
   - Missing Review Log section

4. **References Quality** — for each changed `references/*.md` file, check:

   **P1 (High — should fix before merge):**
   - Contradicts existing content in same skill without flagging both values
   - States benchmarks without confidence level (HIGH/MEDIUM/LOW)

   **P2 (Low — nice to have):**
   - Missing evidence attribution for domain claims

5. **General checks:**

   **P0 (Critical — blocks merge):**
   - `bun run gen:skill-docs:check` shows drift (generated files not regenerated)

   **P1 (High — should fix before merge):**
   - Commit messages don't follow Conventional Commits

   **P2 (Low — nice to have):**
   - CRLF line endings in `.tmpl` files

6. **Count P0 and P1 issues from all findings.**

7. **Report the counts to the driver script:**

```bash
ACTION=$(/tmp/pr-review-loop-driver.sh <PR_NUMBER> review-done <P0_COUNT> <P1_COUNT>)
```

8. Follow the returned ACTION.

---

### On `ACTION: COMMENT`

Post a PR comment with the current iteration's review findings. Read the current iteration number from the state file.

```bash
ITER=$(cat /tmp/pr-review-loop-<PR_NUMBER>.state)
```

Structure the comment:

```markdown
## PR Review: #<number> (Round <ITER>)

### Build Status
- `bun run build`: PASS/FAIL
- `bun test`: PASS/FAIL (N/11)
- `gen:skill-docs:check`: PASS/DRIFT

### Template Quality
<findings per .tmpl file changed>

### References Quality
<findings per references/ file changed>

### Issues
#### P0 (Critical — blocks merge)
<list>

#### P1 (High — should fix before merge)
<list>

#### P2 (Low — nice to have)
<list>

### Verdict: Changes Requested

Fixing P0/P1 issues and will re-review.

---
*Round <ITER> of automated review-fix loop*
```

Post the comment:

```bash
gh pr comment <PR_NUMBER> --body "$REVIEW_CONTENT"
```

Report completion to the driver script:

```bash
ACTION=$(/tmp/pr-review-loop-driver.sh <PR_NUMBER> comment-done)
# Output is ALWAYS: ACTION: FIX
```

Follow the returned ACTION.

---

### On `ACTION: FIX`

1. Fix all P0 issues first, then P1 issues:

| Category | Fix Approach |
|----------|--------------|
| Missing frontmatter | Add YAML frontmatter with name, description, user_invocable |
| Missing `{{PREAMBLE}}` | Add `{{PREAMBLE}}` after frontmatter closing `---` |
| Missing anti-sycophancy | Add forbidden phrases + calibrated alternatives section |
| Missing AUTO/ASK/ESCALATE | Add classification to each review section |
| Missing STOP gates | Add `**STOP.** One issue per AskUserQuestion.` between sections |
| Missing Completion Summary | Add status protocol section at end |
| Template over 300L | Extract domain content into `references/` directory |
| Build/test failures | Fix the root cause in `.tmpl` files |
| Drift detected | Run `bun run build` to regenerate |
| CRLF line endings | Convert to LF |
| Reference contradictions | Flag both values with note |
| Missing confidence levels | Add HIGH/MEDIUM/LOW to benchmarks |

   Mark unfixable issues (ambiguous requirements, design trade-offs, out of scope) as **skipped**.

   Rules:
   - Only modify files that are part of the PR diff
   - Minimal changes — fix the issue, nothing more

2. Run pre-commit checks:

```bash
bun run build
bun test
bun run gen:skill-docs:check
```

   If a fix breaks checks: revert that fix, mark the issue as skipped.

3. Commit and push:

```bash
git add <fixed-files>
git commit -m "fix: address PR review findings (round <ITER>)"
git push
```

4. **Report completion to the driver script:**

```bash
ACTION=$(/tmp/pr-review-loop-driver.sh <PR_NUMBER> fix-done)
# Output is ALWAYS: ACTION: REVIEW
```

5. Follow the returned ACTION (which is always REVIEW — this is how the loop is enforced).

---

### On `ACTION: LGTM`

Post a LGTM comment and go to Phase 3.

```bash
ITER=$(cat /tmp/pr-review-loop-<PR_NUMBER>.state)
```

```markdown
## PR Review: #<number> (Round <ITER>) — LGTM

### Build Status
- `bun run build`: PASS
- `bun test`: PASS (11/11)
- `gen:skill-docs:check`: PASS

### Summary
<Brief summary of the final state>

### Verdict: LGTM

No critical or high-priority issues remaining. This PR is ready for merge.

---
*Completed after <ITER> round(s) of automated review-fix loop*
```

```bash
gh pr comment <PR_NUMBER> --body "$LGTM_CONTENT"
```

Go to Phase 3.

---

### On `ACTION: COMMENT_FINAL`

Max iterations reached. Post a final comment with remaining issues:

```markdown
## PR Review: #<number> (Round 3) — Max Iterations Reached

### Build Status
- `bun run build`: PASS/FAIL
- `bun test`: PASS/FAIL (N/11)
- `gen:skill-docs:check`: PASS/DRIFT

### Remaining Issues
<List unresolved P0/P1 issues that need manual intervention>

### Verdict: Changes Requested

Automated review-fix loop reached maximum iterations (3). The remaining issues above need manual attention.

---
*Final round of automated review-fix loop*
```

```bash
gh pr comment <PR_NUMBER> --body "$FINAL_CONTENT"
```

Go to Phase 3.

---

## Phase 3: Summary

Display a local summary (do NOT post another comment):

```
PR Review Loop Complete

PR: #<number> - <title>
Iterations: <count>
Issues fixed: <count>
Verdict: <LGTM / Changes Requested (max iterations)>

[If max iterations reached]
Remaining issues need manual intervention:
- <issue>

All review comments posted to PR.
```
