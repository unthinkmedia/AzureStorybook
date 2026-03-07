/**
 * Token extraction script — pulls CSS custom properties from the Coherence CDN
 * and writes them to src/themes/coherenceTokens.ts
 *
 * Usage: npx tsx scripts/extract-tokens.ts
 *
 * This is a one-time extraction script. Re-run if the Coherence theme updates.
 */

const THEME_CSS_URL =
  'https://coherence-ftekb0dcfpcjb3gv.b02.azurefd.net/cdn/latest/themes/cui/theme.css';

interface TokenCategory {
  [key: string]: string;
}

async function extractTokens() {
  console.log('Fetching Coherence theme CSS...');
  const response = await fetch(THEME_CSS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch theme CSS: ${response.status} ${response.statusText}`);
  }

  const css = await response.text();

  // Parse all CSS custom properties
  const tokenRegex = /--([a-z0-9-]+)\s*:\s*([^;]+)/g;
  const tokens: Record<string, string> = {};
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(css)) !== null) {
    tokens[match[1]] = match[2].trim();
  }

  console.log(`Extracted ${Object.keys(tokens).length} tokens`);

  // Categorize
  const categories: Record<string, TokenCategory> = {
    brand: {},
    neutral: {},
    danger: {},
    success: {},
    warning: {},
    caution: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    borderWidth: {},
    shadows: {},
    duration: {},
    other: {},
  };

  for (const [name, value] of Object.entries(tokens)) {
    if (name.startsWith('color-brand-') && !name.includes('-alt')) {
      categories.brand[name.replace('color-brand-', '')] = value;
    } else if (name.startsWith('color-neutral-') && !name.includes('-alt')) {
      categories.neutral[name.replace('color-neutral-', '')] = value;
    } else if (name.startsWith('color-danger-') && !name.includes('-alt')) {
      categories.danger[name] = value;
    } else if (name.startsWith('color-success-') && !name.includes('-alt')) {
      categories.success[name] = value;
    } else if (name.startsWith('color-warning-') && !name.includes('-alt')) {
      categories.warning[name] = value;
    } else if (name.startsWith('color-caution-') && !name.includes('-alt')) {
      categories.caution[name] = value;
    } else if (name.startsWith('spacing-')) {
      categories.spacing[name] = value;
    } else if (
      name.startsWith('font-') ||
      name.startsWith('line-height-')
    ) {
      categories.typography[name] = value;
    } else if (name.startsWith('border-radius-')) {
      categories.borderRadius[name] = value;
    } else if (name.startsWith('border-width-')) {
      categories.borderWidth[name] = value;
    } else if (name.startsWith('shadow-') || name.startsWith('drop-shadow-')) {
      categories.shadows[name] = value;
    } else if (name.startsWith('duration-')) {
      categories.duration[name] = value;
    }
  }

  // Print summary
  for (const [cat, vals] of Object.entries(categories)) {
    const count = Object.keys(vals).length;
    if (count > 0) {
      console.log(`  ${cat}: ${count} tokens`);
    }
  }

  console.log('\nTokens are already hardcoded in src/themes/coherenceTokens.ts');
  console.log('To refresh, update that file with the values printed above.');
  console.log('\nBrand ramp:');
  for (const [step, hex] of Object.entries(categories.brand)) {
    console.log(`  ${step}: ${hex}`);
  }
}

extractTokens().catch(console.error);
