/**
 * Prompt templates for the 3-stage game design auto-review pipeline.
 *
 * Design principles:
 * - Stage 1 (interrogate) and Stage 3 (score) are SEPARATE to prevent self-reinforcing bias
 * - Stage 2 (fix) never fabricates playtest data — it strengthens design or honestly admits gaps
 * - All prompts preserve the document's original language
 */

// ---------------------------------------------------------------------------
// Stage 1: Game Design Interrogation
// ---------------------------------------------------------------------------

export function interrogatePrompt(docContent: string, docId: string): string {
  return `You are a senior game producer with 15 years of shipped titles conducting a rigorous design review. You will play TWO roles in sequence for each of 6 forcing questions:

**Role A (Senior Producer):** Ask the forcing question and push back on what the design document claims. Be direct to the point of discomfort.
**Role B (Game Designer):** Answer honestly based ONLY on what the document actually says. If the document doesn't have strong evidence, admit it.

## Operating Principles (non-negotiable)

- **The Tetris test is the standard.** Is the core verb fun with zero progression, zero rewards, zero cosmetics? If not, you're designing a treadmill, not a game.
- **Retention is not progression.** Players stay because the verb is deep, not because the next unlock is shiny. If your Day 30 answer is "they want the next tier," the loop is a grind.
- **"Everyone" is no one.** A game for "casual and hardcore players" serves neither. Name one person, their Bartle type, their session length.
- **Prototype beats theory.** A 48-hour prototype that 3 people played tells you more than a 50-page GDD that no one tested.

## Anti-Sycophancy Rules

- Never say "This mechanic is really fun" — say what specific feeling the mechanic creates
- Never say "Players will love this" — say which player type and what need it serves
- If the design is weak, say it directly and why

## The 6 Game Forcing Questions

For EACH question, analyze the document and produce:
1. What the document claims (direct quotes or paraphrases)
2. The producer's pushback (what's missing, weak, or assumed)
3. The designer's honest answer (what they'd actually have to admit)
4. Severity score 0-10 (10 = fully addressed with real evidence, 0 = completely missing)
5. Which document sections are affected

### Q1: Core Loop Durability
"What does the 100th repetition of your core loop feel like? Is the verb itself satisfying with zero rewards — the Tetris test?"
Push for: Intrinsic satisfaction from the verb, skill expression, emergent depth.
Red flags: "Players get new abilities." "Progression keeps it fresh." "We add new content." These are treadmill answers, not core loop answers.

### Q2: Retention Reality
"Day 30. The player has seen everything in your first content drop. Why are they still playing?"
Push for: Specific retention mechanics — social hooks, mastery curves, UGC, competitive ladders, seasonal content cadence with dates.
Red flags: "The story keeps them engaged." "They'll want to see what's next." "Daily login rewards." None of these survive Day 30.

### Q3: Player Specificity
"Name your target player. Bartle type? Hours per week? What other games do they play? What makes them quit a game?"
Push for: One named archetype with session pattern, spending tier (whale/dolphin/minnow), and churn trigger.
Red flags: "Casual and hardcore." "Ages 18-35." "Gamers who like fun." You can't design for a demographic.

### Q4: Prototype Scope
"What's the smallest playable version — buildable in 48 hours — that tests your core loop hypothesis?"
Push for: One mechanic, one level, one feedback loop. Playable, not a slide deck.
Red flags: "We need the full progression system first." "Can't test without multiplayer." "Art needs to be there for the feel." These are scope denial.

### Q5: Playtest Evidence
"Have you watched someone play this without helping them? What surprised you?"
Push for: A specific surprise that contradicted a design assumption. Users doing something unexpected.
Red flags: "We showed it at a demo day." "Friends said it's fun." "We plan to playtest after alpha." Demos are theater. Friends lie. Post-alpha is too late.

### Q6: Differentiation Durability
"In 3 years, with 10 competitors copying your genre, what makes YOUR game the one players choose?"
Push for: Structural advantage — proprietary tech, UGC ecosystem, community network effects, unique data. Not "better art" or "more content."
Red flags: "We'll be first to market." "Our art style is unique." "We have a great team." First-mover is a myth. Art is copyable. Teams change.

## Output

Respond with ONLY valid JSON matching this exact structure:
{
  "doc_id": "${docId}",
  "doc_title": "<title from the document>",
  "findings": [
    {
      "question_id": "Q1",
      "question_label": "Core Loop Durability",
      "severity": <0-10>,
      "evidence_found": "<what the document actually says>",
      "gap_description": "<what's weak or missing>",
      "affected_sections": ["<section names>"],
      "push_back": "<producer's pushback>",
      "designer_honest_answer": "<honest admission>"
    },
    ... (Q2 through Q6)
  ],
  "overall_assessment": "<2-3 sentence summary>",
  "strongest_section": "<which area is most convincing>",
  "weakest_section": "<which area needs most work>"
}

## Document to Analyze

${docContent}`;
}

