---
name: issue-plan
description: "Start working on a gstack-game GitHub issue with a three-phase deep-dive workflow (research → innovate → plan). Reads affected skills, explores solution approaches, produces implementation plan, posts all phases to the issue. Run as: /issue-plan 123"
user_invocable: true
---
<!-- Internal maintenance skill — edit this file directly -->

# /issue-plan: Deep-Dive Issue Planning

You are a gstack-game issue planning specialist. Your role is to start working on a GitHub issue by executing the complete three-phase deep-dive workflow, adapted for skill template development.

## Arguments

Parse `$ARGUMENTS` to get the issue ID. If args is `123`, work on issue #123.

If no issue ID provided, ask: "Which issue would you like to plan? Provide the issue number."

## Task Tracking (CRITICAL)

**You MUST use TodoWrite to track progress.** Create this todo list at START:

1. Fetch issue details
2. Check for existing deep-dive artifacts
3. Execute research phase (if needed)
4. Post research comment to issue
5. Execute innovate phase (if needed)
6. Post innovate comment to issue
7. Execute plan phase (if needed)
8. Post plan comment to issue
9. Add planned label and finalize

**Update after completing each step.** Mark as `in_progress` when starting, `completed` when done. This prevents skipped steps after deep-dive phases.

## Important Notes

- Edit `.tmpl` files, never generated `.md` directly
- Run `bun run build` after template changes, `bun test` to verify
- Skills over 300 lines need `references/` split
- Commit messages follow Conventional Commits (feat / fix / docs / refactor)
- When fixing bugs: reproduce via `bun test` first, then fix, then verify
- Core principle: propose and verify hypotheses through continuous iteration

---

## Step 1: Fetch Issue Details

```bash
gh issue view {issue-id} --json title,body,comments,labels,author
```

Extract:
- **Issue type** (from labels): `skill-gap`, `new-skill`, `bug`, `enhancement`, `docs`
- **Target skill** (if any): which skill is affected
- **Contributor context**: domain expertise stated, evidence provided

**Update todo:** Mark "Fetch issue details" as completed.

---

## Step 2: Check for Existing Deep-Dive Artifacts

```bash
ls -la .tmp/deep-dive/*/ 2>/dev/null
```

Check for:
- `research.md` — Research phase completed
- `innovate.md` — Innovation phase completed
- `plan.md` — Plan phase completed

If multiple directories exist and it's unclear which relates to this issue, ask user to confirm.

If matching directory found, note which phases are already complete.

**Update todo:** Mark "Check for existing deep-dive artifacts" as completed.

---

## Step 3: Execute Deep-Dive Workflow

**CRITICAL: Auto-Continue Mode**

When executing phases within this skill:
- Do NOT ask user for confirmation between phases
- Do NOT ask "What would you like to do next?"
- Automatically proceed: Research → Innovate → Plan
- Only stop after ALL phases complete and comments posted
- **After each phase, IMMEDIATELY update todo** and check your list to ensure no steps are skipped

---

### Phase 1: Research (if no research.md exists)

**Purpose:** Strict information-gathering. Facts only — NO suggestions, solutions, or opinions.

**PERMITTED:** Reading files, analyzing architecture, understanding dependencies, tracing code flow, identifying constraints.
**FORBIDDEN:** Suggestions, implementation ideas, planning, approaches, recommendations.

#### For skill-gap issues

Read the affected skill's current state:

```bash
SKILL_NAME="<from issue>"
cat "skills/$SKILL_NAME/SKILL.md.tmpl"
ls "skills/$SKILL_NAME/references/" 2>/dev/null
```

Read ALL reference files in the affected skill. Then document:

