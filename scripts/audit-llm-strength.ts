/**
 * Storybook LLM Strength Auditor
 *
 * Analyzes a Storybook project and produces a scored report on how well
 * the design system is optimized for LLM/AI agent consumption.
 *
 * Usage: npx tsx scripts/audit-llm-strength.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

interface AuditResult {
  dimension: string;
  weight: number;
  score: number;
  maxScore: number;
  findings: string[];
  recommendations: string[];
}

function fileExists(rel: string): boolean {
  return fs.existsSync(path.resolve(ROOT, rel));
}

function findFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  const abs = path.resolve(ROOT, dir);
  if (!fs.existsSync(abs)) return results;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(path.relative(ROOT, full), ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function countFilesMatching(dir: string, ext: string, pattern: RegExp): number {
  return findFiles(dir, ext).filter((f) => pattern.test(fs.readFileSync(f, 'utf-8'))).length;
}

// ─── Dimension 1: Machine-Readable Metadata ───
function auditMetadata(): AuditResult {
  const result: AuditResult = {
    dimension: 'Machine-Readable Metadata',
    weight: 20,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  // index.json
  if (fileExists('storybook-static/index.json')) {
    result.score += 3;
    result.findings.push('✅ index.json manifest exists in storybook-static/');
  } else {
    result.recommendations.push('Run `npm run build` to generate storybook-static/index.json');
  }

  // component-registry.json
  if (fileExists('src/component-registry.json')) {
    result.score += 3;
    const reg = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'src/component-registry.json'), 'utf-8'));
    result.findings.push(`✅ component-registry.json exists (${reg.length} components)`);
  } else {
    result.recommendations.push('Run `npm run build:registry` to generate component-registry.json');
  }

  // project.json
  if (fileExists('storybook-static/project.json')) {
    result.score += 2;
    result.findings.push('✅ project.json metadata exists');
  } else {
    result.recommendations.push('Build Storybook to generate project.json');
  }

  // argTypes coverage
  const total = findFiles('src/stories', '.stories.tsx').length;
  const withArgTypes = countFilesMatching('src/stories', '.stories.tsx', /argTypes\s*[:{]/);
  const argPct = total > 0 ? (withArgTypes / total) * 100 : 0;
  result.findings.push(`argTypes: ${withArgTypes}/${total} stories (${argPct.toFixed(0)}%)`);
  if (argPct >= 50) result.score += 2;
  else if (argPct >= 25) result.score += 1;
  if (argPct < 50) {
    result.recommendations.push(
      `Add argTypes to ${total - withArgTypes} more stories — explicit controls help LLMs understand accepted prop values`
    );
  }

  return result;
}

// ─── Dimension 2: Documentation Quality ───
function auditDocumentation(): AuditResult {
  const result: AuditResult = {
    dimension: 'Documentation Quality',
    weight: 20,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  const total = findFiles('src/stories', '.stories.tsx').length;

  // Component-level description
  const withCompDesc = countFilesMatching(
    'src/stories',
    '.stories.tsx',
    /description:\s*\{[\s\S]*?component:\s*['"`]/
  );
  const descPct = total > 0 ? (withCompDesc / total) * 100 : 0;
  result.findings.push(`Component descriptions: ${withCompDesc}/${total} (${descPct.toFixed(0)}%)`);
  if (descPct >= 80) result.score += 3;
  else if (descPct >= 50) result.score += 2;
  else if (descPct >= 25) result.score += 1;

  // Story-level descriptions
  const withStoryDesc = countFilesMatching(
    'src/stories',
    '.stories.tsx',
    /description:\s*\{[\s\S]*?story:\s*['"`]/
  );
  result.findings.push(`Story-level descriptions: ${withStoryDesc}/${total}`);
  if (withStoryDesc >= total * 0.5) result.score += 2;
  else if (withStoryDesc >= total * 0.25) result.score += 1;

  // JSDoc
  const withJsDoc = countFilesMatching('src/stories', '.stories.tsx', /\/\*\*/);
  result.findings.push(`JSDoc comments: ${withJsDoc}/${total}`);
  if (withJsDoc >= total * 0.5) result.score += 2;
  else if (withJsDoc >= total * 0.25) result.score += 1;

  // "Use this when" guidance
  const withWhenGuidance = countFilesMatching(
    'src/stories',
    '.stories.tsx',
    /[Uu]se (this |it )when|[Cc]hoose this over|[Pp]refer .+ over/
  );
  result.findings.push(`"Use when..." guidance: ${withWhenGuidance}/${total}`);
  if (withWhenGuidance >= total * 0.3) result.score += 3;
  else if (withWhenGuidance > 0) result.score += 1;
  if (withWhenGuidance < total * 0.3) {
    result.recommendations.push(
      'Add "Use this when..." guidance to component descriptions — this is the #1 signal LLMs use to choose the right component'
    );
  }

  const missing = findFiles('src/stories', '.stories.tsx').filter(
    (f) => !/description:\s*\{[\s\S]*?component:\s*['"`]/.test(fs.readFileSync(f, 'utf-8'))
  );
  if (missing.length > 0) {
    result.recommendations.push(
      `Add component descriptions to: ${missing.map((f) => path.basename(f, '.stories.tsx')).join(', ')}`
    );
  }

  return result;
}

// ─── Dimension 3: LLM Context Files ───
function auditLlmContext(): AuditResult {
  const result: AuditResult = {
    dimension: 'LLM Context Files',
    weight: 15,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  const llmDir = path.resolve(ROOT, 'llm-context');
  if (!fs.existsSync(llmDir)) {
    result.recommendations.push('Create llm-context/ directory with theme, patterns, and styling docs');
    return result;
  }

  const files = fs.readdirSync(llmDir).filter((f) => f.endsWith('.md'));
  result.findings.push(`LLM context files: ${files.join(', ')}`);

  // Theme/token reference
  if (files.some((f) => /theme|token/i.test(f))) {
    result.score += 3;
    result.findings.push('✅ Theme/token reference file exists');
  } else {
    result.recommendations.push('Add a theme reference with brand colors, semantic tokens, typography, spacing');
  }

  // Component patterns
  if (files.some((f) => /pattern|component/i.test(f))) {
    result.score += 3;
    result.findings.push('✅ Component patterns file exists');
  } else {
    result.recommendations.push('Add a component patterns file with page hierarchy and composition rules');
  }

  // Styling guide
  if (files.some((f) => /styl/i.test(f))) {
    result.score += 2;
    result.findings.push('✅ Styling guide exists');
  } else {
    result.recommendations.push('Add a styling guide with Griffel patterns and anti-patterns');
  }

  // Composition rules
  if (files.some((f) => /compos|rule/i.test(f))) {
    result.score += 2;
    result.findings.push('✅ Composition rules file exists');
  } else {
    result.score += 0;
    result.recommendations.push(
      'Add composition-rules.md — document which components nest inside which, required parents, and slot conventions'
    );
  }

  return result;
}

// ─── Dimension 4: Story Structure & Naming ───
function auditStoryStructure(): AuditResult {
  const result: AuditResult = {
    dimension: 'Story Structure & Naming',
    weight: 15,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  const storyFiles = findFiles('src/stories', '.stories.tsx');
  const total = storyFiles.length;

  // CSF3 format
  const csf3 = countFilesMatching('src/stories', '.stories.tsx', /satisfies\s+Meta/);
  result.findings.push(`CSF3 format (satisfies Meta): ${csf3}/${total}`);
  if (csf3 >= total * 0.8) result.score += 2;
  else if (csf3 >= total * 0.5) result.score += 1;

  // Hierarchical titles
  const withTitle = countFilesMatching('src/stories', '.stories.tsx', /title:\s*['"][\w]+\//);
  result.findings.push(`Hierarchical titles: ${withTitle}/${total}`);
  if (withTitle >= total * 0.9) result.score += 2;
  else if (withTitle >= total * 0.5) result.score += 1;

  // Tags
  const withTags = countFilesMatching('src/stories', '.stories.tsx', /tags:\s*\[/);
  result.findings.push(`With tags: ${withTags}/${total}`);
  if (withTags >= total * 0.9) result.score += 2;
  else if (withTags >= total * 0.5) result.score += 1;

  // Descriptive names (check for bad patterns)
  const badNames = countFilesMatching(
    'src/stories',
    '.stories.tsx',
    /export\s+const\s+(Story\d+|Test\d*|Example\d+)\s*:/
  );
  if (badNames === 0) {
    result.score += 2;
    result.findings.push('✅ All story exports use descriptive names');
  } else {
    result.findings.push(`⚠️ ${badNames} stories use generic names (Story1, Test, Example)`);
    result.recommendations.push('Rename generic story exports to descriptive names');
  }

  // Variant coverage — check average stories per component
  let totalStories = 0;
  for (const f of storyFiles) {
    const content = fs.readFileSync(f, 'utf-8');
    const exports = [...content.matchAll(/^export\s+const\s+\w+\s*:\s*(?:Story|StoryObj)/gm)];
    totalStories += exports.length;
  }
  const avgVariants = total > 0 ? totalStories / total : 0;
  result.findings.push(`Average variants per component: ${avgVariants.toFixed(1)}`);
  if (avgVariants >= 3) result.score += 2;
  else if (avgVariants >= 2) result.score += 1;
  else {
    result.recommendations.push('Add more variant stories (edge cases: empty, error, loading, max data)');
  }

  return result;
}

// ─── Dimension 5: TypeScript Prop Extraction ───
function auditTypeScript(): AuditResult {
  const result: AuditResult = {
    dimension: 'TypeScript Prop Extraction',
    weight: 10,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  // react-docgen config
  const mainConfig = path.resolve(ROOT, '.storybook/main.ts');
  if (fs.existsSync(mainConfig)) {
    const content = fs.readFileSync(mainConfig, 'utf-8');
    if (/reactDocgen/.test(content)) {
      result.score += 3;
      result.findings.push('✅ react-docgen configured in .storybook/main.ts');
      if (/react-docgenx-typescript/.test(content)) {
        result.findings.push('⚠️ Using "react-docgenx-typescript" (note: typo? should be "react-docgen-typescript")');
      }
    } else {
      result.recommendations.push('Add reactDocgen: "react-docgen-typescript" to .storybook/main.ts');
    }
  }

  // Typed component props
  const componentFiles = findFiles('src/components', '.tsx');
  const withInterface = componentFiles.filter((f) =>
    /(?:interface|type)\s+\w+Props/.test(fs.readFileSync(f, 'utf-8'))
  ).length;
  result.findings.push(`Component files with typed Props: ${withInterface}/${componentFiles.length}`);
  if (withInterface >= componentFiles.length * 0.8) result.score += 3;
  else if (withInterface >= componentFiles.length * 0.5) result.score += 2;

  // Enum/union types (check for `string` props that should be unions)
  const withUnions = componentFiles.filter((f) =>
    /['"][^'"]+['"]\s*\|/.test(fs.readFileSync(f, 'utf-8'))
  ).length;
  result.findings.push(`Components with union/enum prop types: ${withUnions}/${componentFiles.length}`);
  if (withUnions >= componentFiles.length * 0.3) result.score += 2;
  else result.score += 1;

  // Default values in stories
  const withDefaults = countFilesMatching('src/stories', '.stories.tsx', /args:\s*\{/);
  const totalStories = findFiles('src/stories', '.stories.tsx').length;
  result.findings.push(`Stories with default args: ${withDefaults}/${totalStories}`);
  if (withDefaults >= totalStories * 0.5) result.score += 2;
  else if (withDefaults >= totalStories * 0.25) result.score += 1;

  return result;
}

// ─── Dimension 6: Composition & Templates ───
function auditComposition(): AuditResult {
  const result: AuditResult = {
    dimension: 'Composition & Templates',
    weight: 10,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  // Full-page templates
  const fullscreen = countFilesMatching('src/stories', '.stories.tsx', /layout:\s*['"]fullscreen['"]/);
  result.findings.push(`Fullscreen template stories: ${fullscreen}`);
  if (fullscreen >= 3) result.score += 3;
  else if (fullscreen >= 1) result.score += 2;
  else result.recommendations.push('Add fullscreen template stories showing complete page layouts');

  // Template category
  const templateFiles = findFiles('src/stories/templates', '.stories.tsx').length;
  result.findings.push(`Template stories: ${templateFiles}`);
  if (templateFiles >= 3) result.score += 3;
  else if (templateFiles >= 1) result.score += 2;

  // Container/layout stories
  const containerFiles = findFiles('src/stories/templates', '.stories.tsx').filter((f) =>
    /container|layout/i.test(path.basename(f))
  ).length;
  result.findings.push(`Container/layout stories: ${containerFiles}`);
  if (containerFiles >= 2) result.score += 2;
  else if (containerFiles >= 1) result.score += 1;

  // Realistic data (check for non-lorem data)
  const withRealisticData = countFilesMatching('src/stories', '.stories.tsx', /Azure|resource|subscription|region|East US|West US/i);
  const totalStories = findFiles('src/stories', '.stories.tsx').length;
  result.findings.push(`Stories with domain-realistic data: ${withRealisticData}/${totalStories}`);
  if (withRealisticData >= totalStories * 0.3) result.score += 2;
  else if (withRealisticData > 0) result.score += 1;

  return result;
}

// ─── Dimension 7: Cross-Workspace Accessibility ───
function auditCrossWorkspace(): AuditResult {
  const result: AuditResult = {
    dimension: 'Cross-Workspace Access',
    weight: 10,
    score: 0,
    maxScore: 10,
    findings: [],
    recommendations: [],
  };

  // Built static output
  if (fileExists('storybook-static/index.html')) {
    result.score += 2;
    result.findings.push('✅ Built storybook-static/ exists');
  } else {
    result.recommendations.push('Run `npm run build` to create deployable static output');
  }

  // Machine endpoints
  if (fileExists('storybook-static/index.json')) {
    result.score += 1;
    result.findings.push('✅ /index.json machine endpoint available');
  }
  if (fileExists('storybook-static/project.json')) {
    result.score += 1;
    result.findings.push('✅ /project.json machine endpoint available');
  }

  // LLM context bundle
  if (fileExists('public/llm-context-bundle.json') || fileExists('storybook-static/llm-context-bundle.json')) {
    result.score += 3;
    result.findings.push('✅ LLM context bundle exists (single-fetch for agents)');
  } else {
    result.recommendations.push(
      'Generate LLM context bundle: `npx tsx scripts/generate-llm-bundle.ts` — this creates a single JSON file agents can fetch'
    );
  }

  // SWA config for hosting
  if (fileExists('staticwebapp.config.json')) {
    result.score += 1;
    result.findings.push('✅ Azure Static Web App config exists');
  }

  // CORS configuration
  if (fileExists('staticwebapp.config.json')) {
    const swaConfig = fs.readFileSync(path.resolve(ROOT, 'staticwebapp.config.json'), 'utf-8');
    if (/Access-Control|cors/i.test(swaConfig)) {
      result.score += 2;
      result.findings.push('✅ CORS headers configured');
    } else {
      result.recommendations.push(
        'Add CORS headers to staticwebapp.config.json for cross-origin agent fetch: ' +
        '{ "globalHeaders": { "Access-Control-Allow-Origin": "*" } }'
      );
    }
  }

  return result;
}

// ─── Main ───

function run() {
  console.log('\n🔍 Storybook LLM Strength Audit\n');
  console.log('═'.repeat(60));

  const results = [
    auditMetadata(),
    auditDocumentation(),
    auditLlmContext(),
    auditStoryStructure(),
    auditTypeScript(),
    auditComposition(),
    auditCrossWorkspace(),
  ];

  let weightedTotal = 0;
  let weightSum = 0;

  for (const r of results) {
    const normalized = (r.score / r.maxScore) * 10;
    const weighted = normalized * (r.weight / 100);
    weightedTotal += weighted;
    weightSum += r.weight;

    console.log(`\n┌─ ${r.dimension} (${r.score}/${r.maxScore}) ─ weight: ${r.weight}%`);
    for (const f of r.findings) {
      console.log(`│  ${f}`);
    }
    if (r.recommendations.length > 0) {
      console.log('│');
      console.log('│  Recommendations:');
      for (const rec of r.recommendations) {
        console.log(`│  → ${rec}`);
      }
    }
    console.log('└' + '─'.repeat(58));
  }

  const overall = (weightedTotal / (weightSum / 100)) * (100 / 100);
  console.log('\n' + '═'.repeat(60));
  console.log(`\n  Overall LLM Strength Score: ${overall.toFixed(1)}/10\n`);

  // Rating
  if (overall >= 8) console.log('  Rating: 🟢 EXCELLENT — Agents can confidently use this design system');
  else if (overall >= 6) console.log('  Rating: 🟡 GOOD — Agents can use most components but may miss nuances');
  else if (overall >= 4) console.log('  Rating: 🟠 FAIR — Agents will struggle with composition and edge cases');
  else console.log('  Rating: 🔴 NEEDS WORK — Agents cannot reliably use this design system');

  // Top 3 recommendations
  const allRecs = results
    .sort((a, b) => a.score / a.maxScore - b.score / b.maxScore)
    .flatMap((r) => r.recommendations);

  if (allRecs.length > 0) {
    console.log('\n  Top Recommendations:');
    for (const rec of allRecs.slice(0, 5)) {
      console.log(`  • ${rec}`);
    }
  }

  console.log('');
}

run();
