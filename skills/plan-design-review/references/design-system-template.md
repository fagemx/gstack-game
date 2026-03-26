# Game UI Design System Template

When no DESIGN.md exists, use this template to scaffold one during Pass 5.
Walk the user through each section via AskUserQuestion — one section at a time.

---

## Template: DESIGN.md

```markdown
# {Game Title} — UI Design System

## Art Direction

- **Visual style:** {pixel art / hand-drawn 2D / 3D stylized / 3D realistic / mixed media}
- **Reference games:** {2-3 games whose UI this should feel like}
- **Mood keywords:** {3-5 adjectives — e.g., "gritty, tactile, lived-in" or "bright, playful, bouncy"}
- **What this UI is NOT:** {2-3 anti-references — e.g., "not sterile/clinical, not generic mobile"}

## Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | #___ | Primary actions (Play, Confirm, Buy) |
| `--color-secondary` | #___ | Secondary actions (Back, Cancel, Info) |
| `--color-accent` | #___ | Highlights, notifications, new content indicators |
| `--color-danger` | #___ | Damage, health loss, destructive actions (delete save) |
| `--color-success` | #___ | Healing, XP gain, quest complete, purchase confirmed |
| `--color-warning` | #___ | Low resource, approaching limit, cooldown |
| `--color-disabled` | #___ | Locked content, unavailable actions, greyed out |
| `--color-bg-primary` | #___ | Main background |
| `--color-bg-secondary` | #___ | Cards, panels, overlays |
| `--color-text-primary` | #___ | Body text, labels |
| `--color-text-secondary` | #___ | Descriptions, hints, muted info |

**Colorblind rule:** No information conveyed by color alone. Every color token is paired with {shape / icon / pattern / text label}.

## Typography

| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| H1 | {font} | {size}px | Bold | Screen titles, game title |
| H2 | {font} | {size}px | Semi-bold | Section headers, category labels |
| H3 | {font} | {size}px | Medium | Sub-headers, item names |
| Body | {font} | {size}px | Regular | Descriptions, dialog text |
| Caption | {font} | {size}px | Regular | Tooltips, timestamps, metadata |
| HUD | {font} | {size}px | Bold | In-game numbers (health, ammo, score) |

**Minimum sizes:** Mobile: 14px body / PC: 14px body / Console 10-foot: 24px body

## Spacing & Grid

- **Base unit:** {4px / 8px}
- **Spacing scale:** {xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px}
- **Screen margins:** {Mobile: 16px, PC: 24px, Console: 48px safe area}
- **Card padding:** {inner: md, outer gap: sm}

## Component Library

### Buttons
| Variant | Usage | States |
|---------|-------|--------|
| Primary | Main action per screen (Play, Confirm) | default, hover, pressed, disabled, loading |
| Secondary | Alternative actions (Back, Cancel) | default, hover, pressed, disabled |
| Destructive | Irreversible actions (Delete save, Spend premium) | default, hover, pressed + confirmation |
| Icon-only | Toolbar, HUD quick actions | default, hover, pressed, disabled, active |

### Dialogs
| Type | Usage | Components |
|------|-------|-----------|
| Confirm | Before destructive or premium actions | Title, body, primary + secondary buttons |
| Info | Tutorials, tooltips, lore | Title, body, dismiss button |
| Reward | Loot drops, level up, achievements | Animation, item display, claim button |
| Error | Network failure, save error | Title, body, retry + cancel buttons |

### HUD Elements
| Element | Priority | Position | Behavior |
|---------|----------|----------|----------|
| Health/Shield | P0 — Survival | {position} | Always visible during gameplay |
| Ammo/Ability | P1 — Action | {position} | Visible during combat, hidden in menus |
| Minimap/Compass | P2 — Navigation | {position} | Toggleable or contextual |
| Score/XP | P3 — Progress | {position} | Contextual (show on change, fade) |
| Chat/Social | P4 — Social | {position} | Dismissible, opacity reduction after idle |

### Notifications
| Type | Duration | Position | Interrupt level |
|------|----------|----------|----------------|
| Achievement | 5s | Top-center | Low — does not pause gameplay |
| Loot drop | 3s | Center-right | Medium — brief attention grab |
| System alert | Until dismissed | Center overlay | High — requires acknowledgment |
| Friend online | 3s | Bottom-right | Low — ambient info |

## Animation Vocabulary

| Context | Duration | Easing | Example |
|---------|----------|--------|---------|
| Screen transition | {ms} | {ease-in-out / custom} | Menu → Gameplay |
| Button press | {ms} | {ease-out} | Scale down → bounce back |
| Notification enter | {ms} | {ease-out} | Slide in from edge |
| Notification exit | {ms} | {ease-in} | Fade out |
| Reward reveal | {ms} | {custom spring} | Loot chest open sequence |
| HUD update | {ms} | {ease-out} | Health bar decrease |
| Damage feedback | {ms} | {sharp} | Screen flash / vignette |

**Rule:** If it's not in this table, it doesn't animate. Animations earn their existence.

## Input Method Specs

### Controller
- D-pad/stick navigates all menus
- A/Cross = confirm, B/Circle = back (platform standard)
- Button prompts auto-switch per connected controller
- No mouse cursor required anywhere

### Touch (Mobile)
- All interactive targets >= 44×44pt
- Primary actions in bottom 60% (thumb zone)
- No hover states anywhere
- Swipe gestures have visual affordances

### Keyboard + Mouse
- Tab order logical in all menus
- All actions have keyboard shortcut
- Mouse precision targets (can be smaller than touch)
- Right-click context menus where appropriate
```

---

## How to Use This Template

### During Pass 5, when DESIGN.md is missing:

1. **Present the need:**
   > "No design system found. Without one, each screen will be designed independently — inconsistent colors, fonts, and components. I'll help you build one now."

2. **Walk through sections one at a time via AskUserQuestion:**
   - Start with **Art Direction** (sets the creative foundation)
   - Then **Color Tokens** (most impactful, touches everything)
   - Then **Typography** (second most impactful)
   - Then **Component Library** (reusable elements)
   - Spacing, Animation, Input specs can be lighter passes

3. **For each section, offer:**
   - A) Fill in now — I'll ask specific questions
   - B) Use defaults — I'll propose sensible defaults based on the game's genre and art style
   - C) Skip — defer to later (flag as design debt)

4. **After completing, write DESIGN.md** to the project's `docs/` directory.

5. **Re-run Pass 5** — the new DESIGN.md now becomes the calibration source for all other passes.

### Minimum Viable Design System

If the user wants the fastest path, the minimum viable sections are:
1. Art Direction (5 fields)
2. Color Tokens (6 core tokens)
3. Typography (3 levels: H1, Body, HUD)
4. Buttons (2 variants: Primary, Secondary)

Everything else can be deferred and built incrementally.
