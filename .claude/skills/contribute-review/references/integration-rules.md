# Integration Rules — What the Agent Can and Cannot Decide

## Agent CAN decide (do without asking)

### Format fixes
- Restructure free-text gotcha into standard gotcha format (wrong → correct → evidence)
- Add missing push-back script to a forcing question (infer from the question's intent)
- Fix markdown formatting (headers, tables, code blocks)
- Move content to the correct file (contributor said "gotchas.md" but it's actually a benchmark → move to scoring.md)

### Consistency fixes
- Add cross-references when new content relates to existing content
- Update table of contents or section numbering
- Ensure new benchmark uses same units as existing benchmarks in the file
- Align terminology with preamble vocabulary list

### Structural decisions
- Choose which references/ file to put content in (based on content type, not domain judgment)
- Decide placement within a file (which section, which bullet point position)
- Split a long contribution into multiple items if it covers different topics

## Agent CANNOT decide (must escalate)

### Domain judgment
- Whether a benchmark number is correct (even if it contradicts existing)
- Whether a gotcha is real or a misconception
- Whether a forcing question is actually important
- Whether a scoring weight should change
- Which of two conflicting values is right

### Design decisions
- Whether to add a new mode to a skill (e.g., "VR mode" for /game-review)
- Whether to add a new section to a skill
- Whether to split or merge skills
- Whether a contribution changes the skill's scope

### Scope changes
- Anything that modifies SKILL.md.tmpl (not just references/)
- Anything that changes scoring formulas
- Anything that adds/removes STOP gates or AskUserQuestion patterns

## How to escalate

When the agent cannot decide, it MUST:

1. **Not silently pick a side.** Never resolve a domain conflict by choosing one value.
2. **Mark in the PR body** with a `⚠️ NEEDS DOMAIN REVIEW` label and a specific question:
   ```
   ⚠️ NEEDS DOMAIN REVIEW:
   Contributor says D1 retention benchmark should be 35-45% (not 40%+).
   Current value in references/scoring.md L27: "> 40% = good"
   Contributor's source: Sensor Tower 2026 Q1

   Question for maintainer: Is the new value correct? Should we keep the old
   value for premium and use the new value for F2P only?
   ```
3. **Include both versions** in the PR as a clear diff, so the reviewer sees exactly what changes.

## Contradiction Detection

Before writing any change, grep for potential contradictions:

```bash
# Search all references/ files for the same topic
grep -rn "D1.*retention\|retention.*D1" skills/*/references/*.md
grep -rn "faucet.*sink\|sink.*faucet" skills/*/references/*.md
grep -rn "CPI\|LTV\|ARPDAU" skills/*/references/*.md
```

If the same metric appears in multiple files with different values → flag ALL locations in the PR.
