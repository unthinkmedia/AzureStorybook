import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { azureLightTheme } from '../../themes';
import { AgentPlayground } from '../../playground/AgentPlayground';

export default {
  title: 'Playground/Agent Chat',
  component: AgentPlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Interactive playground for building Azure Portal pages with Copilot.

## How it works
1. **Chat** (left panel): Describe a page — the LLM generates a PageSpec JSON using the Pydantic schema
2. **Preview** (right panel): The spec renders live using real Storybook components
3. **Clarification**: If the LLM is unsure about a section, it asks follow-up questions

## Setup
Start the CopilotKit runtime server in a separate terminal:

\`\`\`bash
# OpenAI (default)
OPENAI_API_KEY=sk-... npx tsx scripts/copilot-runtime.ts

# Anthropic Claude
ANTHROPIC_API_KEY=sk-... MODEL=claude-opus npx tsx scripts/copilot-runtime.ts
\`\`\`

Then open this story. The playground connects to \`http://localhost:4111/api/copilotkit\`.

## Features
- **Model picker**: Switch between GPT-4o, Claude Opus, Claude Sonnet, etc.
- **Preset loader**: Load example PageSpec files to see the preview instantly
- **Live editing**: Ask the LLM to modify sections and see changes in real-time
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <FluentProvider theme={azureLightTheme}>
        <Story />
      </FluentProvider>
    ),
  ],
  argTypes: {
    runtimeUrl: {
      control: 'text',
      description: 'CopilotKit runtime URL',
    },
  },
} satisfies Meta<typeof AgentPlayground>;

type Story = StoryObj<typeof AgentPlayground>;

/** Default playground with local runtime. */
export const Default: Story = {
  args: {
    runtimeUrl: 'http://localhost:4111/api/copilotkit',
  },
};

/** Playground pointed at a custom runtime endpoint. */
export const CustomEndpoint: Story = {
  args: {
    runtimeUrl: 'https://your-api.azurewebsites.net/api/copilotkit',
  },
};
