---
name: game-ux-review
description: "Game UI/UX review. Evaluates HUD readability, menu flow, shop interface, tutorial UI, controller/touch adaptation, and accessibility."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
_GD_VERSION="0.3.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/gstack-game/bin" ".claude/skills/game-review/../../gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"

# Project identification
_SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_USER=$(whoami 2>/dev/null || echo "unknown")

# Session tracking
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"

# Shared artifact storage (cross-skill, cross-session)
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG

# Telemetry (sanitize inputs before JSON interpolation)
mkdir -p ~/.gstack/analytics
_SLUG_SAFE=$(printf '%s' "$_SLUG" | tr -d '"\\\n\r\t')
_BRANCH_SAFE=$(printf '%s' "$_BRANCH" | tr -d '"\\\n\r\t')
echo '{"skill":"game-ux-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"

# Artifact summary
_ARTIFACT_COUNT=$(ls "$_PROJECTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
[ "$_ARTIFACT_COUNT" -gt 0 ] && echo "Artifacts: $_ARTIFACT_COUNT files in $_PROJECTS_DIR" && ls -t "$_PROJECTS_DIR"/*.md 2>/dev/null | head -5 | while read f; do echo "  $(basename "$f")"; done
```

**Shared artifact directory:** `$_PROJECTS_DIR` (`~/.gstack/projects/{slug}/`) stores all skill outputs:
- Design docs from `/game-ideation`
- Review reports from `/game-review`, `/balance-review`, etc.
- Player journey maps from `/player-experience`

All skills read from this directory on startup to find prior work. All skills write their output here for downstream consumption.

If `PROACTIVE` is `"false"`, do not proactively suggest gstack-game skills.

## AskUserQuestion Format (Game Design)

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** Project, branch, what game/feature is being reviewed. (1-2 sentences)
2. **Simplify:** Plain language a smart 16-year-old gamer could follow. Use game examples they'd know (Minecraft, Genshin, Among Us, etc.) as analogies.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — include `Player Impact: X/10` for each option. Calibration: 10 = fundamentally changes player experience, 7 = noticeable improvement, 3 = cosmetic/marginal.
4. **Options:** Lettered: `A) ... B) ... C) ...` with effort estimates (human: ~X / CC: ~Y).

**Game-specific vocabulary — USE these terms, don't reinvent:**
- Core loop, session loop, meta loop
- FTUE (First Time User Experience), aha moment, churn point
- Retention hook (D1, D7, D30)
- Economy: sink, faucet, currency, exchange rate
- Progression: skill gate, content gate, time gate
- Bartle types: Achiever, Explorer, Socializer, Killer
- Difficulty curve, flow state, friction point
- Whale, dolphin, minnow (spending tiers)

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.

## Next Step Routing Protocol

After every Completion Summary, include a `Next Step:` block. Route based on status:

1. **STATUS = BLOCKED** — Do not suggest a next skill. Report the blocker only.
2. **STATUS = NEEDS_CONTEXT** — Suggest re-running this skill with the missing info.
3. **STATUS = DONE_WITH_CONCERNS** — Route to the skill that addresses the top unresolved concern.
4. **STATUS = DONE** — Route forward in the workflow pipeline.

### Workflow Pipeline

```
Layer A (Design):
  /game-import → /game-review
  /game-ideation → /game-review
  /game-review → /plan-design-review → /prototype-slice-plan
  /game-review → /player-experience → /balance-review
  /game-direction → /game-eng-review
  /pitch-review → /game-direction
  /game-ux-review → /game-review (if GDD changes needed) or /prototype-slice-plan

Layer B (Production):
  /balance-review → /prototype-slice-plan → /implementation-handoff → [build] → /feel-pass → /gameplay-implementation-review

Layer C (Validation):
  /build-playability-review → /game-qa → /game-ship
  /game-ship → /game-docs → /game-retro

Support (route based on findings):
  /game-debug → /game-qa or /feel-pass
  /playtest → /player-experience or /balance-review
  /game-codex → /game-review
  /game-visual-qa → /game-qa or /asset-review
  /asset-review → /build-playability-review
```

### Backtrack Rules

When a score or finding indicates a design-level problem, route backward instead of forward:
- Core loop fundamentally broken → /game-ideation
- GDD needs rewriting → /game-review
- Scope or direction unclear → /game-direction
- Economy unsound → /balance-review

### Format

Include in the Completion Summary code block:
```
Next Step:
  PRIMARY: /skill — reason based on results
  (if condition): /alternate-skill — reason
```

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "game-ux-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Artifact Discovery

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
echo "=== Checking for prior artifacts ==="
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
UI_DOC=$(ls -t docs/*ui* docs/*ux* docs/*wireframe* docs/*mockup* 2>/dev/null | head -1)
PREV_UX=$(ls -t $_PROJECTS_DIR/*-ux-review-*.md 2>/dev/null | head -1)
PREV_GAME_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD: $GDD"
[ -n "$UI_DOC" ] && echo "UI doc: $UI_DOC"
[ -n "$PREV_UX" ] && echo "Prior UX review: $PREV_UX"
[ -n "$PREV_GAME_REVIEW" ] && echo "Prior game review: $PREV_GAME_REVIEW"
echo "Branch: $(git branch --show-current 2>/dev/null)"
```

If a prior UX review exists, read it. Note previous scores and findings — check if flagged issues have been addressed.

---

# /game-ux-review: Game UI/UX Review

Review a game's user interface and user experience interactively. Work through each section one issue at a time via AskUserQuestion. Every recommendation includes WHY and a concrete alternative.

This skill reviews UI/UX design and implementation. It can review mockups, wireframes, live builds, or screenshots. For GDD review, use `/game-review`. For visual QA (bug-finding), use `/game-visual-qa`.

## Anti-Sycophancy Protocol

**FORBIDDEN PHRASES — never use these or any paraphrase:**
- "Clean design!"
- "Nice UI"
- "Looks professional"
- "Intuitive layout"
- "Good use of space"
- "Players will understand this"
- "The UI is well-organized"

**CALIBRATED ACKNOWLEDGMENT — use this instead:**
- Name the specific UX decision and WHY it works for the player: "Health bar at top-left with red fill follows the Western reading pattern (top-left = first scan point) — players will check health without conscious effort, which supports the stated 'fast-paced' pillar."
- If a UI element is genuinely well-designed, describe the cognitive reason it works, never just say it "looks good."

**PUSH-BACK CADENCE:**
1. Push once: State the UX issue with the player impact.
2. Push again: If the response is "players will figure it out," ask: "What percentage of players? What's the FTUE drop-off at this point? Do you have playtest data?"
3. Escalate: If still unaddressed after two pushes, flag as ESCALATE — "UI is unusable for [X]% of target audience without redesign."

---

## Step 0: Context & Input Method

Before reviewing, establish the context that frames every UX judgment.

1. **Primary input method** — Touch? Controller? Keyboard+mouse? Multiple?
2. **Target audience** — Casual (simple, forgiving UI)? Hardcore (dense, efficient UI)?
3. **Platform** — Mobile (small screen, thumbs)? PC (large screen, mouse)? Console (10-foot UI, controller)? VR?
4. **Reference style** — Does the team have a UI style guide, design system, or reference game?
5. **Game genre** — Genre sets UX expectations. RTS players expect minimap. FPS players expect crosshair + ammo.

### Mode Selection

**AskUserQuestion:**

> **[Re-ground]** Reviewing UI/UX for `[game title]` on `[branch]`.
>
> **[Simplify]** Different games need different UIs — like how a race car dashboard looks nothing like a delivery truck's. A mobile puzzle game needs big touch targets and minimal info; an RTS needs dense information panels and hotkeys. The review adjusts based on your game type.
>
> **RECOMMENDATION:** Choose the mode matching your primary platform. If multi-platform, choose the most constrained platform (usually mobile).
>
> - **A) Mobile / Touch** — Focus on thumb zones, touch target sizes (44px min), one-hand reachability, minimal text. Player Impact: 9/10 for mobile games.
> - **B) PC / Keyboard+Mouse** — Focus on information density, hover states, keyboard shortcuts, mouse precision UI, window scaling. Player Impact: 9/10 for PC games.
> - **C) Console / Controller** — Focus on 10-foot readability, D-pad navigation, cursor-less interaction, button prompt accuracy. Player Impact: 9/10 for console games.
> - **D) Cross-Platform** — Review all input methods. Most thorough but takes longest. Player Impact: 10/10 for multi-platform.

### Mode Weight Adjustments

| Section | A: Mobile | B: PC | C: Console | D: Cross-Platform |
|---------|-----------|-------|------------|-------------------|
| 1. First Impression | 10% | 10% | 10% | 10% |
| 2. HUD | 15% | 15% | 20% | 15% |
| 3. Menu Flow | 15% | 10% | 15% | 15% |
| 4. Shop/Monetization | 15% | 10% | 10% | 10% |
| 5. Tutorial/Onboarding | 15% | 15% | 15% | 15% |
| 6. Input Adaptation | 15% | 15% | 15% | 20% |
| 7. Accessibility | 10% | 15% | 10% | 10% |
| 8. Cross-Screen Consistency | 5% | 10% | 5% | 5% |

---

## Section 1: First Impression (第一印象) — Weight: varies by mode

### The 1-Second Test

Look at the main game screen (gameplay HUD) for exactly 1 second, then look away.

Answer:
1. **What is the player's current status?** (health, score, resources) — Could you tell?
2. **What should the player do next?** — Was there any visual guidance?
3. **Professional or amateur?** — Gut feeling, honest assessment.

### The 5-Second Test

Look at the main menu for 5 seconds.

Answer:
1. **What game is this?** — Is the identity clear?
2. **What are my options?** — Can you name the menu items from memory?
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

Rank every HUD element by priority:

| Priority | What | Placement | Size |
|----------|------|-----------|------|
| **P0 — Survival** | Health, shield, immediate danger | Always visible, prominent | Large |
| **P1 — Action** | Ammo, cooldowns, active ability | Near center or action area | Medium |
| **P2 — Navigation** | Minimap, objective marker, compass | Corner, consistent position | Medium |
| **P3 — Progress** | Score, XP, quest tracker | Edge, secondary | Small-Medium |
| **P4 — Context** | Team status, chat, notifications | Peripheral, dismissible | Small |

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

- **AUTO:** Text without contrast backing, HUD elements outside safe area
- **ASK:** HUD element priority, contextual show/hide decisions, HUD density
- **ESCALATE:** Player cannot read critical game state from HUD at target viewing distance

**STOP.** One issue per AskUserQuestion.

---

## Section 3: Menu Flow (選單流程) — Weight: varies by mode

### Menu Depth Rule

**Maximum 3 taps/clicks to reach any frequently-used function.** Count from the main menu.

| Depth | Acceptable for | Red Flag if |
|-------|---------------|-------------|
| 1 tap | Play, Settings | — |
| 2 taps | Character select, level select, shop | Core loop requires 3+ |
| 3 taps | Specific setting, deep inventory, achievement detail | Frequently-used function |
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

- **AUTO:** Missing back buttons, dead-end screens, loading without indicator
- **ASK:** Menu structure reorganization, navigation depth reduction
- **ESCALATE:** Player can get stuck in a menu with no way out (menu softlock)

**STOP.** One issue per AskUserQuestion.

---

## Section 4: Shop / Monetization UI (商店與付費介面) — Weight: varies by mode

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

### Action Classification

- **AUTO:** Missing price labels, purchase without confirmation
- **ASK:** Monetization UI placement, currency design, pressure tactic evaluation
- **ESCALATE:** Predatory monetization targeting minors, no purchase confirmation for real money

**STOP.** One issue per AskUserQuestion.

---

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

- **AUTO:** Tooltips covering critical gameplay area, undismissible blocking UI
- **ASK:** Tutorial flow design, progressive disclosure pacing, skip-ability decisions
- **ESCALATE:** Tutorial is softlocked (player cannot complete tutorial step due to UI bug)

**STOP.** One issue per AskUserQuestion.

---

## Section 6: Input Adaptation (輸入適配) — Weight: varies by mode

### Per-Input-Method Checklist

**Controller:**
| Check | Pass Criteria |
|-------|---------------|
| Button prompts | Match the connected controller (Xbox/PS/Switch icons) |
| D-pad / stick navigation | Every menu navigable without touch/mouse |
| Cursor-free interaction | No mouse cursor required |
| Rumble / haptics | Used meaningfully (not just vibrate on everything) |
| Dead zone | Configurable or sensible defaults |

**Touch (Mobile):**
| Check | Pass Criteria |
|-------|---------------|
| Touch targets | All interactive elements >= 44x44 points |
| Thumb zones | Primary actions in bottom 60% of screen (thumb reach) |
| Gesture discovery | Swipe/pinch gestures have visual affordances |
| One-hand mode | Core loop playable with one hand (if applicable) |
| No hover states | Nothing requires hover (impossible on touch) |

**Keyboard + Mouse:**
| Check | Pass Criteria |
|-------|---------------|
| All actions bindable | Every action has a keyboard shortcut |
| Mouse precision | UI targets work at mouse-pointer precision (can be smaller than touch) |
| Keyboard navigation | Tab order logical in menus |
| Shortcut discovery | Shortcuts shown in tooltips or settings |
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

- **AUTO:** Color-only information, text below minimum size, missing contrast
- **ASK:** Accessibility feature scope, assist mode design, subtitle implementation
- **ESCALATE:** Game is unplayable for a common accessibility need (colorblindness, deafness) with no options

**STOP.** One issue per AskUserQuestion.

---

## Section 8: Cross-Screen Consistency (跨畫面一致性) — Weight: varies by mode

### Consistency Checks

| Check | What to Verify | Red Flag |
|-------|---------------|----------|
| **Color meaning** | Same color = same meaning everywhere (red = damage, green = heal) | Red means "health" in HUD but "delete" in menu |
| **Icon language** | Same icon = same action everywhere | Gear icon means "settings" on one screen, "equipment" on another |
| **Animation style** | Consistent easing, duration, direction across all transitions | Some menus slide, others fade, others pop with no pattern |
| **Button style** | Primary/secondary/destructive buttons look the same everywhere | "Confirm" is green on one screen, blue on another |
| **Typography** | Same hierarchy (H1, H2, body) across all screens | Title size varies between screens |
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

Calculate after all sections are reviewed:

```
UX Health Score (Mode: [A/B/C/D])
═══════════════════════════════════════════════
  Section 1 — First Impression:         _/10  (weight: __%)  → weighted: _.___
  Section 2 — HUD:                      _/10  (weight: __%)  → weighted: _.___
  Section 3 — Menu Flow:                _/10  (weight: __%)  → weighted: _.___
  Section 4 — Shop/Monetization:        _/10  (weight: __%)  → weighted: _.___
  Section 5 — Tutorial/Onboarding:      _/10  (weight: __%)  → weighted: _.___
  Section 6 — Input Adaptation:         _/10  (weight: __%)  → weighted: _.___
  Section 7 — Accessibility:            _/10  (weight: __%)  → weighted: _.___
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
```

### Completion Summary

```
/game-ux-review Completion Summary
═══════════════════════════════════
Game: [title]
Branch: [branch]
Mode: [A/B/C/D] — [Mobile/PC/Console/Cross-Platform]
Primary Input: [input method]

Section Results:
  Step 0: Context & Mode — [established / missing items]
  Section 1 — First Impression:         _/10, ___ issues found, ___ resolved, ___ deferred
  Section 2 — HUD:                      _/10, ___ issues found, ___ resolved, ___ deferred
  Section 3 — Menu Flow:                _/10, ___ issues found, ___ resolved, ___ deferred
  Section 4 — Shop/Monetization:        _/10 (or N/A), ___ issues found, ___ resolved, ___ deferred
  Section 5 — Tutorial/Onboarding:      _/10, ___ issues found, ___ resolved, ___ deferred
  Section 6 — Input Adaptation:         _/10, ___ issues found, ___ resolved, ___ deferred
  Section 7 — Accessibility:            _/10, ___ issues found, ___ resolved, ___ deferred
  Section 8 — Cross-Screen Consistency: _/10, ___ issues found, ___ resolved, ___ deferred

WEIGHTED TOTAL: _._/10

Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT

Next Step:
  PRIMARY: /prototype-slice-plan — UX reviewed, plan implementation
  (if GDD changes needed): /game-review — update design first
```

**Status definitions:**
- **DONE** — All sections reviewed, all critical issues resolved, UX Health Score >= 6.0
- **DONE_WITH_CONCERNS** — All sections reviewed, some issues deferred, score 4.0-5.9
- **BLOCKED** — Review could not complete due to ESCALATE items (UI unusable for target input, critical accessibility failure)
- **NEEDS_CONTEXT** — Review paused because critical context is missing (no target platform, no input method known)

### UX Improvement Roadmap

Prioritized list of improvements:

```
Priority 1 — Ship-Blockers (fix before release):
  - [Issue]: [Section], Impact: [High/Medium], Effort: (human: ~X / CC: ~Y)

Priority 2 — High-Impact Quick Wins (fix if time allows):
  - [Issue]: [Section], Impact: [High/Medium], Effort: (human: ~X / CC: ~Y)

Priority 3 — Polish (post-release or next milestone):
  - [Issue]: [Section], Impact: [Medium/Low], Effort: (human: ~X / CC: ~Y)
```

### NOT in Scope

List deferred work:
```
- [Issue]: Deferred because [reason]. Revisit when [condition].
```

---

## Regression Delta (if prior UX review exists)

If a prior UX review artifact was found in Artifact Discovery, compare scores:

```
UX Score Delta:
  Section               Prior    Current  Change
  First Impression:     _/10     _/10     +_
  HUD:                  _/10     _/10     +_
  Menu Flow:            _/10     _/10     +_
  Shop UI:              _/10     _/10     +_
  Tutorial:             _/10     _/10     +_
  Input Adaptation:     _/10     _/10     +_
  Accessibility:        _/10     _/10     +_
  Consistency:          _/10     _/10     +_
  WEIGHTED TOTAL:       _._/10   _._/10   +_._
```

**⚠️ If current < prior: WARN** — a change may have introduced a UX regression.

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-ux-review-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-ux-review-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship, /game-qa, /game-retro

---

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-ux-review","timestamp":"TIMESTAMP","status":"STATUS","score":"SCORE","mode":"MODE","input_method":"INPUT","unresolved":N,"sections":{"first_impression":N,"hud":N,"menu_flow":N,"shop":N,"tutorial":N,"input_adaptation":N,"accessibility":N,"consistency":N},"commit":"COMMIT"}' 2>/dev/null || true
```
