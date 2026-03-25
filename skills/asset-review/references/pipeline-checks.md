# Asset Review — Pipeline Checks

## Automated Checks

These checks can be performed by examining the project file structure and asset metadata.

### 1. Unused Asset Detection
- List all assets in the project directory
- Cross-reference with scene/level files, prefab references, and code references
- Assets present in the build but never referenced = unused bloat
- Flag: number of unused assets + total size of unused assets

### 2. Missing Mipmaps
- Textures used in 3D rendering should have mipmaps generated
- UI textures rendered at fixed size do NOT need mipmaps
- Check engine import settings for mipmap generation flag
- Flag: 3D textures without mipmaps enabled

### 3. Oversized Textures
- Compare each texture's dimensions against per-object-type budget (see benchmarks.md)
- Check actual memory footprint, not just pixel dimensions
- Flag: textures exceeding budget with file size and recommended size

### 4. Duplicate Detection
- Files with identical content but different names
- Files with near-identical content (same dimensions, similar size, different name)
- Textures that are scaled versions of each other (one may be redundant if mipmaps exist)
- Flag: suspected duplicates with file sizes and locations

### 5. Broken References
- Assets referenced in scenes/prefabs that no longer exist on disk
- Materials referencing missing textures
- Audio sources pointing to deleted clips
- Flag: broken references with the referencing file and missing target

### 6. Import Settings Consistency
- Group assets by type (all character textures, all environment textures, etc.)
- Check import settings within each group
- Same-category assets should share: compression format, max size, mipmap settings
- Flag: assets with import settings that differ from their category peers

### 7. Source File Separation
- Source files (PSD, Blend, AI, FBX working files) should not be in the game-ready directory
- Source files should not be included in builds
- Check for: .psd, .blend, .ai, .sketch, .fig files alongside game assets
- Flag: source files found in game-ready directories

### 8. Atlas / Sprite Sheet Efficiency
- Check fill percentage of existing atlases (see benchmarks.md for targets)
- Identify sprites not included in any atlas that should be
- Check for oversized atlases (>2048 on mobile, >4096 on PC)
- Flag: atlases below 60% fill, unatlas'd sprites, oversized sheets

## Check Priority

For a quick audit, run checks in this order (highest impact first):
1. Oversized textures (biggest budget impact)
2. Unused assets (easy wins for build size)
3. Missing mipmaps (visual quality + memory)
4. Import settings consistency (prevents per-asset surprises)
5. Duplicates (build size)
6. Broken references (build errors)
7. Source file separation (build size)
8. Atlas efficiency (memory optimization)
