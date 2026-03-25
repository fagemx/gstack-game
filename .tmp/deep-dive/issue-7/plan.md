# Phase 3: Plan — game-codex expansion (Approach C + B's priority matrix)

## Selected approach: References pattern with game-type-aware attack priorities

Mirrors `gameplay-implementation-review` architecture. Template stays readable (~250 lines), depth lives in `references/` (~400 lines across 4 files).

---

## Deliverables

### 1. `skills/game-codex/SKILL.md.tmpl` — rewrite (~250 lines)

**Structure:**

```
Frontmatter (unchanged)
{{PREAMBLE}}

## Load References (BEFORE any interaction)
  → Read all 4 reference files

## Step 0: Scope & Game Type Classification
  → AskUserQuestion (4-part format): which mode + game type
  → Game type options: Single-player / Competitive MP / Co-op / Live-service
  → Game type determines exploit category priority (from references)
  → STOP.

## Mode A: Adversarial Code Review
  ### Pass 1: Attack Surface Mapping
    → Read diff
    → Classify changed code against exploit taxonomy
    → Filter to relevant categories based on game type priority matrix
    → Output: ranked list of attack surfaces to investigate
    → STOP.

  ### Pass 2: Systematic Exploit Scan
    → For each high/critical-priority category:
      → Follow attack recipe from references
      → Rate each finding: threat_score = severity(1-4) × likelihood(1-4) × detectability_inverse(1-3)
    → STOP after each finding. One issue per AskUserQuestion.

  ### Pass 3: Creative Exploitation (optional, large diffs)
    → Freeform "speedrunner/cheater" pass
    → Look for exploit chains (two benign issues combining into game-breaking)
    → STOP.

  ### Threat Assessment Output
    → Ranked findings table with threat scores
    → Aggregate risk rating: LOW / MEDIUM / HIGH / CRITICAL
    → Formula: if any finding ≥32 → CRITICAL, if any ≥16 → HIGH, if sum >40 → HIGH

## Mode B: Challenge
  → Steelman-then-attack methodology (expanded)
  → Check against design fallacies from references
  → 3 structured failure scenarios using template
  → Verdict with reasoning
  → AUTO/ASK/ESCALATE
  → STOP.

## Mode C: Consult
  → 5 reframing lenses (player/technical/business/competitive/timeline)
  → Steelman current approach first
  → 3 genuinely different approaches
  → Recommendation with trade-off matrix
  → STOP.

## Anti-Sycophancy (expanded)
  → Forbidden phrases (keep existing + add calibrated alternatives)
  → Push-back cadence (push once, push again with data, escalate)

## Completion Summary
## Save Artifact
## Review Log
```

### 2. `skills/game-codex/references/exploit-taxonomy.md` (~120 lines)

Expanded version of the current 10-category table. For each category:
- Category name and description
- 3-5 concrete examples (not 1)
- Attack recipe: step-by-step "how to find this"
- Common code patterns that indicate vulnerability
- Severity calibration: when is this cosmetic vs game-breaking?

### 3. `skills/game-codex/references/attack-by-game-type.md` (~80 lines)

Priority matrix from Approach B:
- Rows: 10 exploit categories
- Columns: Single-player / Competitive MP / Co-op / Live-service
- Values: Critical / High / Medium / Low / N/A
- Per-type "top 3 attack vectors" with brief rationale

### 4. `skills/game-codex/references/design-fallacies.md` (~100 lines)

For Mode B (Challenge). 10 common game design fallacies:
1. Sunk cost ("we already built it")
2. Feature creep ("just one more thing")
3. Complexity bias ("more systems = more depth")
4. Success theater ("our metrics look good" when metrics are wrong)
5. Platform mismatch ("it works on PC" for a mobile game)
6. Audience mismatch (building for self, not target player)
7. Retention cargo cult (copying retention hooks without understanding why they work)
8. Monetization-gameplay conflict (pay-to-win disguised as convenience)
9. Scope optimism ("we can cut later" — no you can't, not one-way doors)
10. Uniqueness fallacy ("no one has done this" — they have, you haven't found it)

Each: name, description, how to detect it, steelman (why teams fall for it), attack (why it fails).

### 5. `skills/game-codex/references/gotchas.md` (~60 lines)

Claude-specific adversarial review mistakes (mirrors gameplay-implementation-review/references/gotchas.md):
1. Treats adversarial review as a checklist, not an investigation
2. Finds surface-level issues, misses exploit chains
3. Rates everything as "game-breaking" (severity inflation)
4. Doesn't adapt attack priorities to game type
5. Misses timing-based exploits (can't run the code)
6. Over-focuses on network exploits for single-player games

Plus anti-sycophancy section and push-back rules.

---

## Implementation steps

| Step | Task | Files changed | Depends on |
|------|------|---------------|------------|
| 1 | Create `references/exploit-taxonomy.md` | new file | — |
| 2 | Create `references/attack-by-game-type.md` | new file | — |
| 3 | Create `references/design-fallacies.md` | new file | — |
| 4 | Create `references/gotchas.md` | new file | — |
| 5 | Rewrite `SKILL.md.tmpl` | edit existing | Steps 1-4 (needs to reference them) |
| 6 | Run `bun run build` | generates SKILL.md | Step 5 |
| 7 | Run `bun test` | — | Step 6 |
| 8 | Commit: reference files (steps 1-4) | 4 new files | Steps 1-4 |
| 9 | Commit: template rewrite + generated SKILL.md | 2 files | Steps 5-7 |

Steps 1-4 can be done in parallel. Steps 8-9 are separate commits per bisect-commit policy.

---

## Quality target

- **Before:** 123 lines, Skeleton (40%)
- **After:** ~250 lines template + ~360 lines references = ~610 total lines, B-type (70%)
- **Validation:** `bun test` passes, all 6 methodology requirements met (classification, scoring, AUTO/ASK/ESCALATE, forcing questions, multi-pass, anti-sycophancy)

## Out of scope

- Sharing references with gameplay-implementation-review's adversarial pass (future issue)
- Adding game-codex to other skills' artifact discovery (future issue)
- Domain expert calibration of exploit severity ratings (tracked in domain-judgment-gaps.md)

## Risk

- **Main risk:** Reference files require game security domain knowledge. The exploit taxonomy and attack recipes need to be accurate enough that Claude produces useful adversarial findings, not generic checklists.
- **Mitigation:** Base content on the existing taxonomy (which is already reasonable) and expand with well-known exploit patterns from public game security resources. Flag in domain-judgment-gaps.md that expert calibration is still needed.
