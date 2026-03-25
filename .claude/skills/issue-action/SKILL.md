---
name: issue-action
description: "Implement an approved plan for a gstack-game GitHub issue. Reads deep-dive artifacts, creates feature branch, executes plan steps, runs build+test, creates PR. Run after /issue-plan when plan is approved."
user_invocable: true
---
<!-- Internal maintenance skill — edit this file directly -->

# /issue-action: Implement from Approved Plan

Continue working on a gstack-game GitHub issue by implementing the approved plan from `/issue-plan`.

## Arguments

Parse `$ARGUMENTS` to get the issue ID. If provided, use it. Otherwise, look for the issue ID from conversation context (from prior `/issue-plan` invocation).

If no issue ID found, ask: "Which issue are you implementing? Provide the issue number."

## Task Tracking (CRITICAL)

**You MUST use TodoWrite to track progress.** Create this todo list at START:

1. Retrieve context and artifacts
2. Fetch latest issue updates
3. Remove planned label
4. Analyze feedback
5. Execute implementation
6. Run build and tests
7. Create PR
8. Post completion to issue

**Update after completing each step.**

---

## Step 1: Retrieve Context and Artifacts

Locate deep-dive artifacts:

```bash
ls .tmp/deep-dive/issue-{id}/ 2>/dev/null
```

Verify existence of:
- `research.md` — Research phase output
- `innovate.md` — Innovation phase output
- `plan.md` — Implementation plan (REQUIRED)

If `plan.md` doesn't exist, **STOP**: "No plan found. Run `/issue-plan {id}` first."

Read artifacts in order: `plan.md` → `research.md` → `innovate.md`

**Update todo:** Mark completed.

---

## Step 2: Fetch Latest Issue Updates

```bash
gh issue view {issue-id} --json title,body,comments,labels
```

Check for new comments since plan was posted.

**Update todo:** Mark completed.

---

## Step 3: Remove Planned Label

Signal that work is resuming:

```bash
gh issue edit {issue-id} --remove-label "planned"
```

**Update todo:** Mark completed.

---

## Step 4: Analyze Feedback

Review any new comments on the issue for:
- **Plan approved** (explicit approval or no objections) → Proceed to Step 5
- **Changes requested** → Update `plan.md`, post revised plan, add "planned" label back, **EXIT**
- **Questions asked** → Answer in comment, add "planned" label back, **EXIT**
- **Plan rejected** → Post acknowledgment, **EXIT**

If status unclear, ask user: "The plan has comments. Should I proceed with implementation, or address the feedback first?"

**Update todo:** Mark completed.

---

## Step 5: Execute Implementation

### 5a: Create Feature Branch

```bash
git checkout -b feature/issue-{id}-{short-description}
```

If branch already exists, ask user: reuse or create new?

### 5b: Follow Plan Steps

Implement EXACTLY what `plan.md` specifies. Do NOT deviate without user approval.

**For each step in the plan:**

1. Read the step description
2. Make the change (edit `.tmpl`, add `references/`, etc.)
3. Verify the change is correct
4. Commit with conventional message:

```bash
git add <specific-files>
git commit -m "<type>(skill-name): <description>

Implements step N of issue #{id} plan"
```

### gstack-game Specific Implementation Rules

**Template changes (.tmpl files):**
- Edit the `.tmpl`, never the generated `.md`
- Every new section needs: explicit scoring OR forcing questions
- Every new section needs: AUTO/ASK/ESCALATE classification
- Anti-sycophancy: add forbidden phrases for new review dimensions
- End sections with `**STOP.** One issue per AskUserQuestion.`

