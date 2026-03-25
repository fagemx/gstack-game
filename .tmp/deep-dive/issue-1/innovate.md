# Phase 2: Innovate — `/triage` Design Approaches

## Approach A: Simple Decision Tree (3-5 Questions)

**Concept:** A linear questionnaire that classifies the user into a project phase, then recommends one skill. No artifact detection — purely conversational.

**Flow:**
1. "What best describes where you are?" (5 options mapping to project maturity: no idea / idea / GDD / build / shipping)
2. Based on answer, one follow-up question to narrow (e.g., "Do you have a written design doc?" or "Has anyone playtested it?")
3. Recommend one skill with a one-line explanation.

**Advantages:**
- Simplest to build and maintain. ~80-120 lines of template content.
- Zero dependencies — works in empty repos, new projects, any state.
- Easy to understand and verify: input = answers, output = skill recommendation.
- Lowest risk of incorrect auto-detection leading to wrong routing.

**Challenges:**
- Ignores existing project artifacts — user must self-assess accurately.
- Self-assessment is unreliable: users overestimate readiness ("I have a GDD" when they have a paragraph).
- No re-invocation value — same questions every time, no memory of progress.
- Doesn't leverage the artifact discovery system that every other skill already uses.

**Compatibility with gstack-game patterns:**
- Follows AskUserQuestion format: yes.
- Anti-sycophancy: limited applicability (routing, not reviewing).
- AUTO/ASK/ESCALATE: mostly ASK (questions) with final recommendation as AUTO.
- Artifact output: minimal — just a routing decision, no persistent artifact needed.

---

## Approach B: Context-Aware Routing (Artifact Detection + Confirmation)

**Concept:** Before asking any questions, scan the project for existing artifacts (GDDs, concepts, prior review results, build files, playtest data). Present the detected state to the user for confirmation, then recommend the next skill.

**Flow:**
1. **Auto-detect phase (bash, no user input):**
   - Check for `docs/gdd.md`, `docs/concept.md`, prior `/game-import` artifacts
   - Check for prior review artifacts (`*-game-review-*.md`, `*-balance-review-*.md`, etc.)
   - Check for build artifacts (engine project files, build outputs)
   - Check `~/.gstack/projects/{slug}/` for any prior skill runs
2. **Present assessment via AskUserQuestion:**
   > "Based on what I found in your project: {state summary}. You appear to be at the {X} stage."
   > A) That's right — show me what to do next
   > B) Not quite — {correct the assessment}
3. **Route based on confirmed state + gap analysis:**
   - If no concept and no GDD: `/game-ideation`
   - If concept but no standardized GDD: `/game-import`
   - If GDD but no reviews: `/game-review`
   - If reviews done but no build plan: `/prototype-slice-plan` or `/game-direction`
   - If build exists but untested: `/feel-pass` or `/build-playability-review`
   - If tested and ready: `/game-qa` → `/game-ship`

**Advantages:**
- Leverages the artifact discovery system already built into gstack-game.
- Reduces user burden — system detects state rather than asking users to self-assess.
- Valuable on re-invocation: detects progress since last run, recommends the next step.
- Produces a useful "project state" artifact that downstream skills can consume.
- Aligns with how `/game-import` and `/game-ideation` already work (both scan for prior artifacts at startup).

**Challenges:**
- More complex template (~200-300 lines).
- Artifact detection heuristics can be wrong (e.g., engine project files might exist but the game is a different project).
- Requires maintaining a mapping of artifact patterns → project phases as new skills are added.
- User must still confirm — auto-detection alone is insufficient (the "B) Not quite" escape hatch is essential).

**Compatibility with gstack-game patterns:**
- Follows artifact discovery pattern from preamble: yes, extends it.
- AskUserQuestion format: yes, confirmation + routing.
- Produces artifact: yes, project state snapshot at `~/.gstack/projects/{slug}/`.
- Re-invocation friendly: yes, detects what changed since last triage.

---

## Approach C: Hybrid — Detect First, Ask to Fill Gaps

