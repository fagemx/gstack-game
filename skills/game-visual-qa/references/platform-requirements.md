# Platform Requirements

Safe zones, resolution tiers, aspect ratios, and platform-specific visual requirements.

## Safe Zones

### Television / Console

| Zone | Coverage | Usage |
|------|----------|-------|
| Action safe | 90% of screen (5% inset each edge) | All interactive elements must be inside |
| Title safe | 80% of screen (10% inset each edge) | All text and critical info must be inside |

Modern TVs have less overscan than CRTs, but compliance is still required for console certification.

### Mobile Devices

| Area | Spec | Handling |
|------|------|----------|
| iOS status bar | 44pt top (iPhone with Dynamic Island), 20pt (older) | Do not place interactive elements here |
| iOS home indicator | 34pt bottom | Avoid placing critical UI at very bottom |
| Android status bar | 24-28dp top (varies by device) | Use system insets API |
| Android navigation bar | 48dp bottom (gesture or button) | Use system insets API |
| Notch/punch-hole | Device-specific | Use safe area insets; test with simulator |
| Foldable crease | Center screen on fold devices | Avoid critical UI at fold line |

Rule: Use platform safe area APIs. Hardcoded pixel offsets will break on new devices.

### PC

No mandatory safe zones, but:
- Windowed mode: UI must not rely on being at screen edge
- Ultrawide: HUD should anchor to 16:9 center, not stretch to edges
- Multi-monitor: Ensure UI renders on primary monitor only

## Resolution Tiers

| Tier | Resolution | Use Case |
|------|-----------|----------|
| Low | 720p (1280x720) | Mobile minimum, Switch handheld |
| Standard | 1080p (1920x1080) | Mobile target, PC minimum, console base |
| High | 1440p (2560x1440) | PC target, PS5/Xbox Series quality mode |
| Ultra | 4K (3840x2160) | PC high-end, console performance target |

Test at minimum and target. If assets look acceptable at 720p and sharp at 1080p, the resolution tiers pass.

## Aspect Ratios

| Ratio | Width:Height | Common Devices |
|-------|-------------|---------------|
| 4:3   | 1.33:1      | iPad (all models) |
| 16:10 | 1.60:1      | Steam Deck (1280x800), some laptops |
| 16:9  | 1.78:1      | **Baseline** — most monitors, TVs, consoles |
| 18:9  | 2.00:1      | Modern Android phones |
| 19.5:9 | 2.17:1     | Modern iPhones |
| 21:9  | 2.33:1      | Ultrawide monitors |
| 32:9  | 3.56:1      | Super ultrawide monitors |

Strategy options:
1. **Pillarbox/letterbox**: Black bars, safe but wastes screen
2. **Expand viewport**: Show more of the game world, may reveal unintended areas
3. **Crop**: Fill screen but lose content at edges — dangerous for UI
4. **Hybrid**: Expand to a limit, then letterbox beyond that

Critical check: What happens at the widest AND narrowest supported ratio? Take screenshots of both.

## HDR Requirements

| Requirement | Spec |
|-------------|------|
| Peak brightness | Platform-specific (400-1000 nits typical) |
| Tone mapping | SDR content must render correctly in HDR mode |
| SDR fallback | Game must look correct with HDR disabled |
| Paper white | UI reference white should be ~200 nits, not peak |
| Color space | Rec. 2020 container, P3 gamut typical |

Common HDR bugs: UI looks washed out, bloom is overblown, dark areas crushed to pure black.

## Platform-Specific Gotchas

| Platform | Gotcha | Impact |
|----------|--------|--------|
| Steam Deck | 1280x800 (16:10), 7" screen | Font sizes designed for 1080p may be unreadable |
| Nintendo Switch | 720p handheld, 1080p docked | Must test BOTH modes; assets that look fine docked may be illegible handheld |
| iPad | 4:3 aspect ratio | Games designed for 16:9 will have significant vertical bars or layout issues |
| Older iPhones | Varied notch sizes | Test multiple notch generations, not just latest |
| Samsung foldables | Inner/outer screen ratio change | UI must adapt to dramatic aspect ratio shift |
| PS VR2 / Quest | Per-eye rendering, barrel distortion | UI placement must account for lens distortion |
| macOS Retina | 2x display scaling | Pixel art must render at integer multiples or will blur |
