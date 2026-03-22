# Section 6: Cross-Section Consistency Check (跨段交叉驗證)

This section does NOT introduce new evaluation criteria. It cross-validates findings across Sections 1-5 to find contradictions invisible within any single section.

## Cross-Validation Matrix

| Intersection | What to Check | Red Flag Example |
|---|---|---|
| **Core Loop × Economy** | Does the loop generate currency at the rate the economy expects? | Loop takes 30s but economy assumes 5-min earning cycles |
| **Core Loop × Motivation** | Does the loop serve the stated target player types? | Targets Explorers but loop is linear with no discovery |
| **Progression × Economy** | Do progression gates align with spending opportunities? | Progression requires items only available via IAP at level 5, before D1 retention hook |
| **Progression × Motivation** | Do progression rewards match player type needs? | Achiever-targeted game but progression rewards are cosmetic-only (no measurable milestones) |
| **Economy × Retention** | Do monetization touchpoints align with retention hooks? | Paywall hits at the exact churn point instead of at a delight peak |
| **Motivation × Risk** | Do identified player types have risks addressed? | Targets Socializers but no plan for toxic behavior |
| **Risk × Core Loop** | Do core loop risks have system-level mitigations? | Core loop depends on real-time multiplayer but no offline fallback for connection issues |
| **Pillars × Everything** | Does every section's design trace back to at least one pillar? | Section 3 economy design serves no stated pillar |

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Internal Consistency** | 0-4 | Start at 4. Deduct 1 for each cross-section contradiction found (max -4) |
| **Pillar Traceability** | 0-3 | 3 = every major design decision traces to a pillar. 2 = most do. 1 = some decisions seem arbitrary. 0 = no pillar connection visible |
| **System Coherence** | 0-3 | 3 = all systems reinforce each other (positive coherence). 2 = systems are independent but not contradictory. 1 = some systems work against each other. 0 = systems actively undermine each other |

**Section 6 Score: ___/10**

## Action Classification

- **AUTO:** Terminology inconsistencies across sections (e.g., "gold" in Section 1, "coins" in Section 3 for the same currency)
- **ASK:** Cross-section design tensions that require a design decision to resolve
- **ESCALATE:** Fundamental contradictions between core loop and economy, or between stated pillars and actual design

**STOP.** One issue per AskUserQuestion.