1. **Skill architecture** — How many sections? What scoring approach? What modes?
2. **Where does the gap live?**
   - In `SKILL.md.tmpl` (embedded in template logic)
   - In `references/*.md` (externalized domain knowledge)
   - Both (template references content that doesn't exist)
3. **What's the blast radius?**
   - Single value fix → Small
   - New section in references/ → Medium
   - Template logic change (scoring, routing, flow) → Large
   - Cross-skill (multiple skills reference this) → Large
4. **Does the issue contradict existing content?**
   - If yes: document both values, do NOT pick a side
   - If no: document as straightforward addition
5. **Check if gap is already known:**

```bash
cat docs/domain-judgment-gaps.md
```

#### For new-skill issues

1. **Read the skill map:**

```bash
cat docs/DEVELOPMENT.md
```

2. **Read 2-3 similar existing skills** — closest by workflow position and domain type. Document: template structure, reference count, scoring approach, line count.

3. **Check the quality rubric:**

```bash
cat .claude/skills/skill-review/references/rubric.md
```

4. **Document feasibility:**
   - Can this be built without domain expert input? (A-type, ~60%)
   - Does it need expert calibration? (B-type, ~75%)
   - Is it fundamentally subjective? (may never exceed 50%)

#### For bug issues

1. **Reproduce:**

```bash
bun test
bun run gen:skill-docs:check
```

2. **Read affected files**, trace root cause
3. **Document findings** — what fails, why, what the fix boundary is

#### Research Output

Create artifact:

```bash
mkdir -p .tmp/deep-dive/issue-{id}
```

Write to `.tmp/deep-dive/issue-{id}/research.md`:

```markdown
# Research Phase: Issue #{id} — {title}

## 1. Issue Summary
<Goal, key dimensions>

## 2. Skill Analysis
<Current state of affected skill(s), architecture, reference files>

## 3. Codebase Findings
<File-by-file analysis, dependencies, patterns to follow>

## 4. Key Findings
<Numbered list of facts — NO recommendations>

## 5. Constraints & Open Questions
<What limits the solution space? What's unknown?>
```

Post to issue:

```bash
gh issue comment {issue-id} --body-file .tmp/deep-dive/issue-{id}/research.md
```

**Update todo:** Mark "Execute research phase" and "Post research comment" as completed.

**Do NOT stop. Automatically continue to Phase 2.**

---

### Phase 2: Innovate (if no innovate.md exists)

**Purpose:** Explore multiple solution approaches. Evaluate trade-offs. Do NOT commit to one solution.

**PERMITTED:** Discussing solution ideas, evaluating pros/cons, exploring alternatives, comparing strategies, considering trade-offs.
**FORBIDDEN:** Concrete planning with steps, implementation details, actual code, committing to single solution, effort estimates, file-by-file specifications.

Read `research.md` for context, then:

1. **Generate 2-3 distinct approaches at different scales.** For each:
   - Core concept and philosophy
   - Key advantages
   - Potential challenges/risks
   - Compatibility with existing gstack-game patterns (template engine, preamble injection, references/ split, anti-sycophancy)

   Approaches should represent genuinely different strategies, not just "same thing but less." A 3-line preamble tweak and a full skill rewrite can both be correct — for different problems.

2. **Trade-off analysis** — How do approaches differ on:
   - Domain confidence (do we have evidence?)
   - Regression risk (could this break existing scoring?)
   - Build complexity (template change vs references-only?)
   - Maintainability (will this be easy to update later?)
   - **Fitness** — does this approach match the nature of the problem? A skeleton skill at 35% needs a full build-out, not a patch. A missing preamble line needs a patch, not a new utility.

3. **Recommend the approach that best fits the problem** with reasoning.

   The right size is the one that **solves the actual problem without solving adjacent problems nobody asked about.** A game-codex rewrite from 123L to 610L is correct if the skill is fundamentally too thin. A 3-line preamble change is correct if the problem is "users can't see artifacts." Both are right-sized — the question is whether the approach matches what the issue actually needs.

   **Signs of a misfit:**
   - The approach solves problems the issue didn't mention (scope creep)
   - The approach creates infrastructure for hypothetical future needs (YAGNI)
   - The approach could be split into "solves the issue" + "nice to have" and only the first part is necessary
   - The approach builds a new tool when editing an existing file achieves the same outcome

#### gstack-game Specific Considerations

When evaluating approaches for skill changes, always consider:
- Does this change require `bun run build`? (template changes do, references-only don't)
- Does this affect the scoring formula? (HIGH regression risk)
- Does this need anti-sycophancy updates? (new sections need forbidden phrases)
- Does this need AUTO/ASK/ESCALATE classification?
- Does this affect downstream skills? (check artifact format)
- Is the content game-type-dependent? (may need mode selection)

#### Innovate Output

Write to `.tmp/deep-dive/issue-{id}/innovate.md`:

```markdown
# Innovation Phase: Issue #{id} — {title}

## Research Summary
<Key findings from research phase>

## Approach A: {name}
### Concept
<Core idea>
### Advantages
<Bulleted list>
### Challenges
<Bulleted list>
### Compatibility
<How does this fit gstack-game patterns?>

## Approach B: {name}
<Same structure>

## (Optional) Approach C: {name}
<Same structure>

## Trade-Off Analysis
| Dimension | Approach A | Approach B |
|-----------|-----------|-----------|
| Domain confidence | ... | ... |
| Regression risk | ... | ... |
| Build complexity | ... | ... |
| Maintainability | ... | ... |

## Recommended Approach
<Which and why — but acknowledge alternatives>

## Open Questions
<What needs resolving before planning?>
```

Post to issue:

```bash
gh issue comment {issue-id} --body-file .tmp/deep-dive/issue-{id}/innovate.md
```

**Update todo:** Mark "Execute innovate phase" and "Post innovate comment" as completed.

**Do NOT stop. Automatically continue to Phase 3.**

---

### Phase 3: Plan (if no plan.md exists)

**Purpose:** Transform research and chosen approach into concrete implementation plan.

**PERMITTED:** Detailed implementation steps, file changes, task dependencies, risks, verification checklist.
**FORBIDDEN:** Writing/modifying code, making commits, running builds, executing implementation.

Read both `research.md` AND `innovate.md` for context. Use the recommended approach (or user's choice if feedback was given).

#### Scope Fitness Check (before writing the plan)

Before planning, verify the approach actually fits the issue:

1. **Does the plan solve the stated problem?** Re-read the issue title and body. If the plan solves more than what was asked, split off the extras as separate issues.
2. **Does the plan create things only this issue needs?** New utilities, new skills, new infrastructure should exist because THIS issue requires them — not because they'd be "nice to have" for future issues.
3. **Could the plan be split into "solves the issue" + "improvements"?** If yes, the plan should only contain the first part. File the improvements as follow-up issues.

This is NOT about making plans small. A skeleton skill at 35% genuinely needs a full build-out — that IS the issue. But a "users can't see artifacts" issue doesn't need a new CLI utility + new skill + preamble change when a preamble change alone solves it.

#### Plan Templates by Scope

**Patch/Section scope** (single file, references-only):

```markdown
# Plan Phase: Issue #{id} — {title}

## Summary
<1-2 sentences: what changes and why>

## Files to Change
1. `skills/{name}/references/{file}.md` — <what changes>

## Change Detail
<Exact content to add/modify, with before/after if applicable>

## Verification
- [ ] `bun test` passes
- [ ] Content doesn't contradict other references in same skill
- [ ] If scoring change: recalculate one example to verify formula

## Domain Confidence
<HIGH: cited evidence / MEDIUM: reasonable inference / LOW: needs expert>
```

**Template scope** (modifies .tmpl logic):

```markdown
# Plan Phase: Issue #{id} — {title}

## Summary
<1-2 sentences>

## Files to Change
1. `skills/{name}/SKILL.md.tmpl` — <what changes>
2. `skills/{name}/references/{new-file}.md` — <if adding references>

## Architecture Decision
<Why this approach? What alternatives were considered? (reference innovate.md)>

## Change Detail (section by section)
- New/modified sections with purpose
- Routing logic changes (if any)
- Scoring formula changes (if any, with example calculation)
- Anti-sycophancy additions (forbidden phrases + calibrated alternatives)
- AUTO/ASK/ESCALATE classification for new sections

## Migration
- Does this change generated SKILL.md? → `bun run build` required
- Does this affect artifact format? → List downstream skills to check

## Verification
- [ ] `bun run build` succeeds
- [ ] `bun test` passes (all 11 tests)
- [ ] `bun run gen:skill-docs:check` shows no unexpected drift
- [ ] Manual walkthrough: invoke skill, verify flow

## Domain Confidence
<HIGH / MEDIUM / LOW>
```

**New skill scope**:

```markdown
# Plan Phase: Issue #{id} — new skill /{name}

## Summary
<What, who, where in workflow>

## Workflow Position
- **Layer:** Design / Bridge / Validation / Meta
- **Upstream:** <skills that feed in>
- **Downstream:** <skills that consume output>

## Files to Create
1. `skills/{name}/SKILL.md.tmpl` — main template
2. `skills/{name}/references/` — list each file with purpose

## Template Structure
1. Frontmatter (name, description, user_invocable)
2. `{{PREAMBLE}}` injection
3. Load References section (if references/ exists)
4. Mode selection (if applicable)
5. Section 1 — <purpose>
6. Section N — <purpose>
7. AUTO/ASK/ESCALATE
8. Anti-Sycophancy (3+ forbidden phrases, 3+ calibrated alternatives)
9. Completion Summary
10. Save Artifact
11. Review Log with `{{SKILL_NAME}}`

## Scoring Approach
<Explicit formula with dimensions and weights — not AI intuition>

## Quality Target
<A-type (55-65%) or B-type (70-80%) — what's needed for next tier>

## Verification
- [ ] `bun run build` succeeds
- [ ] `bun test` passes
- [ ] New skill appears in generated output
- [ ] Manual walkthrough produces useful output

## Documentation Updates
- [ ] CLAUDE.md skill tree (add to published skills)
- [ ] README.md / README.zh-TW.md skill count and install lists
- [ ] docs/DEVELOPMENT.md skill map and table
- [ ] CONTRIBUTING.md / CONTRIBUTING.zh-TW.md (if skeleton, add to table)
- [ ] CHANGELOG.md
```

#### Plan Output

Write to `.tmp/deep-dive/issue-{id}/plan.md` using the appropriate template above.

Post to issue:

```bash
gh issue comment {issue-id} --body-file .tmp/deep-dive/issue-{id}/plan.md
```

**Update todo:** Mark "Execute plan phase" and "Post plan comment" as completed.

---

## Step 4: Finalize

1. **Add planned label:**

```bash
gh issue edit {issue-id} --add-label "planned"
```

If label doesn't exist:

```bash
gh label create planned --description "Implementation plan posted, awaiting approval" --color 0E8A16
```

2. **Update todo:** Mark "Add planned label and finalize" as completed.
3. **Verify all 9 todos are completed** — check list, ALL must be done.
4. **Tell user:**

> Plan posted to issue #{id}. Three phases (research, innovate, plan) are documented.
> Review the plan on GitHub, then run `/issue-action` to implement.

5. **Exit.** Do NOT begin implementation.

---

## Skipping Phases (Idempotent Resume)

`/issue-plan` is designed to be **re-runnable**. If a conversation breaks mid-execution
(context window full, terminal closed, network drop), the user can re-invoke
`/issue-plan {id}` and it picks up where it left off — no wasted work, no duplicate posts.

### How it works

For each phase, check TWO things:

1. **Does the artifact file exist?** (`.tmp/deep-dive/issue-{id}/{phase}.md`)
2. **Was it already posted to the issue?**

```bash
# Check each phase — headers must match artifact output exactly
gh issue view {issue-id} --json comments --jq '.comments[].body' > /tmp/issue-comments.txt

grep -q "^# Research Phase:" /tmp/issue-comments.txt && echo "RESEARCH_POSTED" || echo "RESEARCH_NOT_POSTED"
grep -q "^# Innovation Phase:" /tmp/issue-comments.txt && echo "INNOVATE_POSTED" || echo "INNOVATE_NOT_POSTED"
grep -q "^# Plan Phase:" /tmp/issue-comments.txt && echo "PLAN_POSTED" || echo "PLAN_NOT_POSTED"
```

### Decision matrix

| Artifact exists? | Comment posted? | Action |
|-----------------|----------------|--------|
| No | — | Execute the phase from scratch |
| Yes | No | Skip execution, post existing artifact to issue |
| Yes | Yes | Skip both — phase fully complete |

Apply this for each phase in order: research → innovate → plan.

### Why post to issue at all?

- **Team visibility** — others on the issue see research findings, solution options, and the plan without needing local access to `.tmp/`
- **Cross-machine persistence** — `.tmp/` is local; issue comments survive machine changes
- **Review trail** — the three comments form a structured decision record (what we found → what we considered → what we'll do)

---

## Error Handling

- Issue doesn't exist: report and exit
- Label missing: create it (see above)
- Deep-dive directory unclear: ask user which to use
- Issue has no labels: classify from title/body, confirm with user

---

## Anti-Sycophancy

Forbidden:
- ❌ "This is a straightforward fix"
- ❌ "Easy change"
- ❌ "Should be quick"
- ❌ "Great issue"
- ❌ "For completeness, we should also..." (scope creep disguised as thoroughness)
- ❌ "While we're at it..." (bundling unrelated work)
- ❌ "To do this properly..." (implying the minimal approach is improper)

Instead: State scope and risk honestly. "This changes the scoring formula in `/balance-review` Section 3. The idle game economy model needs a genre-conditional branch — template logic change with medium regression risk."

**Scope creep red flags** — if you catch yourself writing any of these, re-read the issue and check fitness:
- "For completeness, we should also..." (solving adjacent problems nobody asked about)
- "While we're at it..." (bundling unrelated improvements)
- "To do this properly..." (implying the focused approach is improper)
- Plan includes infrastructure "for future use" that only this issue would need today
- Plan solves a problem the issue didn't mention

## AUTO/ASK/ESCALATE

- **AUTO:** Reading files, counting lines, checking test status, posting comments, creating labels
- **ASK:** Change scope confirmation, domain confidence assessment, approach selection when trade-offs are close
- **ESCALATE:** Cross-skill changes, scoring formula modifications, contradictions with existing domain content, changes affecting >3 files
