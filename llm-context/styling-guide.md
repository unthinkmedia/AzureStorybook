# Styling Guide — Azure Storybook

## CSS-in-JS (Griffel)
Always use `makeStyles` for component styles:
```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '16px',
    borderRadius: tokens.borderRadiusMedium,
  },
});
```

## Token Usage
- Never hardcode colors — always use `tokens.*` from Fluent
- For brand-specific values not in tokens, use the Azure brand ramp hex values
- For spacing, use 4px increments (4, 8, 12, 16, 24, 32)
- For border radius: `tokens.borderRadiusSmall` (2px), `tokens.borderRadiusMedium` (4px), `tokens.borderRadiusLarge` (8px)

## Icons
- Import from `@fluentui/react-icons`
- Default to `24Regular` variants: `Add24Regular`, `Delete24Regular`
- Use `20Regular` for small/compact UI
- Use `24Filled` for active/selected states

## Layout Conventions
- Full-page layouts: `height: 100vh`, flex column
- Content area: flex: 1, overflow: auto
- Card grids: CSS Grid with auto-fill, minmax 280px
- Side panels: fixed 220px width, flex-shrink: 0

## Dark Theme
The FluentProvider handles all token resolution automatically.
Write styles using tokens, and dark/HC themes work without extra code.
