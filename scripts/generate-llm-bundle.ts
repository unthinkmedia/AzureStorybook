/**
 * Generates llm-context-bundle.json from all LLM context sources.
 * Combines registry, theme tokens, patterns, styling guide, and MDX guidelines
 * into a single machine-readable file for cross-workspace agent consumption.
 *
 * Usage: npx tsx scripts/generate-llm-bundle.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function run() {
  // 1. Component registry
  const registryPath = path.join(ROOT, 'src', 'component-registry.json');
  const registry = fs.existsSync(registryPath)
    ? JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
    : [];

  // 2. LLM context markdown files
  const llmDir = path.join(ROOT, 'llm-context');
  const contextFiles: Record<string, string> = {};
  if (fs.existsSync(llmDir)) {
    for (const file of fs.readdirSync(llmDir)) {
      if (file.endsWith('.md')) {
        const key = file.replace('.md', '');
        contextFiles[key] = fs.readFileSync(path.join(llmDir, file), 'utf-8');
      }
    }
  }

  // 3. MDX guideline docs
  const guidelinesDir = path.join(ROOT, 'src', 'stories', 'guidelines');
  const guidelines: { name: string; content: string }[] = [];
  if (fs.existsSync(guidelinesDir)) {
    for (const file of fs.readdirSync(guidelinesDir)) {
      if (file.endsWith('.mdx')) {
        guidelines.push({
          name: file.replace('.mdx', ''),
          content: fs.readFileSync(path.join(guidelinesDir, file), 'utf-8'),
        });
      }
    }
  }

  // 4. Extract story descriptions from story files
  const storiesDir = path.join(ROOT, 'src', 'stories');
  const componentDocs: Record<string, { description: string; stories: string[] }> = {};

  function scanStories(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanStories(full);
      } else if (entry.name.endsWith('.stories.tsx')) {
        const content = fs.readFileSync(full, 'utf-8');
        const name = entry.name.replace('.stories.tsx', '');

        // Extract component description
        const descMatch = content.match(
          /description:\s*\{[\s\S]*?component:\s*['"`]([\s\S]*?)['"`]/,
        );
        // Extract story exports
        const storyNames = [
          ...content.matchAll(/^export\s+const\s+(\w+)\s*:\s*(?:Story|StoryObj)/gm),
        ].map((m) => m[1]);

        componentDocs[name] = {
          description: descMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
          stories: storyNames,
        };
      }
    }
  }
  scanStories(storiesDir);

  const themeRegistry = {
    products: [
      {
        id: 'azure',
        displayName: 'Azure',
        description: 'Default Azure Portal theme — Coherence design system tokens',
      },
      {
        id: 'logic-apps',
        displayName: 'Logic Apps',
        description: 'Azure Logic Apps — workflow automation product theme (placeholder tokens)',
      },
    ],
    appearances: ['light', 'dark', 'high-contrast'],
    resolver: 'resolveTheme(productId, appearanceMode) → Theme',
    note: 'Import from @azure-fluent-storybook/components: { resolveTheme, registerProductTheme }',
  };

  const bundle = {
    generatedAt: new Date().toISOString(),
    version: '2.0.0',
    registry,
    componentDocs,
    themeRegistry,
    context: contextFiles,
    guidelines: guidelines.map((g) => ({ name: g.name, content: g.content })),
  };

  // Write to storybook-static (for deployed Storybook) and project root (for local use)
  const staticOut = path.join(ROOT, 'storybook-static', 'llm-context-bundle.json');
  const publicOut = path.join(ROOT, 'public', 'llm-context-bundle.json');

  fs.writeFileSync(publicOut, JSON.stringify(bundle, null, 2));
  console.log(`LLM bundle → ${publicOut} (served at /llm-context-bundle.json)`);

  if (fs.existsSync(path.join(ROOT, 'storybook-static'))) {
    fs.writeFileSync(staticOut, JSON.stringify(bundle, null, 2));
    console.log(`LLM bundle → ${staticOut} (static build)`);
  }

  // Print summary
  console.log(`\n  Components: ${registry.length}`);
  console.log(`  Context files: ${Object.keys(contextFiles).length}`);
  console.log(`  Guidelines: ${guidelines.length}`);
  console.log(`  Component docs: ${Object.keys(componentDocs).length}`);
  console.log(`  Theme products: ${themeRegistry.products.length}`);
  console.log(`  Appearances: ${themeRegistry.appearances.length}`);
  const withDesc = Object.values(componentDocs).filter((d) => d.description).length;
  console.log(`  With descriptions: ${withDesc}/${Object.keys(componentDocs).length}`);
}

run();
