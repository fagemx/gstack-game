# Phase 2: Innovate — three approaches for game-codex expansion

## Approach A: Expand all 3 modes with deep methodology + add references/

**Concept:** Bring all three modes (Review, Challenge, Consult) to B-type quality. Add a `references/` directory with domain-specific attack patterns. Target: ~400-500 lines in template + 3-4 reference files.

**What changes:**

1. **Mode A (Adversarial Review)** — expand from checklist to structured methodology:
   - Add Step 0: Scope & Game Type Classification (single-player/multiplayer/live-service changes which categories matter)
   - Add multi-pass structure: Pass 1 = exploit surface scan, Pass 2 = deep attack on highest-risk categories
   - Move exploit taxonomy to `references/exploit-taxonomy.md` with 3-5 examples per category instead of 1
   - Add `references/attack-recipes.md` — step-by-step investigation patterns (like game-debug's bug recipes)
   - Add quantitative Threat Score: `risk = severity × likelihood × (1 / detection_difficulty)`
   - Add forcing questions per exploit category

2. **Mode B (Challenge)** — expand steelman-then-attack into a rigorous framework:
   - Add 6 common design fallacies to check against (sunk cost, feature creep, complexity bias, success theater, platform mismatch, audience mismatch)
   - Add structured failure scenario template (trigger → chain → player impact → recovery cost)
   - Add "devil's advocate" role with specific attack angles per game type

3. **Mode C (Consult)** — expand reframe-and-recommend:
   - Add 5 reframing lenses (player lens, technical lens, business lens, competitive lens, timeline lens)
   - Add "constraint-based ideation" — turn constraints into features
   - Add structured output format for recommendations

4. **Cross-cutting additions:**
   - Proper AskUserQuestion with 4-part format for mode selection
   - AUTO/ASK/ESCALATE for each mode
   - Anti-sycophancy with game-specific forbidden phrases and calibrated alternatives
   - STOP directives after each pass/section

**Pros:** Comprehensive. All modes usable. References reusable by other skills.
**Cons:** Large scope (~3-4 days of work). Risk of spreading effort too thin. Mode B and C may not warrant the depth if rarely used.

**Estimated size:** ~450 lines template + ~200 lines in references/

---

## Approach B: Focus on Mode A (adversarial code review) only — deepest potential

**Concept:** Go deep on Mode A exclusively. Modes B and C stay as-is (or get minor polish). All effort goes into making the adversarial code review world-class.

**What changes:**

1. **Mode A gets a full 3-pass structure:**
   - Pass 0: Attack Surface Mapping — classify the diff by game type, identify which exploit categories apply, estimate threat surface area
   - Pass 1: Systematic Exploit Scan — check each relevant category from the taxonomy with step-by-step attack recipes
   - Pass 2: Creative Exploitation — "think like a speedrunner/cheater" freeform pass, looking for exploit chains (combining two benign issues into one game-breaking one)

2. **Game-type-aware attack priority matrix:**
   ```
   | Category        | Single-player | Competitive MP | Co-op | Live-service |
   |-----------------|:---:|:---:|:---:|:---:|
   | Speed exploit   |  M  |  H  |  M  |  H  |
   | Duplication     |  L  |  H  |  H  |  C  |
   | State corrupt   |  H  |  C  |  H  |  C  |
   | Economy abuse   |  L  |  M  |  M  |  C  |
   | PvP cheat       |  -  |  C  |  L  |  C  |
   ...
   ```

3. **references/attack-recipes.md** — detailed investigation patterns:
   - "How to find duplication bugs" (timing windows, concurrent operations, undo/redo chains)
   - "How to find state corruption" (interrupt points, transition edge cases, save/load mid-action)
   - "How to find economy exploits" (circular trades, reset farming, exchange rate rounding)

4. **Quantitative Threat Assessment:**
   - Per-finding: severity (1-4) x likelihood (1-4) x inverse-detectability (1-3) = threat score
   - Aggregate: threat surface score with game-type weighting
   - Output: ranked threat list + overall risk rating

5. **Modes B and C:** Minor polish only — add AskUserQuestion format, STOP directives, basic AUTO/ASK/ESCALATE.

**Pros:** Highest value per effort. Mode A is the unique differentiator of game-codex. Deep adversarial methodology doesn't exist elsewhere in the skill set.
**Cons:** Modes B and C remain thin. Users wanting design challenge or consult get a skeleton experience.

**Estimated size:** ~350 lines template + ~150 lines in references/

---

## Approach C: Add references/ with exploit-patterns.md per game type + "steelman then attack" framework

**Concept:** The template stays relatively compact but gains depth through rich reference files. The template becomes a "router" that points to the right reference material based on game type. Additionally, formalize the "steelman then attack" pattern as a cross-mode methodology.

**What changes:**

1. **Template changes (moderate):**
   - Add game-type classification step (Step 0)
   - Add AskUserQuestion, AUTO/ASK/ESCALATE, STOP directives, scoring
   - Add "steelman then attack" as the universal methodology across all 3 modes:
     - Mode A: steelman the code ("this works because..."), then attack it ("but it breaks when...")
     - Mode B: steelman the decision, then attack with failure scenarios (already exists, formalize)
     - Mode C: steelman the current approach, then reframe from a fresh angle

2. **references/ directory (the real depth):**
   - `references/exploit-taxonomy.md` — expanded taxonomy with 3-5 examples per category, investigation steps
   - `references/attack-by-game-type.md` — priority matrix + game-type-specific attack patterns
   - `references/design-fallacies.md` — 10 common game design fallacies for Mode B challenges
   - `references/gotchas.md` — Claude-specific adversarial review mistakes (like gameplay-implementation-review has)

3. **"Load References" pattern** — copy from gameplay-implementation-review:
   ```
   ## Load References (BEFORE any interaction)
   Read ALL reference files now:
   - references/exploit-taxonomy.md
   - references/attack-by-game-type.md
   - references/design-fallacies.md
   - references/gotchas.md
   ```

**Pros:** Clean separation of template (methodology) and references (domain knowledge). References can be updated independently. Follows the proven gameplay-implementation-review pattern. Moderate template size keeps it readable.
**Cons:** Depth is split across files — harder to see the full picture. Reference files need significant domain knowledge to write well.

**Estimated size:** ~250 lines template + ~400 lines across 4 reference files

---

## Comparison

| Criterion | A: All modes | B: Mode A deep | C: References pattern |
|-----------|:---:|:---:|:---:|
| Effort | High (~4 days) | Medium (~2-3 days) | Medium (~3 days) |
| Mode A depth | Good | Excellent | Good (via refs) |
| Mode B depth | Good | Minimal | Good (via refs) |
| Mode C depth | Good | Minimal | Moderate |
| Follows existing patterns | Partially | Partially | Strongly (mirrors impl-review) |
| Maintainability | Template gets long | Manageable | Best (refs separate from logic) |
| Reusability of artifacts | Moderate | Low | High (refs reusable) |

## Recommendation

**Approach C** (references pattern) is the best fit because:
1. It mirrors the proven `gameplay-implementation-review` architecture that already works at B-type quality
2. Reference files can be iterated independently from the template logic
3. All three modes get meaningful depth without a 500-line template
4. The "steelman then attack" unifying methodology gives the skill a coherent identity
5. Reference files (especially exploit-taxonomy.md and attack-by-game-type.md) could eventually be shared with gameplay-implementation-review's adversarial pass

However, the **attack-by-game-type priority matrix** from Approach B should be incorporated — it's the single highest-value addition regardless of approach.
