# Visual Thresholds

Quantifiable visual quality minimums. Use these as pass/fail criteria — not suggestions.

## Font Size Minimums (by resolution)

| Resolution | Body Text Min | Heading Min | HUD/Label Min | Tooltip Min |
|------------|--------------|-------------|---------------|-------------|
| 720p       | 14px         | 18px        | 12px          | 11px        |
| 1080p      | 16px         | 20px        | 14px          | 12px        |
| 1440p      | 18px         | 24px        | 16px          | 14px        |
| 4K         | 24px         | 32px        | 20px          | 18px        |

Rule: If text is unreadable at arm's length on target device, it fails regardless of pixel count.

## Touch/Click Target Minimums

| Platform      | Minimum Size | Minimum Spacing |
|---------------|-------------|-----------------|
| iOS           | 44pt x 44pt | 8pt between targets |
| Android       | 48dp x 48dp | 8dp between targets |
| PC (mouse)    | 24px x 24px | 4px between targets |
| Console (D-pad) | N/A (focus-based) | Clear focus indicator required |

Common failure: Button visual is 32px but tap area is also 32px. Visual can be smaller than tap area — tap area cannot be smaller than minimum.

## Color Contrast Ratios (WCAG AA)

| Element Type        | Minimum Ratio | Example Pass | Example Fail |
|--------------------|---------------|-------------|-------------|
| Body text          | 4.5:1         | #333 on #FFF (12.6:1) | #999 on #FFF (2.8:1) |
| Large text (>=18px bold, >=24px) | 3:1 | #666 on #FFF (5.7:1) | #AAA on #FFF (2.3:1) |
| UI components      | 3:1           | Button border visible | Ghost button on light bg |
| Non-essential decorative | No minimum | — | — |

Game exception: In-world text (signs, graffiti, environmental storytelling) follows art direction, not WCAG. HUD/UI text always follows WCAG.

## Pixel Alignment

| Context          | Tolerance |
|------------------|-----------|
| UI elements      | 0px — must snap to pixel grid |
| Pixel art sprites | 0px — sub-pixel = visible blur |
| 3D UI overlays   | 1px — rendering can shift slightly |
| Game world objects | Art-direction dependent |

Test: Screenshot at 1x zoom. If any UI element has blurry edges from sub-pixel positioning, it fails.

## Icon Legibility

| Context        | Minimum Size | With Label | Without Label |
|----------------|-------------|-----------|---------------|
| Toolbar/menu   | 24px        | OK at 20px | Must be 24px+ |
| HUD            | 32px        | OK at 24px | Must be 32px+ |
| Mobile primary | 44px        | OK at 32px | Must be 44px+ |

Rule: If an icon requires a tooltip to identify, it needs either a label or a redesign.

## Text Readability

- Maximum line length: 60-80 characters (including spaces)
- Minimum line height: 1.4x font size (body), 1.2x (headings)
- Paragraph spacing: >= 0.5x font size between paragraphs
- Text should never touch container edges — minimum padding 8px
