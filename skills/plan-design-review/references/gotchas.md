# Plan Design Review — Gotchas & Forcing Questions

## Claude-Specific Failure Modes

### Gotcha #1: Reviewing Implementation Instead of Plan
**Symptom:** Claude starts suggesting code changes, component implementations, or CSS.
**Rule:** This skill reviews and EDITS THE PLAN. No code. No implementation. If you're writing code, stop.

### Gotcha #2: Rubber-Stamping Vague Plans
**Symptom:** Rating a plan 7/10 when it says "clean UI with good UX" without any specifics.
**Rule:** Vague descriptions score 0-3 on that dimension. "Clean UI" is not a design decision. Name the font, the spacing scale, the interaction pattern.

### Gotcha #3: Inventing Design Decisions for the User
**Symptom:** Claude fills in missing design details and presents them as the plan's content.
**Rule:** If the plan doesn't specify it, rate that dimension low. Propose additions clearly marked as "PROPOSED ADDITION" — do not silently fill gaps.

### Gotcha #4: Skipping Passes Because "The Plan Doesn't Have UI"
**Symptom:** Claude skips passes because the plan focuses on gameplay mechanics.
**Rule:** If the plan has ANY player-facing feature, it has UI implications. A "crafting system" without UI specs means someone will ship a default grid. Flag the gap.

### Gotcha #5: Generic Design Recommendations
**Symptom:** Claude recommends "add loading indicators" or "use consistent colors" without connecting to THIS game's identity.
**Rule:** Every recommendation must reference the specific game, its pillars, and its audience. "Add a loading indicator" → "Add a loading indicator that matches the game's hand-drawn art style — animated sketch of the protagonist, not a spinner."

### Gotcha #6: Treating All Passes as Equal Priority
**Symptom:** Spending equal time on Design System (Pass 5) when Interaction States (Pass 2) has critical gaps.
**Rule:** Priority order under time pressure: Step 0 > Pass 2 (Interaction States) > Pass 4 (AI Slop) > Pass 1 (Info Architecture) > Pass 3 (Player Journey) > others. Never skip Step 0, Pass 2, or Pass 4.

## Forcing Questions (Use at Least 3 Per Review)

### Q1: The 1-Second Combat Test
"If the player only glances at the screen for 1 second during the most intense moment of gameplay, what do they see? Is that specified in the plan?"
**Why:** Exposes missing HUD hierarchy and information architecture gaps.

### Q2: The Legendary Drop on Full Inventory
"Player's inventory is full and they pick up a legendary item. What does the UI do? Is that in the plan?"
**Why:** Exposes missing interaction states for the most emotionally charged edge case.

### Q3: The First Death Emotion
"What does the player feel 3 seconds after their first death? What UI element supports that emotion? Is it specified?"
**Why:** Exposes missing emotional arc design at the most critical frustration point.

### Q4: The Genre Swap Test
"If I replaced every game-specific noun with generic terms, would this plan work for ANY game in the genre?"
**Why:** Exposes AI slop risk — plans that are too generic to produce a distinctive game.

### Q5: The Settings Screen
"What does the settings screen look like? How many options? What categories? Is audio separate from video?"
**Why:** Settings screens are the most commonly deferred UI — and the first thing players judge quality by.

### Q6: The Colorblind Test
"Turn the game to grayscale. Can the player still distinguish friend from enemy, health from mana, common from legendary?"
**Why:** Exposes color-only information design that excludes 8% of male players.

## Anti-Sycophancy Protocol

**FORBIDDEN — never say these or any paraphrase:**
- "Great design plan!"
- "This plan has strong foundations"
- "The design direction is promising"
- "Good use of design patterns"
- "Players will love this"
- "The UI sounds intuitive"
- "Solid design decisions"

**CALIBRATED ACKNOWLEDGMENT — say this instead:**
- "Pass 2 went from 3/10 to 8/10 after adding interaction states for 12 features. Two features still missing error states."
- "The plan specifies exact HUD priority for 4/6 screen elements. The remaining 2 default to P4 — verify that's intentional."
- "FTUE emotional arc covers first 3 minutes. Session loop and D7 retention hook are unspecified."

**PUSH-BACK CADENCE:**
1. Push once: State the design gap with the player impact.
2. Push again: "What happens when an engineer reaches this section of the plan? They'll either ask you or guess. Which is more expensive?"
3. Escalate: "This plan will produce generic UI at implementation because [specific dimension] is unspecified."
