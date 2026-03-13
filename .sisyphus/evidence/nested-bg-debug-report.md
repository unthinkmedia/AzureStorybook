# DOM Background Color Analysis Report
## Storybook Docs Page - Dark Mode - Button Component

**Date**: 2026-03-13
**URL**: `http://localhost:6006/?path=/docs/components-buttons-button--docs&globals=productTheme:azure;appearanceMode:dark`
**Appearance Mode**: Dark

---

## FINDING: Nested Element with Non-#0A0A0A Background

### Root Element: `.docs-story`
- **Tag**: `DIV`
- **Class**: `docs-story css-kdwx3d`
- **Computed Background**: `rgb(10, 10, 10)` ✓ (Correct - matches #0A0A0A)
- **Inline Style Background**: None

### Problematic Nested Element: `.fui-FluentProvider`

**Location in DOM tree:**
```
.docs-story (rgb(10, 10, 10) ✓)
  └── DIV.css-1cvjpgl
      └── DIV.css-16dhyxt
          └── DIV.innerZoomElementWrapper
              └── DIV
                  └── DIV.sb-story.sb-unstyled
                      └── DIV#story--components-buttons-button--primary--primary-inner
                          └── DIV.fui-FluentProvider ⚠️ ISSUE HERE
                              └── BUTTON.fui-Button (rgb(17, 94, 163))
```

**Element Details:**
- **Tag**: `DIV`
- **Full Class**: `fui-FluentProvider fui-FluentProviderr6 ___jdtuxv0_17k0bs4 f19n0e5 fxugw4r f1o700av fk6fouc fkhj508 figsok6 f1i3iumi`
- **ID**: None
- **Computed Background-Color**: `rgb(41, 41, 41)` ⚠️ **ISSUE - Not #0A0A0A**
- **Inline Style `backgroundColor`**: None
- **Style Attribute**: None (inherited from CSS classes)

### CSS Custom Variables on FluentProvider:
```
--colorNeutralBackground1: #292929  (rgb(41, 41, 41))
--colorNeutralBackground2: #1f1f1f  (rgb(31, 31, 31))
--colorNeutralBackground3: #141414  (rgb(20, 20, 20))
--colorSubtleBackground: transparent
```

---

## Background Colors Found in `.docs-story` Tree:

| Color | RGB | Hex | Location | Count |
|-------|-----|-----|----------|-------|
| `rgb(10, 10, 10)` | ✓ **Correct** | #0A0A0A | `.docs-story` root | 1 |
| `rgb(41, 41, 41)` | ⚠️ **ISSUE** | #292929 | `.fui-FluentProvider` | 1 |
| `rgb(17, 94, 163)` | - | #115EA3 | Button component | 1 |
| `rgb(255, 255, 255)` | - | #FFFFFF | Code display area | 2 |

---

## Root Cause Analysis

The **Fluent UI FluentProvider component** (a decorator wrapper for each story) renders with its own background color class that applies `#292929` (rgb(41, 41, 41)) through the Fluent dark theme CSS.

This is applied via the CSS-in-JS classes:
- `___jdtuxv0_17k0bs4` - Likely a generated class from Fluent UI's theming system
- Other `f*` prefixed classes (atomic CSS classes)

The FluentProvider is NOT getting the #0A0A0A dark background because:
1. The `.docs-story` container was updated to #0A0A0A
2. But the FluentProvider DIV inside it still uses the Fluent dark theme's default background
3. These are two separate theming systems that need to be coordinated

---

## Solution Recommendation

Update the `.fui-FluentProvider` background via CSS override in `preview.css`:

```css
.docs-story .fui-FluentProvider {
  background-color: #0A0A0A !important;
}
```

Or hook into Fluent's theme tokens to set the dark background consistently.

---

## Screenshot Evidence
See: `nested-bg-debug.png`
