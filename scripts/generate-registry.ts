/**
 * Generates component-registry.json from story files.
 * Reads all *.stories.tsx and extracts metadata for LLM context.
 *
 * Usage: npx tsx scripts/generate-registry.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ComponentEntry {
  name: string;
  category: string;
  storyFile: string;
  stories: string[];
  isComposed: boolean;
  tags: string[];
}

const SRC = path.resolve(import.meta.dirname, '..', 'src');
const OUT = path.resolve(import.meta.dirname, '..', 'src', 'component-registry.json');

function findStoryFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findStoryFiles(full));
    } else if (entry.name.endsWith('.stories.tsx')) {
      results.push(full);
    }
  }
  return results;
}

function extractStoryNames(content: string): string[] {
  const matches = content.matchAll(/^export\s+const\s+(\w+)\s*:\s*Story/gm);
  return [...matches].map((m) => m[1]);
}

function categoryFromPath(filePath: string): string {
  const rel = path.relative(SRC, filePath);
  const parts = rel.split(path.sep);
  // stories/foundations/Colors.stories.tsx → Foundations
  if (parts.length >= 2 && parts[0] === 'stories') {
    return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return 'Other';
}

function run() {
  const files = findStoryFiles(path.join(SRC, 'stories'));
  const registry: ComponentEntry[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(path.resolve(SRC, '..'), file);
    const name = path.basename(file, '.stories.tsx');
    const category = categoryFromPath(file);
    const stories = extractStoryNames(content);

    registry.push({
      name,
      category,
      storyFile: rel,
      stories,
      isComposed: category.toLowerCase() === 'composed' || category.toLowerCase() === 'templates',
      tags: [category.toLowerCase(), ...(category.toLowerCase() === 'composed' ? ['azure-specific'] : [])],
    });
  }

  fs.writeFileSync(OUT, JSON.stringify(registry, null, 2));
  console.log(`Registry generated: ${registry.length} components → ${OUT}`);
}

run();
