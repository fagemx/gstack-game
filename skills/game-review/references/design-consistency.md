# Design Consistency Evaluator

Adapted from hakoniwa's multi-dimensional quality evaluators. Apply during Section 6 (Cross-Consistency) and whenever a finding references a design pillar.

## Three Consistency Dimensions

### 1. Design Voice Consistency

Does every system deliver what the design pillars promise?

**How to check:** Extract the game's stated design pillars (from Phase 0 context anchors). For each system reviewed in Sections 1-5, ask: "Does this system sound like it belongs in a game with these pillars?"

| Pillar Claim | Consistent | Inconsistent |
|-------------|-----------|--------------|
| "Fast-paced action" | 200ms input response, 0.5s kill time | 3s animation locks, 2s menu transitions |
| "Player agency" | 5+ viable builds, meaningful choices | Single optimal path, cosmetic-only choices |
| "Accessible to casual" | 3-tap core loop, visual-only tutorial | 47 stats to manage, text-heavy onboarding |
| "Dark fantasy atmosphere" | UI uses parchment/blood/ember motifs | Bright pastel shop UI, comic-sans fonts |
| "Competitive balance" | <5% win rate variance between top picks | One dominant strategy with 70%+ pick rate |

**Scoring:**
- **CONSISTENT (0 violations):** Every reviewed system reinforces the stated pillars
- **MINOR DRIFT (1-2):** Isolated systems don't match. Flag as ASK
- **MAJOR DRIFT (3+):** Pattern of mismatch. Flag as ESCALATE — either the pillars or the systems need revision

### 2. Boundary Behavior (Edge Case Consistency)

Does the design hold up under extreme conditions? Well-designed systems degrade gracefully. Poorly-designed systems break in ways that contradict the game's identity.

**Test these boundaries:**

| Boundary | What to Check |
|----------|--------------|
| **Zero state** | 0 gold, 0 items, 0 friends online. Does the UI still feel intentional? |
| **Overflow state** | 99,999 gold, max inventory, 200 notifications. Does the UI handle it? |
| **Mismatch state** | Level 99 player vs level 1 zone. Level 1 in endgame content. |
| **Failure cascade** | Network drops mid-boss fight. Save corrupts during write. Battery dies during purchase. |
| **Player defiance** | Player refuses tutorial. Player sells all equipment. Player ignores the main quest for 10 hours. |

**Key question:** "When this boundary is hit, does the game respond in a way that matches its design pillars?" A 'punishing but fair' game should fail transparently. A 'cozy' game should fail gently with recovery.

### 3. Environmental Storytelling Density

Does the game world communicate through design, not just text?

**Check for:**
- **Visual hierarchy in world design** — Can you tell which areas are important by looking at them? (lighting, color, detail density)
- **Audio as information** — Does music change to signal state? Do sound effects confirm actions? Is silence used intentionally?
- **Animation as character** — Do idle animations reveal personality? Do movement animations match the game's feel promise?
- **UI as world-building** — Does the HUD/menu aesthetic extend the game's identity, or is it a generic overlay?

**Scoring:**
- **Rich (4 channels active):** Visual + audio + animation + UI all tell the same story
- **Adequate (2-3 channels):** Some channels communicate, others are generic or missing
- **Sparse (0-1 channels):** Game relies on text/dialogue to communicate everything. World is decoration, not communication

## How to Report

In Section 6 (Cross-Consistency), add a Design Consistency block:

```
Design Consistency:
  Voice:        [CONSISTENT / MINOR DRIFT / MAJOR DRIFT] — [N] violations found
  Boundaries:   [N/5] boundaries tested, [N] broke design identity
  Storytelling:  [Rich / Adequate / Sparse] — [N/4] channels active

  Worst violation: [specific system] contradicts [specific pillar] because [evidence]
```

If MAJOR DRIFT is detected, this should be the #1 finding in the Completion Summary — a game that doesn't deliver its own promises will fail regardless of individual system quality.
