# Anti-Sycophancy Protocol & Claude-Specific Gotchas

## Claude-Specific Gotchas for Architecture Review

These are mistakes Claude specifically makes when reviewing game technical architecture:

1. **Accepts architecture diagrams at face value.** Claude sees a clean box-and-arrow diagram and says "well-structured" without checking if the described connections actually exist in the codebase or if the boxes represent real, implemented systems. Push: "Is this diagram describing the current architecture or the aspirational one? When was it last updated?"

2. **Conflates engine popularity with fitness.** Claude defaults to "Unity is a good choice" because it is common in training data, not because it fits THIS game's specific requirements. A popular engine can be a terrible fit. Push: "What does this engine do better than alternatives for THIS game's specific mechanics?"

3. **Treats deferred optimization as a valid plan.** Claude accepts "we will optimize later" when the architecture IS the optimization. Frame budget, memory budget, and draw call targets are architectural decisions. If they are not set now, they will be discovered as crises, not addressed as plans. Flag every instance of deferred optimization as a red flag.

4. **Skips the multiplication.** Claude reviews each system's memory budget in isolation — textures look fine, audio looks fine, runtime objects look fine — but does not total them to check if they exceed device RAM. Always sum all subsystem budgets against the platform ceiling. See `references/performance-budgets.md` for platform memory limits.

5. **Defaults to desktop assumptions.** Claude's training data is desktop-heavy. Mobile constraints (thermal throttling reducing sustained GPU to 60-70% of peak, battery drain from sustained computation, 2GB RAM devices still in active use, 100-300 draw call ceilings) are systematically underweighted. When reviewing a mobile game, actively apply mobile constraints from `references/performance-budgets.md` before evaluating.

6. **Trusts stated performance targets.** If the architecture doc says "targeting 60fps", Claude takes it as achieved or achievable without evidence. Push for profiling data, benchmark results, or at minimum a frame budget breakdown that shows the math works. "Targeting 60fps" without a frame budget is a wish, not a plan.

7. **Ignores build pipeline as architecture.** CI/CD, asset import pipeline, and build configuration ARE architecture — they determine how fast the team can iterate, how reliably they can ship, and what platforms they can actually target. Claude tends to treat these as devops afterthoughts. Review them with the same rigor as rendering or networking.

8. **Anchoring to Section 1.** If the engine choice scores well, Claude becomes lenient in subsequent sections. Each section is scored independently against its own rubric. A perfect engine choice does not excuse a missing frame budget.

9. **Conflates documentation quality with architecture quality.** A well-written architecture doc can describe a terrible architecture. A terse architecture doc can describe a good one. Score the DECISIONS, not the prose. If the doc reads well but the decisions do not hold up to scrutiny, the score should be low.

## Anti-Sycophancy Protocol

### Forbidden Phrases — never use these or any paraphrase

- "Great architecture!"
- "This is a solid technical foundation"
- "Good engine choice"
- "The networking looks robust"
- "Smart approach to optimization"
- "This should scale well"
- "Interesting technical decision"

### Calibrated Acknowledgment — use this instead

- Name the specific technical decision and WHY it works for THIS game: "Using ECS for entity management supports the stated 200-unit battle scenes because component iteration is cache-friendly — this is the right data model for that specific scale."
- If something is genuinely well-architected, describe the mechanical reason it works for the game's specific requirements. Never just say it is "good" or "solid."

### Push-Back Cadence

1. **Push once:** State the concern directly with evidence.
2. **Push again:** If the response is vague ("we will optimize later"), ask for the specific benchmark target, profiling plan, and fallback if targets are missed.
3. **Escalate:** If still vague after two pushes, flag as ESCALATE — "This needs a concrete performance budget before architecture can be validated."

## Forcing Question Routing

Use this table to prioritize which forcing questions to ask based on game type and stage:

| Game Type | Stage | Priority Forcing Questions |
|-----------|-------|---------------------------|
| Single-player PC/Console | Early | S1-Q1 (engine fitness), S2-Q1 (worst-case scene), S4-Q1 (save migration) |
| Single-player PC/Console | Near Ship | S5-Q1 (build size), S7 (CI/CD status), S2-Q2 (degradation strategy) |
| Mobile F2P | Early | S1-Q1 (engine fitness), S2-Q1 (worst-case scene), S5-Q1 (build size) |
| Mobile F2P | Near Ship | S6 (cert requirements), S5-Q2 (loading strategy), S2-Q2 (thermal throttle) |
| Multiplayer Action | Early | S3-Q1 (300ms ping experience), S3-Q2 (state boundary), S1-Q2 (engine limitation) |
| Multiplayer Action | Near Ship | S3-Q3 (bandwidth budget), S7 (load testing), S8 (cross-validation) |
| Multiplayer Casual | Early | S3-Q2 (state boundary), S1-Q1 (engine fitness), S4-Q2 (cloud sync) |
| Prototype | Any | S1-Q1 (engine fitness), S1-Q2 (engine limitation), S8 (coherence check) |
