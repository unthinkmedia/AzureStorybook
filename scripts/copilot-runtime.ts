/**
 * CopilotKit Runtime Server
 *
 * Starts a local HTTP server that proxies LLM requests for the playground.
 *
 * Usage:
 *   # GitHub Models (uses your org GitHub account — same as VS Code Copilot)
 *   GITHUB_TOKEN=ghp_... npx tsx scripts/copilot-runtime.ts
 *   GITHUB_TOKEN=ghp_... MODEL=claude-opus npx tsx scripts/copilot-runtime.ts
 *
 *   # Direct OpenAI
 *   OPENAI_API_KEY=sk-... npx tsx scripts/copilot-runtime.ts
 *
 *   # Direct Anthropic
 *   ANTHROPIC_API_KEY=sk-... MODEL=claude-opus npx tsx scripts/copilot-runtime.ts
 *
 *   # Azure OpenAI (uses Entra ID / managed identity)
 *   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com AZURE_DEPLOYMENT=gpt-4o npx tsx scripts/copilot-runtime.ts
 *
 * Environment variables:
 *   GITHUB_TOKEN           — GitHub PAT (enables GitHub Models — same account as VS Code Copilot)
 *   OPENAI_API_KEY         — OpenAI API key (direct)
 *   ANTHROPIC_API_KEY      — Anthropic API key (for Claude models direct)
 *   AZURE_OPENAI_ENDPOINT  — Azure OpenAI endpoint URL (uses DefaultAzureCredential)
 *   AZURE_DEPLOYMENT       — Azure OpenAI deployment name
 *   MODEL                  — Model name: gpt-4o, claude-opus, claude-sonnet, o3 (default: gpt-4o)
 *   PORT                   — Server port (default: 4111)
 */
import 'dotenv/config';
import { createServer } from 'node:http';
import OpenAI from 'openai';
import { createOpenAI } from '@ai-sdk/openai';
import {
  CopilotRuntime,
  OpenAIAdapter,
  AnthropicAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';

const PORT = parseInt(process.env.PORT ?? '4111', 10);
const MODEL = process.env.MODEL ?? 'gpt-4o';

// GitHub Models endpoint — OpenAI-compatible, uses your GitHub PAT
const GITHUB_MODELS_BASE_URL = 'https://models.inference.ai.azure.com';

function detectProvider(): string {
  if (process.env.AZURE_OPENAI_ENDPOINT) return 'azure';
  if (process.env.GITHUB_TOKEN) return 'github';
  if (process.env.ANTHROPIC_API_KEY && MODEL.startsWith('claude')) return 'anthropic';
  return 'openai';
}

function getAdapter() {
  const provider = detectProvider();

  if (provider === 'anthropic') {
    const modelName =
      MODEL === 'claude-opus' ? 'claude-opus-4-20250514' :
      MODEL === 'claude-sonnet' ? 'claude-sonnet-4-20250514' :
      MODEL;
    console.log(`Using Anthropic adapter with model: ${modelName}`);
    return { adapter: new AnthropicAdapter({ model: modelName }), provider };
  }

  if (provider === 'github') {
    // GitHub Models — OpenAI-compatible endpoint, authenticated with GitHub PAT
    const ghModel =
      MODEL === 'claude-opus' ? 'claude-opus-4-20250514' :
      MODEL === 'claude-sonnet' ? 'claude-sonnet-4-20250514' :
      MODEL;
    console.log(`Using GitHub Models with model: ${ghModel}`);
    const openai = new OpenAI({
      apiKey: process.env.GITHUB_TOKEN,
      baseURL: GITHUB_MODELS_BASE_URL,
    });
    const adapter = new OpenAIAdapter({ openai, model: ghModel });

    // Override getLanguageModel to force Chat Completions API.
    // @ai-sdk/openai v3 defaults to the Responses API (/v1/responses)
    // which GitHub Models doesn't support.
    (adapter as any).getLanguageModel = () => {
      return createOpenAI({
        baseURL: GITHUB_MODELS_BASE_URL,
        apiKey: process.env.GITHUB_TOKEN,
        compatibility: 'compatible',
      })(ghModel);
    };

    return { adapter, provider };
  }

  if (provider === 'azure') {
    // Azure OpenAI — uses DefaultAzureCredential (your Entra ID / org account)
    const deployment = process.env.AZURE_DEPLOYMENT ?? MODEL;
    console.log(`Using Azure OpenAI: ${process.env.AZURE_OPENAI_ENDPOINT} deployment: ${deployment}`);
    return {
      adapter: new OpenAIAdapter({
        model: deployment,
        configuration: {
          baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${deployment}`,
          defaultQuery: { 'api-version': '2024-10-21' },
          defaultHeaders: {
            'api-key': process.env.AZURE_OPENAI_KEY ?? '',
          },
        },
      } as any),
      provider,
    };
  }

  console.log(`Using OpenAI adapter with model: ${MODEL}`);
  return { adapter: new OpenAIAdapter({ model: MODEL }), provider };
}

const runtime = new CopilotRuntime();
const { adapter, provider } = getAdapter();

const server = createServer((req, res) => {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: '/api/copilotkit',
    runtime,
    serviceAdapter: adapter,
  });

  return handler(req, res);
});

server.listen(PORT, () => {
  console.log(`\n🤖 CopilotKit Runtime ready at http://localhost:${PORT}/api/copilotkit`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Provider: ${provider}\n`);
});
