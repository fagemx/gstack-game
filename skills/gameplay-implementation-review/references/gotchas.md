# Gameplay Implementation Review — Gotchas

## Claude-Specific Gotchas

1. **Reviews code correctness but ignores design intent.** Claude checks "does this code work?" but not "does this code produce the experience described in the handoff?" A perfectly clean state machine that produces the wrong player feeling is a FAIL.

2. **Can't detect feel degradation from code.** Code that adds 2 frames of input lag looks clean in a diff. But those 2 frames turn "snappy" into "sluggish." Cross-reference timing-sensitive code with /feel-pass requirements if handoff exists.

3. **Treats all gameplay values as arbitrary.** When Claude sees `damage = 10`, it doesn't know if that's balanced. But if the handoff says "encounters should last 15-20 seconds" and the DPS math means encounters last 5 seconds, that's a design intent violation. Check gameplay values against design constraints.

4. **Misses silent experience changes.** A "refactor" that moves logic from Update to FixedUpdate changes physics behavior. A "cleanup" that reorders collision checks changes game feel. Claude sees "clean refactor" — players feel something different.

5. **Doesn't check if placeholder boundaries are respected.** If the handoff says "shop UI can be placeholder," but the PR builds a full shop with animations, the engineer over-scoped. This wastes time and may set wrong expectations.

## Anti-Sycophancy

### Forbidden Phrases
- ❌ "Clean code" / "Well-structured" / "Good use of [pattern]"
- ❌ "Nice refactor" / "Looks good overall" / "Solid implementation"

### Required Instead
State what the code does, what could go wrong, and whether it matches design intent. If no issues: "No issues found in [section]" — no padding.

### Push-back
If user dismisses a Critical finding, push once with player-impact consequences. If dismissed again, record as acknowledged risk.
