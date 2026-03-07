/**
 * CopilotKit Runtime Server
 *
 * Starts a local HTTP server that proxies LLM requests for the playground.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/copilot-runtime.ts
 *   ANTHROPIC_API_KEY=sk-... MODEL=claude-opus npx tsx scripts/copilot-runtime.ts
 *
 * Environment variables:
 *   OPENAI_API_KEY     — OpenAI API key (default provider)
 *   ANTHROPIC_API_KEY  — Anthropic API key (for Claude models)
 *   MODEL              — Model to use: gpt-4o, claude-opus, claude-sonnet (default: gpt-4o)
 *   PORT               — Server port (default: 4111)
 */
import { createServer } from 'node:http';
import {
  CopilotRuntime,
  OpenAIAdapter,
  AnthropicAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';

const PORT = parseInt(process.env.PORT ?? '4111', 10);
const MODEL = process.env.MODEL ?? 'gpt-4o';

function getAdapter() {
  if (MODEL.startsWith('claude')) {
    const modelName =
      MODEL === 'claude-opus' ? 'claude-opus-4-20250514' :
      MODEL === 'claude-sonnet' ? 'claude-sonnet-4-20250514' :
      MODEL;
    console.log(`Using Anthropic adapter with model: ${modelName}`);
    return new AnthropicAdapter({ model: modelName });
  }

  console.log(`Using OpenAI adapter with model: ${MODEL}`);
  return new OpenAIAdapter({ model: MODEL });
}

const runtime = new CopilotRuntime();
const adapter = getAdapter();

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
  console.log(`   Provider: ${MODEL.startsWith('claude') ? 'Anthropic' : 'OpenAI'}\n`);
});
