# Asset Review — Scoring

## 7 Dimensions

Each 0-2. Total /14.

### 1. Naming & Organization
Assets follow a consistent, discoverable naming convention and folder structure.

- **2** = Convention is documented and followed by >90% of assets. Folders organized logically (by type, scene, or feature — consistently). Source files separated from game-ready. No ambiguous names.
- **1** = Convention is mostly followed (70-90%) but has violations. Folder structure exists but has inconsistencies. Some ambiguous names.
- **0** = No consistent convention detectable. Mixed casing, mixed separators, no type prefixes. Folders disorganized or flat dump. Finding assets requires guessing.

### 2. Format Compliance
Assets use the correct format for their type and target platform.

- **2** = All textures use platform-appropriate compressed formats. Models exported in correct format with clean topology. Audio in correct format per use case (compressed for music, uncompressed for short SFX). No wasted alpha channels. Mipmaps generated where needed.
- **1** = Most formats correct but some assets use suboptimal formats (e.g., uncompressed PNG for 3D textures on mobile, WAV for music). Minor topology issues.
- **0** = Widespread format problems. Uncompressed textures on mobile. Wrong audio formats. Missing mipmaps. Assets not optimized for target platform.

### 3. Budget Compliance
Assets fit within per-asset budgets for the target platform.

- **2** = All assets within per-asset budgets. Top 5 largest assets are justified (hero assets, not background clutter). Total footprint within platform budget (reference game-eng-review for platform totals).
- **1** = Most assets within budget but 1-3 outliers exceed per-asset limits. Total footprint within 120% of budget. Outliers are identifiable and fixable.
- **0** = Multiple assets exceed per-asset budgets. Total footprint >150% of budget. No awareness of budget constraints. Optimization needed before ship.

### 4. Style Consistency Detection
Assets from the same category share visual characteristics. Scored by deviation count, NOT by art quality.

- **2** = Across same-category assets (e.g., all environment props, all character portraits), visual characteristics are consistent: color temperature, detail level, line weight, scale, lighting direction. 0-1 deviations detected.
- **1** = Mostly consistent but 2-4 deviations detected. Deviations may be intentional (ask) — e.g., boss characters deliberately more detailed.
- **0** = 5+ deviations detected across same-category assets. Mixed art sources likely (marketplace + custom + AI-generated). Needs art director review.

**Important:** You detect and count deviations. You do not judge whether the art style is good. Flag deviations, note which dimension (color/scale/detail/lighting/line weight), and let the art director decide.

### 5. Pipeline Automation
Import settings, compression, and build steps are automated and consistent.

- **2** = Import settings consistent across similar asset types. Texture compression automated. Atlas/sprite packing configured. Asset dependencies mapped. Build pipeline reproducible.
- **1** = Some automation but manual steps remain. Import settings mostly consistent but some hand-tuned exceptions. No atlas packing or it's manual.
- **0** = No automation. Each asset imported with different settings. No compression pipeline. No atlas generation. Manual and fragile.

### 6. Redundancy
No duplicate, unused, or orphaned assets.

- **2** = No duplicate assets detected. No unused assets in build. No orphaned references. Asset list is clean.
- **1** = 1-3 suspected duplicates or unused assets. Minor bloat but manageable.
- **0** = Multiple duplicates with different names. Significant unused assets in build. Orphaned references causing warnings. Build bloat.

### 7. Documentation
Asset specifications and conventions are documented.

- **2** = Naming convention documented. Per-category budgets documented. Art style reference exists (art bible, reference sheet, or style guide). Pipeline steps documented.
- **1** = Some documentation exists but incomplete. Convention exists in team knowledge but not written down. Budget targets verbal.
- **0** = No asset documentation. Convention is "whatever the last person did." No budget targets. No art reference.

## Pipeline Verdict

| Score | Verdict | Description |
|-------|---------|-------------|
| 12-14 | **CLEAN** | Pipeline is healthy. Assets are well-organized, within budget, and consistently produced. Ship-ready. |
| 9-11 | **ACCEPTABLE** | Pipeline works but has minor issues. 1-2 dimensions need attention. Fix before next milestone. |
| 6-8 | **NEEDS_WORK** | Multiple pipeline issues. Budget overruns, naming chaos, or format problems. Needs dedicated cleanup sprint. |
| 3-5 | **AT_RISK** | Serious pipeline problems. Assets are inconsistent, over budget, and poorly organized. Shipping risk. |
| 0-2 | **BLOCKED** | Pipeline is broken. Assets can't be reliably imported, found, or budgeted. Stop adding content and fix the pipeline. |

## Score Template

```
Asset Pipeline Review: [Project/Scope]
═══════════════════════════════════════════
Platform: [target]

  Naming & Organization:     _/2
  Format Compliance:         _/2
  Budget Compliance:         _/2
  Style Consistency:         _/2  (deviations: N)
  Pipeline Automation:       _/2
  Redundancy:                _/2
  Documentation:             _/2
  ─────────────────────────
  TOTAL:                     _/14  — [CLEAN/ACCEPTABLE/NEEDS_WORK/AT_RISK/BLOCKED]

Top 3 Pipeline Issues:
  1. [most impactful — specific metric]
  2.
  3.
═══════════════════════════════════════════
```
