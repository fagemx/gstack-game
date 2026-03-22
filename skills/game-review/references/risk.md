# Section 5: Risk Assessment (風險評估)

## Risk Matrix

For EACH identified risk, evaluate on two axes:

| | Minor (annoyance) | Significant (friction) | Critical (game-breaking) |
|---|---|---|---|
| **High probability** | MEDIUM | HIGH | CRITICAL |
| **Medium probability** | LOW | MEDIUM | HIGH |
| **Low probability** | IGNORE | LOW | MEDIUM |

## Standard Risk Categories

Evaluate the GDD against these risk categories. Each applies differently per review mode.

### 1. Design Pillar Violation Risk

Does any designed feature CONTRADICT a stated design pillar?
- Example: Pillar says "player agency in every encounter" but a cutscene removes control for 2 minutes
- Example: Pillar says "fair competition" but paid items have stat bonuses
- **If pillars are not defined, this entire category is ESCALATE**

### 2. Scope Risk — Lake vs Ocean Test

- **Lake:** Bounded scope, clear bottom, knowable size. "10 levels with 3 enemy types each."
- **Ocean:** Unbounded scope, unknown depth, grows as you explore. "Procedurally generated infinite world with emergent narratives."
- Most failed indie games are Oceans that thought they were Lakes.
- **Forcing Q:** "Can you list every piece of content this game needs to be shippable? If the list has 'etc.' or '...' anywhere, it's an Ocean."

### 3. Technical Feasibility Risk

Does any mechanic require technology the team hasn't proven?
- Netcode for real-time multiplayer
- Procedural generation at scale
- AI-driven narrative
- Cross-platform save sync

### 4. Market Differentiation Risk

Can you describe this game without using the name of another game?
- "It's like X but Y" is a starting point, not a destination
- What is the ONE thing a player would describe to a friend?

### 5. Retention Cliff Risk

Where is the most likely point where players quit and never return?
- End of tutorial (didn't hook)
- First paywall (felt unfair)
- Content drought (ran out of things to do)
- Difficulty wall (couldn't progress)

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Risk Identification** | 0-3 | 3 = risks identified across all 5 categories with probability/impact ratings. 2 = most categories covered. 1 = only obvious risks listed. 0 = no risk analysis |
| **Mitigation Specificity** | 0-3 | 3 = every high+ risk has a specific mitigation plan with timeline. 2 = mitigations exist but are vague ("we'll playtest"). 1 = mitigations for some risks only. 0 = no mitigations |
| **Pillar Coherence** | 0-2 | 2 = no feature contradicts stated pillars, OR contradictions are acknowledged with justification. 1 = minor pillar tensions unaddressed. 0 = major pillar violations OR no pillars to check against |
| **Scope Realism** | 0-2 | 2 = scope is Lake-sized with concrete content list. 1 = scope is ambitious but bounded. 0 = scope is Ocean-sized with no cut plan |

**Section 5 Score: ___/10**

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route:

**Always ask Q1 (scope is the #1 indie game killer):**

**Q1:** "List every piece of content needed to ship. If your list contains '...' or 'etc.' or 'and more,' it's an Ocean, not a Lake."

Push until you hear: A finite list. "5 levels, 3 boss types, 12 enemy variants, 1 hub area" = Lake. "Procedurally generated with endless variations..." = Ocean (push: "What is the MINIMUM content set for a shippable version?").

**STOP.** Wait for answer.

**If scope seems large — ask Q2:**

**Q2:** "What is the ONE feature you would cut if you had to ship 3 months early? What breaks without it?"

Push until you hear: A named feature AND an honest impact assessment. "The crafting system — combat still works without it, but long-term engagement drops" = good. "Nothing can be cut" = red flag (every game has a cut list; if you can't name one, you haven't prioritized).

**STOP.** Wait for answer.

**If design pillars exist — ask Q3:**

**Q3:** "Name one mechanic that contradicts a design pillar. If you can't find one, you haven't looked hard enough."

Push until you hear: An honest contradiction. Every real GDD has at least one tension between ideals and implementation. If the designer finds none, either the pillars are too vague or the self-assessment isn't honest.

**STOP after each.** Minimum 2. Q1 is always asked.

## Action Classification

- **AUTO:** Risk probability/impact labels missing, mitigation plans that say "TBD" (flag for completion)
- **ASK:** Risk mitigation strategies, scope reduction decisions, pillar violation trade-offs
- **ESCALATE:** Ocean-sized scope with no cut plan AND no stated MVP, OR critical risks with zero mitigation

**STOP.** One issue per AskUserQuestion.