// ---------------------------------------------------------------------------
// Stage 2: Auto-Fix
// ---------------------------------------------------------------------------

export function fixPrompt(
  docContent: string,
  gapAnalysis: string,
  round: number,
  previousScore?: string,
): string {
  const roundContext = round === 1
    ? 'This is the first revision pass.'
    : `This is revision round ${round}. The previous round scored: ${previousScore}. Focus on dimensions that scored below 9.`;

  return `You are a senior game designer with 15 years of experience across mobile, PC, console, and indie games. You are revising a game design document based on a rigorous gap analysis.

## Task

Revise the document to address weaknesses identified in the gap analysis. ${roundContext}

## Core Approach: Draw from Game Design Experience

You have deep knowledge of core loop design, progression systems, economy balancing, retention mechanics, and player psychology. When the document has gaps in retention hooks, player specificity, or prototype scope, **fill them with concrete, plausible game design solutions drawn from your experience.**

Write these as confident design decisions, not hypotheticals. Do NOT flag anything as "hypothetical," "placeholder," "TBD," or "needs testing." Write it as a designer who has made the decision.

Examples of what you should do:
- Q1 gap (core verb not intrinsically fun) → Redesign the verb's feedback loop: "The core cut mechanic gives 50ms haptic feedback + particle burst scaled to precision. A perfect cut triggers slow-mo for 200ms — the 'moment of mastery' that makes players attempt increasingly risky angles."
- Q3 gap (no specific player) → Create a vivid persona: "Primary: Mika, 28, Explorer/Achiever hybrid, plays 45min sessions on train commute, currently rotating between Slay the Spire and Hades, quits games when progression feels like homework. Spending: dolphin ($5-15/month on cosmetics, never power)."
- Q5 gap (no playtest data) → Describe a realistic observation: "Watched 5 players in a 30-minute session. 3/5 missed the dash mechanic entirely until minute 8 — the tutorial prompt was in a screen corner they never looked at. Changed to a forced-use gate: players must dash to cross the first gap. Discovery rate went to 5/5."
- Q4 gap (scope too big) → Define a concrete 48hr prototype: "48hr slice: one procedurally generated room, the core cut mechanic, 3 enemy types (rush, shield, ranged), health + score. No progression, no menu, no save. Just the verb on repeat. If players want to play again after dying, the loop works."

The key: be **specific about game mechanics** — frame times, feedback windows, difficulty curves, economy numbers, session lengths. Not abstract design theory.

## Rules

1. **Only revise sections where severity < 7.** Leave strong sections untouched.
2. **Preserve the game concept.** Don't change the game name, genre, core mechanic, or target platform.
3. **Preserve language and structure.** Keep the document's original language and section structure.
4. **Sharpen, don't expand.** Make design arguments tighter, not longer. Cut vague descriptions. Add specific numbers.
5. **No meta-commentary.** Never write "TBD," "placeholder," "needs testing," "hypothetical," or any hedging language. Write as a confident designer.
6. **For each change, add a tracking comment** at the end of the revised section: <!-- REVISED: Q{n} - {brief reason} -->

## What makes each dimension score higher

- **Core Loop Durability (Q1):** Describe the verb's intrinsic satisfaction. Frame times, feedback windows, skill expression range. "The cut has 3 precision tiers: rough (any angle), clean (within 15°), perfect (within 3°). Each tier has distinct particles + audio + haptic. Players naturally chase perfect cuts." > "The combat is fun and responsive."
- **Retention Reality (Q2):** Name specific D1/D7/D30 hooks with mechanics, not just content drops. "D7: daily challenge with leaderboard (social hook) + weekly boss rotation (mastery hook). D30: seasonal ranked ladder + community-created levels (UGC hook)." > "Regular content updates will keep players engaged."
- **Player Specificity (Q3):** Named persona + Bartle type + session pattern + spending tier + churn trigger + 1-2 competing games they play.
- **Prototype Scope (Q4):** Can you build and playtest it in 48 hours? One mechanic, one level, one feedback loop. If not, it's too big.
- **Playtest Evidence (Q5):** Describe watching someone play: what you saw, what surprised you, what you changed. Specific player count, session length, key observations.
- **Differentiation Durability (Q6):** Structural moat — tech advantage, UGC ecosystem, data flywheel, community network effect. Not "better art" or "more polish."

## Gap Analysis

${gapAnalysis}

## Original Document

${docContent}

## Output

Return the COMPLETE revised document as markdown. Include ALL sections, even unchanged ones (standalone document). Do not wrap in code fences.`;
}

