# Asset Review — Naming Conventions

## Common Patterns

### 1. snake_case with Type Prefix
```
tex_hero_knight_diffuse.png
mdl_env_tree_oak_01.fbx
sfx_ui_button_click.wav
ui_hud_health_bar.png
```
Most common in Unity projects. Type prefix makes filtering easy.

### 2. PascalCase with Category Suffix
```
HeroKnight_Diffuse.png
TreeOak01_Mesh.fbx
ButtonClick_SFX.wav
HealthBar_HUD.png
```
Common in Unreal projects. Matches engine naming conventions.

### 3. Flat Tag System
```
hero-knight-diffuse.png
env-tree-oak-01.fbx
ui-btn-click.wav
hud-health-bar.png
```
Common in web/indie projects. Simple but can get ambiguous.

## Detection Heuristic

To identify which convention a project uses:
1. Sample 20 assets from different categories
2. Check: are >80% consistent in case style? (snake_case / PascalCase / kebab-case)
3. Check: is there a prefix or suffix pattern for type/category?
4. Check: are numeric suffixes consistent? (01 vs 1 vs _v1)
5. If <60% consistency: no convention detected — flag as finding

## Common Violations to Flag

| Violation | Example | Why it matters |
|-----------|---------|---------------|
| Mixed case styles | `hero_knight.png` + `TreeOak.fbx` | Breaks sorting, search, automation |
| Missing type indicator | `knight.png` (texture? sprite? UI?) | Can't filter by type |
| Spaces in names | `Hero Knight.png` | Breaks CLI tools, scripts, some engines |
| Special characters | `hero@2x.png`, `tree (1).fbx` | Platform-dependent, fragile |
| Inconsistent numbering | `tree01` + `rock1` + `bush_v2` | Confusing, hard to batch process |
| No variant indicator | `knight.png` + `knight.png` (different folders) | Ambiguous, merge conflicts |

## Folder Structure Standards

Assets should be organized by ONE consistent principle:

**By Type:**
```
assets/textures/characters/
assets/textures/environment/
assets/models/characters/
assets/models/environment/
assets/audio/sfx/
assets/audio/music/
```

**By Feature/Scene:**
```
assets/level_01/textures/
assets/level_01/models/
assets/characters/hero/
assets/characters/enemies/
assets/ui/main_menu/
```

Either works. Mixing both in the same project = violation. Source files (PSD, Blend, FBX source) should live in a separate `_source/` or `raw/` directory, not alongside game-ready assets.
