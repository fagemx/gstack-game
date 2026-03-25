# Validation Checklist — Before Marking PR as Ready

Run through ALL checks before marking a contribution PR as ready for review.

## 1. Content placed correctly

- [ ] Content is in the right skill (contributor might say `/game-review` but mean `/balance-review`)
- [ ] Content is in the right file within references/ (gotcha in gotchas.md, not scoring.md)
- [ ] Content is in the right section within the file (Section 1 content not in Section 3)

## 2. No contradictions introduced

```bash
# Run from gstack-game root. Replace KEYWORD with the topic of the contribution.
grep -rn "KEYWORD" skills/*/references/*.md skills/*/SKILL.md.tmpl
```

- [ ] New benchmark doesn't contradict same metric in another skill
- [ ] New gotcha doesn't contradict an existing gotcha in the same skill
- [ ] New forcing question doesn't duplicate an existing question (similar intent = duplicate)

If contradictions found → ⚠️ flag in PR, do not resolve.

## 3. Format matches existing content

- [ ] Uses same markdown structure as adjacent items (numbered list? table row? bold header?)
- [ ] Uses game design vocabulary from preamble (not inventing new terms)
- [ ] Has attribution (contributor's experience/source)
- [ ] Gotchas have: wrong → correct → reasoning → source
- [ ] Forcing questions have: question → push-back → red flags → STOP
- [ ] Benchmarks have: value → context → source

## 4. Skill integrity preserved

```bash
bun run build
bun test
```

- [ ] `bun run build` succeeds (no template errors)
- [ ] `bun test` passes (all validation tests)
- [ ] If SKILL.md.tmpl was modified: all mechanisms preserved (check with `/skill-review`)

## 5. Scope check

- [ ] Contribution stays within references/ (if it needs SKILL.md.tmpl changes, flag as scope change)
- [ ] No scoring formula changes without explicit maintainer approval
- [ ] No new sections added to a skill without explicit maintainer approval
- [ ] No STOP gates or AskUserQuestion patterns changed

## 6. PR description complete

- [ ] Links to original Issue
- [ ] Shows the diff (what changed, where)
- [ ] Lists any ⚠️ flags that need maintainer decision
- [ ] Credits the contributor
- [ ] States which skill and which file were modified

## Quick pass/fail

| Check | Result |
|-------|--------|
| Content in right place | ✅ / ❌ |
| No contradictions | ✅ / ⚠️ (flagged) / ❌ |
| Format matches | ✅ / ❌ |
| Build + test pass | ✅ / ❌ |
| Within scope | ✅ / ⚠️ (scope change flagged) |
| PR description | ✅ / ❌ |

**Ready for review if:** All ✅, or all ✅ with ⚠️ flags clearly documented.
**Not ready if:** Any ❌. Fix the ❌ items first.
