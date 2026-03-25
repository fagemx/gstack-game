# Gotchas

False positives, platform quirks, AI misjudgments, and scope traps for visual QA.

## False Positives (Intentional Art Choices)

These look like bugs but may be deliberate. Always ASK before flagging:

- **Deliberate pixel offset**: Hand-drawn or sketchy styles intentionally break grid alignment
- **Intentional screen shake**: Camera shake, hit feedback, and impact effects are features
- **Stylized color banding**: Posterization or limited palette can be an art choice (e.g., Return of the Obra Dinn)
- **Intentional aliasing**: Some pixel art games avoid anti-aliasing to maintain crispness
- **Frame rate limiting per element**: UI at 60fps but character animations at 12fps is a stylistic choice in some 2D games
- **Asymmetric UI**: Deliberately off-center or irregular layouts for artistic effect
- **Visible brush strokes / texture**: Painterly styles have intentional imperfection

Rule: If something looks wrong but is consistent across the game, it's likely intentional. Check art reference docs before flagging.

## Platform-Specific Quirks

| Quirk | Platforms | Impact |
|-------|----------|--------|
| Gamma differences | Mac displays brighter than Windows by default | Colors look different cross-platform; test on both |
| Color space (sRGB vs Display P3) | Mac, iPhone use P3; most PCs use sRGB | Saturated colors may look different or clipped |
| HDR brightness perception | HDR vs SDR displays | Bloom, glow, and UI brightness can look dramatically different |
| Font rendering | ClearType (Windows) vs Core Text (Mac) vs FreeType (Linux) | Same font renders with different weight and clarity |
| Display scaling | Windows 125/150%, macOS 2x, Android density buckets | UI elements may render at unexpected sizes |

## Common AI Misjudgments

When reviewing visual quality, AI frequently gets these wrong:

1. **Mixed-media styles**: 2D characters on 3D backgrounds, or pixel art UI on HD game — this is intentional in many games, not an inconsistency
2. **Limited-animation styles**: Cutout animation (South Park style), visual novel limited poses, or motion comic presentation intentionally have fewer frames
3. **Cultural art conventions**: Anime proportions, chibi style, super-deformed characters — proportional "inconsistency" is the style
4. **Retro aesthetic**: CRT scanlines, color palette limitations, dithering patterns are deliberate throwbacks
5. **Performance vs quality tradeoffs**: Lower-quality distant objects, simplified shadows on mobile — these are optimization choices, not bugs
6. **Art in progress**: Prototype or alpha art should be evaluated against its own stated quality target, not against final art standards

## Scope Traps

Avoid wasting review time on these:

- **Placeholder art**: Do not review programmer art or stock assets as if they were final. Ask: "Is this final art?" before scoring.
- **Non-final rigs**: Animation quality on WIP character rigs will change. Note issues but don't score harshly.
- **Non-target resolutions**: If the game targets 1080p mobile, don't penalize appearance at 4K on a 32" monitor.
- **Debug visualizations**: Collision boxes, nav meshes, frame rate counters left visible — flag for removal but don't score as visual bugs.
- **Unfinished screens**: If a screen is marked as "TODO" or "WIP" in the build, skip it or score separately.

Rule: Establish what is "in scope for review" in Step 0. Everything else gets noted but not scored.
