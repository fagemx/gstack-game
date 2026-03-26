# Game UI Slop Patterns

AI-generated and template-derived game UI patterns that signal "no design thinking happened here."
When you encounter these in a plan, challenge them — not to remove them, but to make them SPECIFIC to this game.

## The Slop Blacklist

### HUD Slop
| Pattern | Challenge Question |
|---------|-------------------|
| "Health bar" | What shape? What fill direction? What animation on damage? How does it reflect the game's identity? |
| "Minimap in corner" | Does this game need a minimap? Would a compass, breadcrumbs, or environmental cues work better? |
| "Ammo counter" | Number? Icons? Segmented bar? Does reload have a visual? Does low ammo change the display? |
| "XP bar at bottom" | What makes earning XP feel satisfying in THIS game? Just a bar filling, or something specific? |
| "Quest tracker on right" | How many quests shown? What happens at 10+ quests? Is there priority? Can player pin/unpin? |

### Menu Slop
| Pattern | Challenge Question |
|---------|-------------------|
| "Main menu with Play/Settings/Quit" | What's the visual theme? Is there a scene behind the menu? Does the menu reflect game progress? |
| "Settings screen" | How many categories? What's the layout? Sliders or dropdowns? Preview for visual settings? |
| "Loading screen with tips" | Tips about what? Are they contextual to where the player is going? Is there interactive content? |
| "Pause menu overlay" | Darken? Blur? Can player still see game state? Is there a quick-resume option? |

### Inventory & Shop Slop
| Pattern | Challenge Question |
|---------|-------------------|
| "Grid-based inventory" | Why grid? Would a list, paper doll, or spatial system serve the game better? How do items show rarity? |
| "Card-based shop" | Every F2P has card shops. What makes this one belong to THIS game? How does the player know what's worth buying? |
| "Crafting UI" | Tree? Grid? Drag-and-drop? Discovery-based? How does the player learn recipes? What's the feedback on success? |
| "Talent/skill tree" | Branching tree? Constellation? Grid? How does the player understand synergies? Is respec possible and how? |

### Social & Multiplayer Slop
| Pattern | Challenge Question |
|---------|-------------------|
| "Chat window" | Where? Always visible? Tabs for channels? Emoji/sticker support? Toxicity filtering visible to user? |
| "Friend list" | How do players add friends? What status info is shown? Can you join a friend's game from the list? |
| "Leaderboard" | Global? Friends? What time frame? What metric? How does rank #50,000 feel vs rank #5? |
| "Lobby screen" | What can players DO while waiting? Is there a ready-up? Timer? Character preview? |

### Onboarding Slop
| Pattern | Challenge Question |
|---------|-------------------|
| "Tutorial tooltips" | Contextual or forced sequence? Dismissible? Visual or text-heavy? Do they teach by doing? |
| "Press A to continue" | How many screens? Can the player skip? Is this information available later? |
| "Highlight interactive objects" | What visual treatment? Glow? Outline? Particle? Does it match the art style or feel like a debug overlay? |

## The Litmus Test

**If you can describe a UI element in the plan using only generic terms and it still makes sense, it's slop.**

Examples:
- SLOP: "The inventory shows items in a grid with rarity colors."
- SPECIFIC: "The inventory is a traveler's satchel that unfolds. Items are physical objects placed in compartments. Legendary items glow with the game's signature amber particle effect and emit a faint hum sound cue."

- SLOP: "Health bar decreases when the player takes damage."
- SPECIFIC: "The health system uses a cracked porcelain mask in the corner. Each hit adds visible cracks. At critical health, pieces fall off revealing darkness underneath. No numbers — players learn to read the mask."

## Severity Classification

| Severity | Description | Action |
|----------|-------------|--------|
| **CRITICAL** | Core loop UI is generic (HUD, main interaction) | Must redesign before implementation |
| **HIGH** | Frequently seen UI is generic (inventory, shop, menus) | Should redesign — players will notice |
| **MEDIUM** | Secondary UI is generic (settings, loading, tooltips) | Flag for polish pass |
| **LOW** | Rare-use UI is generic (credits, achievements) | Acceptable to defer |
