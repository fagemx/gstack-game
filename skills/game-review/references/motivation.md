# Section 4: Player Motivation & Emotion (玩家動機)

## Full SDT Analysis

For EACH major game system, evaluate whether it serves Autonomy, Competence, or Relatedness:

| System | Autonomy (meaningful choice) | Competence (skill growth) | Relatedness (connection) |
|--------|------------------------------|---------------------------|--------------------------|
| Core loop | Does the player choose HOW to engage? | Does skill improve outcomes? | Is there shared experience? |
| Progression | Multiple viable paths? | Clear mastery markers? | Social comparison/cooperation? |
| Economy | Spending choices matter? | Earning efficiency improves with skill? | Trading/gifting possible? |
| Social | Player-driven interactions? | Skill-based social status? | Meaningful bonds formed? |

**A system that serves ZERO SDT needs is a system that doesn't motivate.** Flag any such system as ASK.

## Player Type Coverage (Bartle + Quantic Foundry)

### Bartle Taxonomy

| Type | What They Want | What the GDD Offers (fill in) |
|------|---------------|-------------------------------|
| **Achiever** | Goals, completion, progression, visible milestones | ___ |
| **Explorer** | Discovery, hidden content, systemic depth, knowledge | ___ |
| **Socializer** | Cooperation, shared experience, community, identity | ___ |
| **Competitor** | Fair PvP, rankings, skill expression, meaningful stakes | ___ |

### Quantic Foundry Motivations (more granular)

Check which of these 6 clusters the GDD serves:
- **Action** (destruction, excitement) — Does the game deliver visceral thrills?
- **Social** (competition, community) — Does the game create social bonds or rivalries?
- **Mastery** (challenge, strategy) — Does the game reward thinking and skill?
- **Achievement** (completion, power) — Does the game satisfy collectors and completionists?
- **Immersion** (fantasy, story) — Does the game transport the player somewhere?
- **Creativity** (design, discovery) — Does the game let players express themselves?

**The GDD doesn't need to serve ALL types, but it MUST know which types it's targeting and which it's explicitly NOT serving.**

## Ludonarrative Consonance Check

Do the mechanics reinforce the narrative, or contradict it?

| Test | Pass | Fail |
|------|------|------|
| Theme ↔ Mechanics | Story says "choices matter" AND mechanics have meaningful branching | Story says "choices matter" BUT all paths lead to same outcome |
| Tone ↔ Feel | Dark narrative AND weighty, consequential mechanics | Dark narrative BUT bouncy, forgiving mechanics (unless intentional contrast) |
| Character ↔ Abilities | Player character is described as weak/vulnerable AND gameplay reflects this | Character described as weak BUT player is a one-hit-kill powerhouse |
| World ↔ Systems | World has scarce resources AND economy reflects scarcity | World described as post-apocalyptic BUT shops are fully stocked |

**Intentional dissonance is valid IF the GDD acknowledges and justifies it.** Unintentional dissonance is a design flaw.

## Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **SDT Coverage** | 0-3 | Each SDT need (Autonomy, Competence, Relatedness) served by at least one core system = 1 point each. 0 for any unserved need |
| **Player Type Targeting** | 0-3 | Target player types explicitly identified = 1 point. Systems designed for those types = 1 point. Non-target types acknowledged = 1 point |
| **Ludonarrative Consonance** | 0-2 | 2 = mechanics and narrative reinforce each other (or intentional dissonance is justified). 1 = minor contradictions. 0 = major unacknowledged dissonance |
| **Emotional Arc** | 0-2 | 2 = session emotional arc explicitly mapped (tension/release/climax/resolution). 1 = general mood described but no arc. 0 = no emotional design consideration |

**Section 4 Score: ___/10**

## Forcing Questions

Ask via AskUserQuestion, **ONE AT A TIME**. Smart-route:

**If player motivation is undefined — ask Q1 (most accessible):**

**Q1:** "Which Bartle type does this game serve WORST, and what happens when that player type tries your game?"

Push until you hear: A named type AND a specific bad experience. "Explorers — there's no hidden content, they'd get bored after seeing all the levels" = good. "We serve all types" = red flag (push: "Every game serves some types better than others. Which type would give your game a 5/10 review?").

**STOP.** Wait for answer.

**If motivation is defined but emotional design is vague — ask Q2:**

**Q2:** "Name a specific moment where the player feels powerful. Now name one where they feel vulnerable. How many minutes apart are they?"

Push until you hear: Two concrete moments with a time gap. Games with no vulnerability have no tension. Games with no power have no satisfaction. If the moments are >20 min apart, the emotional pacing may be too slow.

**STOP.** Wait for answer.

**If GDD has narrative — ask Q3 (Mode D priority):**

**Q3:** "The game's story says {X}. Do the mechanics also say {X}? Give me one specific example."

Push until you hear: A concrete mechanic-narrative alignment. If the designer can't think of one, the mechanics and narrative are likely disconnected. That's not fatal, but it should be intentional.

**STOP after each.** Minimum 2 for Mode D (Narrative). Minimum 1 for other modes.

## Action Classification

- **AUTO:** Player type terminology inconsistencies, MDA aesthetic labels used incorrectly
- **ASK:** Which player types to target, emotional arc design, SDT trade-offs between systems
- **ESCALATE:** GDD has no concept of target player motivation — mechanics exist without any stated purpose for WHY a player would engage

**STOP.** One issue per AskUserQuestion.
