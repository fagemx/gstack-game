# game-ux-review — Scoring Rubrics

3. **Where do I start?** — Is the primary action (Play/Start) obvious?

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Visual Hierarchy** | 0-3 | 3 = most important info is most visually prominent, clear reading order. 2 = mostly clear but some confusion. 1 = important info buried. 0 = no hierarchy — everything fights for attention |
| **Clarity** | 0-3 | 3 = purpose of every visible element is immediately obvious. 2 = most elements clear, 1-2 ambiguous. 1 = multiple confusing elements. 0 = player would need instructions to understand the UI |
| **Identity** | 0-2 | 2 = UI has a distinctive visual identity that matches the game's tone. 1 = generic but functional. 0 = placeholder or inconsistent style |
| **Information Density** | 0-2 | 2 = right amount of info for genre and audience. 1 = slightly too dense or too sparse. 0 = overwhelming OR so minimal that critical info is missing |

**Section 1 Score: ___/10**

### Action Classification

- **AUTO:** Missing game title on main menu, no "Play" button visible, critical info not on HUD
- **ASK:** Visual hierarchy restructuring, identity/style choices
- **ESCALATE:** Player cannot determine game state or next action from HUD — UI fails its primary purpose

**STOP.** Present ONE issue at a time via AskUserQuestion. Proceed only after all Section 1 issues are resolved or deferred.

---

## Section 2: HUD Review (HUD 審查) — Weight: varies by mode

### Information Hierarchy During Gameplay

--
**The GDD's stated priorities must match HUD element visual weight.** If the game is about survival but the health bar is tiny and in the corner while a decorative frame takes center screen — that's a UX failure.

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Priority Mapping** | 0-3 | 3 = HUD element size/position matches information priority. 2 = mostly correct, 1-2 mismatches. 1 = several mismatches. 0 = no apparent priority system |
| **Glanceability** | 0-3 | 3 = player can read all P0-P1 info in <0.5s without moving eyes from gameplay area. 2 = readable but requires eye travel. 1 = requires focus shift from gameplay. 0 = must stop playing to read HUD |
| **Clutter Control** | 0-2 | 2 = HUD shows only what's needed for current context (contextual show/hide). 1 = always shows everything. 0 = information overload, HUD covers gameplay |
| **Readability** | 0-2 | 2 = text/icons readable at target viewing distance, sufficient contrast against all backgrounds. 1 = readable in most situations but fails against some backgrounds. 0 = text too small or insufficient contrast |

**Section 2 Score: ___/10**

### HUD Red Flags

- Health bar smaller than cosmetic UI frames
- Critical info requires reading text during real-time gameplay (numbers instead of bars/icons)
- No contrast/shadow behind HUD elements — unreadable on bright backgrounds
- HUD covers >20% of screen on mobile
- No option to hide/minimize HUD elements

### Forcing Questions (must ask at least 2)

1. "Cover the HUD with your hand. Can you still tell what's happening in the game?" — If yes, the HUD may be unnecessary. If the game is unplayable, the HUD is carrying too much.
2. "What is the LAST thing a player looks at before they die?" — That information should be the most prominent HUD element.

### Action Classification
--
| 4+ taps | Acceptable only for rarely-used functions | Anything used per-session |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Navigation Depth** | 0-3 | 3 = all per-session functions within 3 taps. 2 = most within 3, one at 4. 1 = multiple functions at 4+. 0 = critical functions buried deep |
| **Back Button Consistency** | 0-2 | 2 = back/cancel always in same position, always works, never loses data. 1 = mostly consistent but some screens differ. 0 = inconsistent or missing back navigation |
| **Loading Indicators** | 0-2 | 2 = every async operation has a loading indicator, no frozen screens. 1 = major operations have indicators, minor ones don't. 0 = user left staring at frozen screen during loads |
| **State Preservation** | 0-2 | 2 = navigating away and back preserves form state, scroll position, selections. 1 = mostly preserved but some lost. 0 = state lost on navigation |
| **Error States** | 0-1 | 1 = errors shown clearly with recovery action (retry/cancel). 0 = silent failures or cryptic error codes |

**Section 3 Score: ___/10**

### Menu Red Flags

- Main menu has more than 7 items (cognitive overload)
- Different screens use different back button positions
- No confirmation before destructive actions (delete save, spend premium currency)
- Settings changes require restart with no warning
- Dead-end screens with no navigation out

### Forcing Questions (must ask at least 1)

1. "How many taps from main menu to start playing? Is each tap adding value or just friction?" — Every tap between "I want to play" and "I am playing" is a potential quit point.

### Action Classification

