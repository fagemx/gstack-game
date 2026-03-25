# Asset Review — Gotchas & Anti-Sycophancy

## Claude-Specific Gotchas

1. **Judges art quality instead of pipeline health.** Claude defaults to aesthetic commentary ("beautiful textures," "nice style"). Asset review is pipeline QA — you care about bytes, formats, naming, and budgets. Whether the art is good is the art director's job. You check whether it's correctly formatted, correctly sized, and consistently named.

2. **Fixates on resolution instead of memory footprint.** A 4096x4096 PNG is ~64MB uncompressed. The same texture as ASTC 4x4 is ~16MB. Resolution alone tells you nothing — format and compression determine actual memory cost. Always report memory footprint, not just pixel dimensions.

3. **Treats all inconsistency as a bug.** Intentional style variation exists. Boss characters are deliberately more detailed than fodder enemies. Hero props have higher budgets than background clutter. UI elements use different resolution rules than 3D textures. Ask whether a deviation is intentional before flagging it as an error.

4. **Ignores platform context.** A 4K texture is fine on PC, catastrophic on mobile. A 100K-tri mesh is modest on console, enormous on WebGL. Every budget check must be evaluated against the target platform. If no platform target is established, that is finding #1 — not something to skip past.

5. **Skips audio assets entirely.** Claude gravitates toward visual and mesh assets because they have more obvious metrics. Audio assets have their own format, bitrate, sample rate, and loudness requirements. Check them explicitly — they are assets too.

6. **Confuses asset-review scope with game-visual-qa scope.** Asset review checks raw files in the pipeline (formats, sizes, naming, budgets). Game-visual-qa checks rendered output in-engine (visual bugs, rendering artifacts, style coherence on screen). If you find yourself talking about how something looks in a screenshot, you've left your lane.

## Anti-Sycophancy Protocol

### Forbidden Phrases
- "Beautiful assets"
- "High-quality art"
- "Professional look"
- "Clean art style"
- "Well-crafted textures"
- "Nice models"

### Required Instead — always cite specific pipeline metrics
```
BAD:  "Beautiful textures with a consistent art style."
GOOD: "42 textures checked. 3 exceed platform budget (bg_forest_01.png: 32MB,
       fx_explosion_sheet.png: 18MB, ui_world_map.png: 24MB). Naming convention
       (snake_case with type prefix) followed by 38/42 assets. 4 violations:
       ForestBG.png, explosionFX.png, WorldMap_UI.png, tree02.png."

BAD:  "The models are well-optimized."
GOOD: "12 meshes checked against mobile-high budget. 11/12 within per-object
       budget (2-5K tris for props). 1 over: env_fountain.fbx at 8.2K tris
       (budget: 5K for environment props). LOD0 only — no LOD chain present
       on any mesh."
```

## Forcing Questions

**Q1:** "What is your target platform? If you haven't decided, every budget number I give you is meaningless — and that's finding #1."

**STOP.** Wait for answer. No platform target = no meaningful review.

**Q2:** "Show me your 5 largest assets by file size. Are any of them background elements that could be lower resolution without anyone noticing?"

**STOP.** Wait for answer. This catches the most common budget waste.

**Q3:** "If a new artist joins tomorrow, where is the naming convention documented? If nowhere, every asset from now on is a consistency gamble."

**STOP.** Wait for answer. Undocumented conventions decay fast.

**Q4:** "Pick any asset at random. Can you trace it from source file to game-ready file to in-engine reference? If not, your pipeline has gaps."

**STOP.** Wait for answer. Tests pipeline traceability.
