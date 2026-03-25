# Skill Quality Rubric — 15 Dimensions

Each dimension 0-2:
- **0** = Missing / absent
- **1** = Present but incomplete or low quality
- **2** = Complete and well-executed

Total: /30. Grades:
- **24-30**: Production — ready to use as-is
- **18-23**: Usable — works but has clear gaps
- **12-17**: Draft — skeleton with content, needs significant work
- **0-11**: Skeleton — structure only

---

## A. Entry Layer (first second the user triggers the skill)

**A1. Trigger Description**
- 0 = description is just a feature summary ("Game balance review")
- 1 = has when-to-use, missing when-NOT-to-use or trigger phrases
- 2 = complete: what it does + when to use + when NOT to use + adjacent skills + trigger phrases

**A2. Role Identity**
- 0 = no explicit role
- 1 = role exists but vague ("you are a game reviewer")
- 2 = one sentence that locks the agent into a specific posture ("you are an economy mathematician — show numbers, not feelings")

**A3. Mode Routing**
- 0 = no mode distinction, single path
- 1 = has modes but relies on Claude to infer which
- 2 = explicit args parsing or AskUserQuestion routing at entry, locked after selection

## B. Flow Layer (execution skeleton)

**B4. Flow Externalization**
- 0 = relies on Claude memory for flow
- 1 = has phases/sections but no external tracking
- 2 = uses TodoWrite / driver script / status table / explicit phase gates

**B5. STOP Gates**
- 0 = no STOP rules
- 1 = has "one issue per AskUserQuestion" but not every section
- 2 = every section ends with STOP + "resolve all before proceeding"

**B6. Recovery / Interrupt Handling**
- 0 = absent
- 1 = basic error handling table
- 2 = full recovery procedure (rebuild state, resume from incomplete phase)

## C. Knowledge Layer (what the skill gives Claude)

**C7. Gotchas**
- 0 = absent
- 1 = has anti-sycophancy forbidden phrases only
- 2 = has Claude-specific operational gotchas (what Claude gets wrong doing THIS task) + forbidden phrases + forcing questions

**C8. Scoring / Quantitative Rigor**
- 0 = no scoring, qualitative only
- 1 = has scoring but relies on AI intuition
- 2 = explicit formula per dimension + calibrated benchmarks + no AI intuition

**C9. Domain Benchmarks**
- 0 = no industry reference data
- 1 = scattered references
- 2 = structured benchmark tables with healthy/warning/critical thresholds

## D. Structure Layer (file organization)

**D10. Progressive Disclosure**
- 0 = everything in one SKILL.md (>300 lines)
- 1 = has references/ but only 1-2 files
- 2 = SKILL.md is orchestration (<300 lines), details in references/ (gotchas, scoring, section content, benchmarks)

**D11. Helper Code / Scripts**
- 0 = pure markdown, nothing executable
- 1 = has inline bash blocks but no bundled scripts
- 2 = has scripts/ directory or bundled helpers (driver scripts, calculation tools, templates)

**D12. Config / Memory**
- 0 = absent
- 1 = has review log but no per-project config
- 2 = has config.json (remembers project context) + review history (reads own past results)

## E. System Layer (relationship to other skills)

**E13. Artifact Discovery**
- 0 = starts from zero, doesn't look for upstream artifacts
- 1 = finds primary doc (GDD) but not other skills' outputs
- 2 = searches for GDD + prior reviews from this skill + outputs from other skills (balance, direction, etc.)

**E14. Output Contract**
- 0 = output is chat text only
- 1 = has completion summary but doesn't write to file
- 2 = writes artifact to ~/.gstack/projects/ (discoverable by downstream) + review log + structured format

**E15. Workflow Position**
- 0 = isolated, doesn't know upstream/downstream
- 1 = recommends next skill at end
- 2 = reads upstream artifacts at start + writes artifacts for downstream + recommends next step