--
**Skip if game has no monetization.** Score as N/A and redistribute weight.

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Price Clarity** | 0-3 | 3 = all prices visible before purchase, real money cost clear, no hidden costs. 2 = mostly clear but some ambiguity. 1 = prices partially hidden or only visible at checkout. 0 = player doesn't know what they're paying until after commitment |
| **Currency Display** | 0-2 | 2 = premium/free currency clearly distinguished, balance always visible in shop. 1 = distinguishable but requires attention. 0 = confusing or deliberately obscured |
| **Purchase Confirmation** | 0-2 | 2 = confirmation step for all purchases showing exactly what is bought and for how much. 1 = confirmation for real money but not premium currency. 0 = one-tap purchase with no confirmation (accidental purchase risk) |
| **Pressure Tactics** | 0-2 | 2 = no artificial urgency (no fake timers, no "limited!" on permanent items, no "X people are buying this now"). 1 = mild urgency (real limited-time events). 0 = aggressive pressure tactics. **Scoring note:** legitimate seasonal events with real end dates = 2. Fake scarcity on permanent items = 0 |
| **Refund / Undo Path** | 0-1 | 1 = accidental purchases can be undone or refunded within a reasonable window. 0 = no recourse for accidental purchases |

**Section 4 Score: ___/10**

### Shop Red Flags

- Premium currency priced in odd amounts that never divide evenly into item costs (forcing leftover balance)
- Shop appears before player has had their "aha moment" (monetizing before delight)
- Items priced so high in free currency that IAP is the only practical path
- "Best Value!" label on most expensive package without justification
- No way to preview items before purchase
- Children can make purchases without parental gate

### Forcing Questions (must ask at least 1)

1. "A player accidentally buys the wrong item with premium currency. What is their recovery path?" — If the answer is "nothing, purchases are final," this will generate support tickets and negative reviews.
2. "How many sessions does a free player need to earn what a paying player gets instantly? Is that ratio intentional and documented?" — Tests whether the free experience is genuinely viable.

--
## Section 5: Tutorial / Onboarding UI (新手引導) — Weight: varies by mode

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Tooltip Design** | 0-2 | 2 = tooltips are contextual, non-blocking, dismissible, and use visual language over text. 1 = functional but text-heavy or poorly timed. 0 = tooltips cover gameplay, are undismissible, or are walls of text |
| **Forced vs Optional** | 0-2 | 2 = tutorial teaches through play (learn by doing), skippable for experienced players. 1 = some forced reading but mostly interactive. 0 = unskippable text/video tutorial that teaches by telling instead of showing |
| **Progressive Disclosure** | 0-3 | 3 = new mechanics introduced one at a time, each mastered before next introduced. 2 = mostly gradual but some information dumps. 1 = too many concepts at once early on. 0 = all mechanics dumped in first 5 minutes |
| **Visual Language** | 0-2 | 2 = icons, colors, and animations communicate meaning without text (e.g., glowing object = interact, red flash = damage). 1 = some visual language but relies heavily on text. 0 = text-only instruction |
| **Recovery from Mistakes** | 0-1 | 1 = if player does the "wrong" thing in tutorial, UI guides them back without punishment. 0 = tutorial breaks or gets stuck on incorrect input |

**Section 5 Score: ___/10**

### Tutorial Red Flags

- Tutorial is a separate mode disconnected from real gameplay
- More than 3 lines of text in a single tooltip
- No way to skip tutorial on replay
- Tutorial teaches mechanics the player won't use for 30+ minutes
- Tutorial doesn't cover the core loop — teaches movement but not the actual game
- "Press A to continue" for 15+ screens

### Forcing Questions (must ask at least 1)

1. "A player ignores the tutorial completely. Can they figure out how to play from the UI alone?" — Good UI is its own tutorial. If the game requires a tutorial to be playable, the UI may be failing.

### Action Classification
--
| Right-click context | Where appropriate, right-click provides context menus |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Primary Input Coverage** | 0-4 | 4 = primary input method fully supported, every interaction works. 3 = works but minor gaps. 2 = significant gaps in primary input. 1 = barely functional. 0 = primary input method broken |
| **Secondary Input Coverage** | 0-2 | 2 = secondary input methods work (if applicable). 1 = partially supported. 0 = claimed multi-input but only one works. N/A if single-input game |
| **Input Switching** | 0-2 | 2 = hot-swap between input methods works seamlessly, prompts update. 1 = switching works but prompts lag or don't update. 0 = switching causes bugs. N/A if single-input |
| **Platform Conventions** | 0-2 | 2 = follows platform UX conventions (B/Circle = back on controller, swipe-to-go-back on iOS). 1 = mostly follows. 0 = violates common platform conventions |

**Section 6 Score: ___/10**

### Action Classification

