# Phase 1: Research — game-codex depth analysis

## Current State: 123 lines, Skeleton tier (40%)

### What exists

**3 modes:**
- **Mode A: Adversarial Code Review** (~45 lines) — the deepest section. Has an adversarial persona prompt, 7 game-specific attack vectors, a 10-category exploit taxonomy table, and a 3-axis severity rating (severity/effort/detectability).
- **Mode B: Challenge** (~8 lines) — 4-step steelman-then-attack framework. Structure only, no depth.
- **Mode C: Consult** (~6 lines) — 3-step reframe-and-recommend. Structure only, no depth.

**Supporting sections:** Anti-sycophancy (7 lines, maximally adversarial stance), completion summary, save artifact, review log.

### What the exploit taxonomy covers

The 10-category taxonomy is the strongest part of the skill:
1. Speed exploit, 2. Duplication, 3. State corruption, 4. Progression skip, 5. Economy abuse, 6. PvP cheat, 7. Save manipulation, 8. Determinism break, 9. Social exploit, 10. Content leak

Each has: category name, attack description, one concrete example.

### Gaps identified

**Structural gaps (missing from gstack methodology):**
1. **No AskUserQuestion format** — Mode selection is informal, doesn't follow the 4-part structure (re-ground, simplify, recommend, options)
2. **No AUTO/ASK/ESCALATE classification** — Required by every skill, completely absent
3. **No forcing questions** — No mandatory probing questions that prevent shallow review
4. **No multi-pass structure** — Mode A does a single pass; production skills (game-qa, gameplay-implementation-review) use multi-pass
5. **No scoring formula** — Findings are listed but not scored; no quantitative output
6. **No STOP directives** — No "one issue per AskUserQuestion" flow control

**Content depth gaps:**
7. **Mode A lacks investigation methodology** — Has a checklist of WHAT to look for but no HOW. Compare to game-debug which has hypothesis testing, 3-strike rule, bug recipes with step-by-step investigation paths
8. **Exploit taxonomy has no game-type adaptation** — Same 10 categories for a single-player puzzle game and an MMO. No guidance on which categories matter for which genre
9. **No references/ directory** — gameplay-implementation-review has 4 reference files (gotchas.md, design-intent-checks.md, pass1-critical.md, pass2-informational.md). game-codex has zero
10. **Mode B (Challenge) is a skeleton** — The steelman-then-attack pattern is powerful but needs: specific challenge dimensions, common design fallacies, failure scenario templates
11. **Mode C (Consult) is a skeleton** — Needs: reframing techniques, fresh-perspective heuristics, structured problem decomposition
12. **No cross-reference with other skills** — Should reference what gameplay-implementation-review and game-qa already cover, to focus on what they MISS

### Comparison to depth benchmarks

| Skill | Lines | Quality | Key depth indicators |
|-------|-------|---------|---------------------|
| game-qa | 702 | B-type (65%) | 8 scored sections, weighted health score, fix loop, triage phase, forcing questions per section, bug severity classification |
| gameplay-implementation-review | 186 + 4 ref files | B-type (75%) | 3-pass structure, reference files with domain checklists, scope classification, pass transitions |
| game-debug | 182 | A-type (40%) | Bug classification table, hypothesis testing with 3-strike rule, 5 bug recipe patterns with step-by-step |
| **game-codex** | **123** | **Skeleton (40%)** | **Exploit taxonomy table, adversarial persona, severity rating — no methodology, no scoring, no references** |

### What game-codex SHOULD be (based on patterns)

game-codex's unique value is **independent adversarial review** — finding what other skills miss. It needs:
1. A structured attack methodology (not just a checklist)
2. Game-type-aware attack priorities
3. Reference files with detailed exploit patterns per game category
4. Quantitative output (threat score or risk matrix)
5. Clear differentiation from gameplay-implementation-review's adversarial pass
