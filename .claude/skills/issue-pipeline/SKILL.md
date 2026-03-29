---
name: issue-pipeline
description: "End-to-end issue pipeline: plan → implement → review → merge. Dispatches parallel sub-agents with worktree isolation. Usage: /issue-pipeline 33 34 35 [--skip-plan] [--skip-review] [--no-merge]"
user_invocable: true
---
<!-- Internal maintenance skill — edit this file directly -->

# /issue-pipeline: End-to-End Issue Pipeline

You orchestrate the full lifecycle of GitHub issues through parallel sub-agents. Each phase runs all issues concurrently in isolated worktrees.

## Arguments

Parse `$ARGUMENTS` to get issue numbers and flags.

Examples:
- `/issue-pipeline 33 34 35` — full pipeline (plan → implement → review → merge)
- `/issue-pipeline 33 34 --skip-plan` — issues already have plans, skip to implement
- `/issue-pipeline 33 34 --skip-review --no-merge` — implement only, no review or merge
- `/issue-pipeline 33` — single issue, full pipeline

If no issue numbers provided, ask: "Which issues? Provide issue numbers separated by spaces."

**Flags:**
- `--skip-plan` — Skip plan phase (issues already have `planned` label + plan comments)
- `--skip-review` — Skip review phase, merge after implement
- `--no-merge` — Stop after review, don't auto-merge
- `--dry-run` — Show what would happen without executing

## Pre-Flight Check

Before starting, verify all issues exist and check their state:

```bash
for num in {issue_numbers}; do
  gh issue view $num --json number,title,labels,state --jq '"\(.number) [\(.labels | map(.name) | join(","))] \(.state) — \(.title)"'
done
```

Report findings:
- Issues with `planned` label → can skip plan phase
- Closed issues → skip entirely with warning
- Issues without `planned` label → need plan phase

## Pipeline Phases

### Phase 1: Plan (parallel)

**Skip if:** `--skip-plan` flag OR issue already has `planned` label.

For each issue needing a plan, launch a sub-agent:

```
Agent tool parameters:
  description: "Plan issue #{number}"
  isolation: "worktree"
  run_in_background: true
  prompt: |
    You are working on GitHub issue #{number} for gstack-game at {repo_root}.

    Execute the /issue-plan workflow:
    1. Read the skill at {repo_root}/.claude/skills/issue-plan/SKILL.md
    2. Follow its instructions for issue #{number}

    This means: Research → Innovate → Plan, posting all 3 phases to the issue.

    IMPORTANT:
    - You are in a worktree — do NOT modify source code, planning only
    - Post all findings to the GitHub issue as comments
    - Add the "planned" label when done
```

**Wait for ALL plan agents to complete.** Report status table.

### Phase 2: Implement (parallel)

For each issue with a plan, launch a sub-agent:

```
Agent tool parameters:
  description: "Implement issue #{number}"
  isolation: "worktree"
  run_in_background: true
  prompt: |
    You are implementing GitHub issue #{number} for gstack-game at {repo_root}.

    Execute the /issue-action workflow:
    1. Read the plan from the issue comments: `gh issue view {number} --json comments`
    2. Also check for local artifacts: `.tmp/deep-dive/issue-{number}/plan.md`
    3. Read the skill at {repo_root}/.claude/skills/issue-action/SKILL.md
    4. Follow its instructions for issue #{number}

    IMPORTANT:
    - You are in a worktree — create a feature branch, make changes, commit
    - Edit .tmpl files, never generated .md directly
    - Run `bun run build` after template changes
    - Run `bun test` — all tests must pass before creating PR
    - Create a PR with `gh pr create` — include "Closes #{number}" in the body
    - Do NOT merge the PR
```

**Wait for ALL implement agents to complete.** Collect PR URLs/numbers. Report status table.

### Phase 3: Review (parallel)

**Skip if:** `--skip-review` flag.

For each PR created in Phase 2, launch a sub-agent:

```
Agent tool parameters:
  description: "Review PR #{pr_number}"
  isolation: "worktree"
  run_in_background: true
  prompt: |
    You are reviewing PR #{pr_number} for gstack-game at {repo_root}.

    Execute the /pr-review-loop workflow:
    1. Read the skill at {repo_root}/.claude/skills/pr-review-loop/SKILL.md
    2. Follow its instructions for PR #{pr_number}

    IMPORTANT:
    - You are in a worktree
    - If fixes are needed, check out the PR branch, fix, commit, and push
    - The review loop continues until LGTM or max 3 iterations
```

**Wait for ALL review agents to complete.** Report verdicts.

### Phase 4: Merge

**Skip if:** `--no-merge` flag.

For each PR with LGTM verdict:

```bash
gh pr merge {pr_number} --merge --delete-branch
```

For PRs without LGTM: report them as needing manual review.

After all merges, sync main:

```bash
git checkout main && git pull
```

Report final status table.

## Execution Rules

1. **All sub-agents use `isolation: "worktree"`** — never work on main directly
2. **All sub-agents use `run_in_background: true`** — maximize parallelism
3. **Launch ALL agents for a phase in a SINGLE message** (one Agent tool call per issue, all in parallel)
4. **Wait for ALL agents in a phase before starting the next phase**
5. **Report a status table after each phase** — issue number, status, key details
6. **If any agent fails, report it but continue with the rest** — don't block the pipeline
7. **Between phases, sync main** — `git checkout main && git pull` to pick up merged changes

## gstack-game Specific Rules

- **Template workflow:** Agents edit `.tmpl` files, run `bun run build` to regenerate `.md`, run `bun test` (14 tests)
- **Preamble changes:** If an issue changes `skills/shared/preamble-*.md`, ALL 28 SKILL.md files are regenerated
- **Commit style:** Conventional Commits (`feat:` / `fix:` / `test:` / `docs:`)
- **PR merges use `--merge`** (not squash) to preserve commit history

## Status Table Format

After each phase:

```
| Issue | Phase     | Status | Details |
|-------|-----------|--------|---------|
| #33   | plan      | ✅     | Plan posted to issue |
| #34   | plan      | ⏭️     | Already planned |
| #35   | implement | ✅     | PR #38 created |
| #36   | implement | ❌     | bun test failed |
```

After merge:

```
| Issue | PR  | Plan | Implement | Review | Merge | Result |
|-------|-----|------|-----------|--------|-------|--------|
| #33   | #38 | ✅   | ✅        | ✅     | ✅    | DONE   |
| #34   | #39 | ⏭️   | ✅        | ✅     | ✅    | DONE   |
| #35   | #40 | ✅   | ✅        | ⚠️     | ❌    | NEEDS REVIEW |
```

## Error Handling

- **Agent fails:** Mark as ❌, continue with other issues. Report at end.
- **PR creation fails:** Try to identify branch, suggest manual fix.
- **Review finds issues:** pr-review-loop handles fix + re-review automatically (max 3 rounds).
- **Merge conflict:** Report conflict, skip merge for that PR, suggest manual resolution.
- **bun test fails:** Agent should NOT create PR. Report test failures.

## Anti-Sycophancy

- ❌ "All issues completed successfully!" (unless they actually all did)
- ❌ "Easy batch!" (some issues may have unexpected complexity)
- ✅ Report exact counts: "4/5 issues completed. #36 failed at implement phase: bun test returned 2 failures."
- ✅ If all agents fail, say so plainly: "0/3 issues completed. All agents encountered errors."