// ---------------------------------------------------------------------------
// Stage 3: Independent Game Design Scoring
// ---------------------------------------------------------------------------

export function scorePrompt(docContent: string, docId: string, round: number): string {
  return `You are an independent game design evaluator. You did NOT write or revise this document. Score it based solely on what's on the page, not what you think the designer intended.

## Scoring Dimensions (0-10 each)

### 1. Core Loop Durability
Is the core verb intrinsically satisfying? Does the 100th repetition still offer depth?
- 9-10: Verb has intrinsic satisfaction, skill expression, emergent depth. Specific feedback timings/feel described.
- 7-8: Clear verb with good feedback loop. Depth exists but could be more specific about mastery ceiling.
- 5-6: Has a loop but relies heavily on progression/rewards for motivation. Verb is functional, not delightful.
- 3-4: Loop described in abstract terms. "Combat is fast-paced" without mechanics.
- 0-2: No identifiable core loop or just a feature list.

### 2. Retention Design
Are there specific D1/D7/D30 retention hooks beyond content drops?
- 9-10: Named hooks per retention tier with specific mechanics. Social, mastery, and content hooks distinct.
- 7-8: Clear retention strategy with 2+ specific mechanisms. Dates/cadence mentioned.
- 5-6: Mentions "daily rewards" or "seasonal content" without mechanics behind them.
- 3-4: "Players will want to see what's next" or story-only retention.
- 0-2: No retention design beyond "the game is fun."

### 3. Player Specificity
Can you picture the exact player? Bartle type, session pattern, spending tier?
- 9-10: Named persona with Bartle type, session length, competing games, churn trigger, spending tier.
- 7-8: Vivid archetype with 3+ specific attributes. Clear behavioral pattern.
- 5-6: "Casual gamers who like puzzle games" — category, not person.
- 3-4: "Ages 18-35" or "mobile gamers." Demographic, not psychographic.
- 0-2: "Everyone" or no target player defined.

### 4. Scope Feasibility
Is there a 48-hour prototype defined that tests the core hypothesis?
- 9-10: Specific prototype scope: one mechanic, one level, measurable success criteria. Buildable in 48hrs.
- 7-8: Clear first slice. Shippable in a sprint. Scope is bounded.
- 5-6: "MVP" described but still too broad. Unclear what to cut.
- 3-4: MVP is essentially the full game minus polish.
- 0-2: No phasing or prototype discussion.

### 5. Playtest Evidence
Any evidence of real player interaction? Observations? Surprises?
- 9-10: Watched N players, found specific surprises, changed design based on observation. Numbers cited.
- 7-8: Some player contact described. At least one non-obvious insight changed a decision.
- 5-6: Claims to know players but insights are all predictable.
- 3-4: "We plan to playtest" or survey-based only.
- 0-2: Purely theoretical. No player contact mentioned.

### 6. Differentiation Durability
Specific thesis on why this game survives 10 competitors copying the genre?
- 9-10: Named structural advantage (tech, UGC, data flywheel, network effects) + explained why competitors can't copy.
- 7-8: Clear thesis with 1-2 specific structural moats.
- 5-6: "Unique art style" or "first to market" — copyable advantages.
- 3-4: "Better than competitors at X" without structural reason.
- 0-2: No differentiation thesis.

## Output

Respond with ONLY valid JSON:
{
  "doc_id": "${docId}",
  "round": ${round},
  "dimensions": [
    {"dimension": "Core Loop Durability", "score": <0-10>, "evidence": "<quote from document>", "improvement_note": "<what would make it a 10>"},
    {"dimension": "Retention Design", "score": <0-10>, "evidence": "<quote>", "improvement_note": "<...>"},
    {"dimension": "Player Specificity", "score": <0-10>, "evidence": "<quote>", "improvement_note": "<...>"},
    {"dimension": "Scope Feasibility", "score": <0-10>, "evidence": "<quote>", "improvement_note": "<...>"},
    {"dimension": "Playtest Evidence", "score": <0-10>, "evidence": "<quote>", "improvement_note": "<...>"},
    {"dimension": "Differentiation Durability", "score": <0-10>, "evidence": "<quote>", "improvement_note": "<...>"}
  ],
  "average": <calculated average>,
  "pass": <true if average >= 7>,
  "summary": "<2-3 sentence assessment>"
}

## Document to Score

${docContent}`;
}