- **AUTO:** Wrong button prompts, touch targets below 44px
- **ASK:** Input method priority, custom gesture design, controller layout
- **ESCALATE:** Primary input method non-functional for core gameplay

**STOP.** One issue per AskUserQuestion.

---

## Section 7: Accessibility (無障礙) — Weight: varies by mode

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Color Independence** | 0-2 | 2 = no information conveyed by color alone (always paired with shape, text, or pattern). Colorblind mode available. 1 = mostly accessible but some color-only information. 0 = critical information is color-only (red/green for friend/enemy with no shape difference) |
| **Text Readability** | 0-2 | 2 = font size options, minimum 16px on mobile / 24px at 10-foot, sufficient contrast (WCAG AA 4.5:1). 1 = readable at default but no size options. 0 = text too small or low contrast |
| **Subtitle / Caption Support** | 0-2 | 2 = subtitles with speaker identification, size options, background for readability. 1 = basic subtitles. 0 = no subtitles for voice/important audio. N/A if no dialogue |
| **Control Remapping** | 0-2 | 2 = full control remapping, one-handed alternatives, hold-vs-toggle options. 1 = partial remapping. 0 = no remapping |
| **Difficulty / Assist Options** | 0-2 | 2 = accessibility assists (auto-aim, game speed, invincibility mode, skip combat). 1 = some assists. 0 = no accessibility options. **Note:** not every game needs all assists — evaluate relative to genre expectations |

**Section 7 Score: ___/10**

### Accessibility Red Flags

- Red/green used as sole differentiator (8% of males are red-green colorblind)
- Flashing effects with no photosensitivity warning or disable option
- Required rapid button mashing with no alternative
- Small text on large screens (console) or large screens viewed from distance
- Audio-only cues for critical gameplay information (deaf players excluded)
- Timed events with no pause or time extension option

### Forcing Questions (must ask at least 1)

1. "Turn the game to grayscale. Can you still play?" — If color-only information becomes invisible in grayscale, colorblind players are excluded.

### Action Classification
--
| **Spacing** | Consistent margins, padding, grid across screens | Some screens use 16px margins, others use 24px |

### Evaluation Criteria

| Criterion | Points | Deduction Rules |
|-----------|--------|-----------------|
| **Visual Language Consistency** | 0-4 | Start at 4. Deduct 1 for each inconsistency category found (max -4) |
| **Interaction Pattern Consistency** | 0-3 | 3 = same gesture/action does same thing everywhere. 2 = mostly consistent. 1 = some confusing inconsistencies. 0 = player must re-learn interaction per screen |
| **Design System Evidence** | 0-3 | 3 = clear design system (components reused, tokens consistent). 2 = partial system. 1 = ad-hoc per screen. 0 = every screen looks like a different designer made it |

**Section 8 Score: ___/10**

### Action Classification

- **AUTO:** Measurable inconsistencies (spacing, color values, font sizes)
- **ASK:** Design system adoption, style unification approach
- **ESCALATE:** UI so inconsistent that players cannot transfer learning between screens

**STOP.** One issue per AskUserQuestion.

---

## Required Outputs

### UX Health Score

--
  Section 8 — Cross-Screen Consistency: _/10  (weight: __%)  → weighted: _.___
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:                       _._/10

  * If Section 4 is N/A (no monetization), redistribute weight:
    Tutorial +5%, Menu Flow +5%, HUD +5%

Score Interpretation:
  8.0-10.0  POLISHED — UI/UX is professional, clear, accessible
  6.0-7.9   SOLID — Functional with identifiable improvements
  4.0-5.9   NEEDS WORK — Players will struggle in multiple areas
  2.0-3.9   MAJOR REVISION — UI is a barrier to enjoying the game
  0.0-1.9   UNUSABLE — Players cannot effectively interact with the game

Top 3 Deductions (biggest point losses):
  1. [Section] [Criterion]: -N because [specific reason]
  2. [Section] [Criterion]: -N because [specific reason]
  3. [Section] [Criterion]: -N because [specific reason]
--
  Section 8 — Cross-Screen Consistency: _/10, ___ issues found, ___ resolved, ___ deferred

WEIGHTED TOTAL: _._/10

Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Status definitions:**
- **DONE** — All sections reviewed, all critical issues resolved, UX Health Score >= 6.0
- **DONE_WITH_CONCERNS** — All sections reviewed, some issues deferred, score 4.0-5.9
- **BLOCKED** — Review could not complete due to ESCALATE items (UI unusable for target input, critical accessibility failure)
- **NEEDS_CONTEXT** — Review paused because critical context is missing (no target platform, no input method known)

### UX Improvement Roadmap

Prioritized list of improvements:

```