**Concept:** Combine A and B. Run artifact detection first (like B), then ask targeted questions only for dimensions that couldn't be detected (like A). This gives the best of both: fast routing when artifacts exist, guided routing when starting fresh.

**Flow:**
1. **Silent detection phase** (same as Approach B)
2. **Classification into one of 6 project states:**
   - **BLANK** — empty repo, no game artifacts → ask 2 questions (idea maturity + platform)
   - **IDEA** — concept doc exists, no GDD → confirm concept, ask if ready to formalize
   - **DOCUMENTED** — GDD exists, no reviews → confirm GDD state, recommend review
   - **REVIEWED** — review artifacts exist, no build → summarize review findings, recommend next
   - **BUILDING** — build/engine artifacts exist → ask about build state (prototype vs. production)
   - **SHIPPING** — significant completion signals → recommend QA/ship workflow
3. **State-specific question (0-2 questions max):**
   - BLANK: "Is this a brand new idea, or do you have something in your head already?"
   - IDEA: "Ready to write a proper GDD, or still exploring the concept?"
   - DOCUMENTED: "Your GDD has {N}/8 sections. Want a design review or to address gaps first?"
   - REVIEWED: "Reviews found {issues}. Want to plan the build, or address review findings?"
   - BUILDING: "Do you have a playable build someone could test?"
   - SHIPPING: "Are you preparing for release, or still in QA?"
4. **Route to specific skill with reasoning.**
5. **Save project state artifact** for downstream consumption and future re-invocation.

**Advantages:**
- Minimizes questions (0-2 instead of 3-5) when artifacts exist.
- Still works in empty repos (falls back to Approach A behavior).
- Produces the richest project state artifact.
- Re-invocation shows progress: "Last time you were at IDEA, now you're at DOCUMENTED."
- Most aligned with the existing gstack-game pattern of "detect → confirm → act."

**Challenges:**
- Most complex to build (~250-350 lines).
- 6 state paths means more template content to maintain.
- State classification heuristics need careful calibration.
- Risk of over-engineering a routing skill — diminishing returns past Approach B.

**Compatibility with gstack-game patterns:**
- Full alignment with artifact discovery, AskUserQuestion, and artifact output patterns.
- Natural extension of how `/game-import` Phase 1 already works.
- Cleanest integration with re-invocation and progress tracking.

---

## Trade-Off Analysis

| Dimension | A: Decision Tree | B: Context-Aware | C: Hybrid |
|-----------|:---:|:---:|:---:|
| **Template complexity** | Low (~100L) | Medium (~250L) | High (~300L) |
| **Questions asked** | 3-5 always | 1-2 always | 0-2 (adaptive) |
| **Empty repo support** | Excellent | Fair (falls back to asking) | Excellent |
| **Established project support** | Fair (user self-assesses) | Excellent | Excellent |
| **Re-invocation value** | None | High | Highest |
| **Artifact output** | None | Project state snapshot | Project state + progress delta |
| **Maintenance burden** | Low | Medium | Medium-High |
| **Risk of wrong routing** | Medium (user error) | Low (detection + confirmation) | Lowest |
| **Time to build** | 1-2 hours | 3-4 hours | 4-5 hours |
| **Quality rubric fit** | ~16/30 (Draft) | ~22/30 (Usable) | ~24/30 (Production) |

## Recommendation

**Approach C (Hybrid)** is the strongest choice. Rationale:

1. `/triage` is the front door of gstack-game — it should be high quality (Production tier target).
2. The artifact detection system already exists in preamble and individual skills. Not using it would be inconsistent.
3. The 0-2 question adaptive behavior respects the user's time — the exact design principle in ETHOS.md.
4. The project state artifact creates a new capability: any downstream skill can read the triage result to understand project context without re-detecting.
5. Re-invocation as a "where am I now?" compass is a natural extension that makes `/triage` useful beyond first contact.

The additional complexity (~300L vs ~100L) is justified because this is the skill every new user will encounter first. A Draft-quality entry point undermines confidence in the entire system.

**Fallback:** If time or scope is constrained, Approach B delivers 80% of the value at 70% of the effort.