**References changes (references/*.md):**
- Pure markdown, no template placeholders
- Each file should be self-contained and readable independently
- If contradicting existing content: flag both values, don't pick sides
- Include evidence attribution (source, contributor expertise)

**New skills:**
- Must have frontmatter: name, description, user_invocable
- Must include `{{PREAMBLE}}` after frontmatter
- Must include Review Log with `{{SKILL_NAME}}`
- Must include Save Artifact section
- Must include Completion Summary

**After EACH change:**

```bash
bun run build    # Regenerate SKILL.md (if .tmpl changed)
bun test         # Verify nothing broke
```

If tests fail: fix immediately before continuing. Do NOT accumulate broken changes.

**Update todo:** Mark "Execute implementation" as completed after all plan steps done.

---

## Step 6: Run Build and Tests

Full verification after all changes:

```bash
bun run build
bun test
bun run gen:skill-docs:check
```

All must pass. If any fail:
- Diagnose the failure
- Fix the issue
- Re-run until all pass
- Commit the fix

**Update todo:** Mark completed.

---

## Step 7: Create PR

```bash
git push -u origin feature/issue-{id}-{short-description}
```

Create PR with structured body:

```bash
gh pr create \
  --title "<type>(skill-name): <description>" \
  --body "$(cat <<'PREOF'
## Summary

Implements plan for #<issue-id>.

### Changes
- <file 1> — <what changed>
- <file 2> — <what changed>

### Deep-dive artifacts
- Research: posted to issue as comment
- Innovation: posted to issue as comment
- Plan: posted to issue as comment

### Verification
- [x] `bun run build` passes
- [x] `bun test` passes (all 11 tests)
- [x] `bun run gen:skill-docs:check` — no drift
- [ ] Manual walkthrough (reviewer)

### Domain Confidence
<HIGH / MEDIUM / LOW — from plan>

Closes #<issue-id>
PREOF
)"
```

**PR title prefixes:**
- `feat(skill-name):` — new skill or major enhancement
- `fix(skill-name):` — wrong content, broken behavior
- `docs:` — documentation only
- `refactor(skill-name):` — restructuring without behavior change
- `improve(skill-name):` — domain knowledge addition (benchmarks, gotchas, forcing questions)

**Update todo:** Mark completed.

---

## Step 8: Post Completion to Issue

```bash
gh issue comment {issue-id} --body "Implementation complete. PR created: <pr-url>

All checks passing:
- \`bun run build\` ✅
- \`bun test\` ✅ (11/11)
- \`bun run gen:skill-docs:check\` ✅

Ready for review."
```

**Update todo:** Mark completed.

**Verify all 8 todos are completed** before exiting.

---

## Handling Blocks

If blocked during implementation:

1. Post comment to issue explaining what's blocked and why
2. Add "planned" label back (signals waiting for input)
3. Tell user what's needed
4. **EXIT** — do not continue past the block

Common blocks:
- Domain knowledge needed (issue says "inflation rate > 1.2" but no evidence for what threshold is correct)
- Cross-skill impact discovered (change affects skills not covered in plan)
- Test failure that requires architectural understanding
- Contradictory requirements

---

## Label Management

| Action | When |
|--------|------|
| Remove "planned" | When starting implementation (Step 3) |
| Add "planned" back | When blocked, waiting for feedback, or changes requested |
| Keep issue open | Always — user closes after merging PR |

---

## Anti-Sycophancy

Forbidden:
- ❌ "Easy fix"
- ❌ "Quick change"
- ❌ "This should work"
- ❌ "Simple implementation"

Instead: State what was done, what was verified, and what risks remain. "Changed the economy scoring formula in `/balance-review` to add genre-conditional idle game handling. All 11 tests pass. The new threshold (inflation rate < session_length × prestige_frequency) needs validation against real idle game data — domain confidence is MEDIUM."

## AUTO/ASK/ESCALATE

- **AUTO:** File edits following plan exactly, `bun run build`, `bun test`, git operations, PR creation
- **ASK:** Deviation from plan needed, ambiguous plan step, multiple valid interpretations
- **ESCALATE:** Test failures not covered by plan, cross-skill impact discovered, domain contradiction found during implementation
