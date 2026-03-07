/**
 * AgentPlayground — Split-pane chat + live preview.
 * Left: CopilotKit chat that generates PageSpec JSON via tool calls.
 * Right: Live PageSpecRenderer preview that updates in real-time.
 */
import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Dropdown,
  Option,
  Label,
} from '@fluentui/react-components';
import { Delete20Regular } from '@fluentui/react-icons';
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

import { PageSpecRenderer } from './PageSpecRenderer';
import { PAGE_SPEC_SYSTEM_PROMPT } from './systemPrompt';
import type { PageSpec } from './types';

// ─── Example specs for quick-load ────────────────────────────────

import resourceGroupsSpec from '../../schemas/examples/resource-groups-list.json';
import monitorOverviewSpec from '../../schemas/examples/monitor-overview.json';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },

  // ── Left panel: chat ──
  chatPanel: {
    width: '420px',
    minWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  chatTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  chatBody: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  configBar: {
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'wrap',
  },

  // ── Right panel: preview ──
  previewPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  previewBody: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
});

// ─── Models ──────────────────────────────────────────────────────

const MODEL_OPTIONS = [
  { key: 'gpt-4o', label: 'GPT-4o' },
  { key: 'gpt-4.1', label: 'GPT-4.1' },
  { key: 'claude-opus', label: 'Claude Opus' },
  { key: 'claude-sonnet', label: 'Claude Sonnet' },
  { key: 'o3', label: 'o3' },
];

// ─── Example presets ─────────────────────────────────────────────

const EXAMPLE_PRESETS = [
  { key: 'resource-groups', label: 'Resource Groups List', spec: resourceGroupsSpec as unknown as PageSpec },
  { key: 'monitor-overview', label: 'Monitor Overview', spec: monitorOverviewSpec as unknown as PageSpec },
];

// ─── Inner component (inside CopilotKit provider) ────────────────

interface PlaygroundInnerProps {
  pageSpec: PageSpec | null;
  setPageSpec: (spec: PageSpec | null) => void;
  selectedModel: string;
}

const PlaygroundInner: React.FC<PlaygroundInnerProps> = ({
  pageSpec,
  setPageSpec,
  selectedModel,
}) => {
  const styles = useStyles();

  // Make the current page spec readable by the LLM
  useCopilotReadable({
    description: 'The current PageSpec JSON being previewed. If null, no page is loaded.',
    value: pageSpec ? JSON.stringify(pageSpec) : 'No page spec loaded yet.',
  });

  // Register the action that the LLM uses to update the preview
  useCopilotAction({
    name: 'updatePageSpec',
    description:
      'Update the live preview with a new or modified PageSpec JSON. ' +
      'Call this when you have gathered enough information to generate a page. ' +
      'The spec must conform to the PageSpec schema.',
    parameters: [
      {
        name: 'spec',
        type: 'object',
        description: 'A complete PageSpec JSON object conforming to the schema.',
        required: true,
      },
    ],
    handler: async ({ spec }: { spec: object }) => {
      setPageSpec(spec as PageSpec);
      return 'Page updated in preview panel.';
    },
  });

  // Register an action to ask the user clarification questions
  useCopilotAction({
    name: 'askClarification',
    description:
      'Ask the user targeted clarification questions when the request is ambiguous. ' +
      'Use this before generating a PageSpec if you need more details about layout, ' +
      'body template, tabs, actions, or content.',
    parameters: [
      {
        name: 'questions',
        type: 'object[]',
        description: 'Array of question objects, each with a "question" string and optional "options" string array.',
        required: true,
      },
    ],
    handler: async ({ questions }: { questions: Array<{ question: string; options?: string[] }> }) => {
      // Questions are rendered inline in chat by CopilotKit
      return questions.map((q) =>
        q.options
          ? `${q.question}\nOptions: ${q.options.join(', ')}`
          : q.question
      ).join('\n\n');
    },
  });

  return (
    <div className={styles.chatBody}>
      <CopilotChat
        instructions={PAGE_SPEC_SYSTEM_PROMPT}
        labels={{
          title: 'Page Builder',
          initial: 'Describe the Azure Portal page you want to build. I\'ll generate a live preview.\n\nExamples:\n• "Build the Resource Groups list page"\n• "Create a Monitor Overview page with tabs"\n• "Design a settings page for Microsoft Entra ID"',
          placeholder: 'Describe a page to build...',
        }}
        className="h-full"
      />
    </div>
  );
};

// ─── Main Playground (wraps CopilotKit provider) ─────────────────

export interface AgentPlaygroundProps {
  /** CopilotKit runtime URL */
  runtimeUrl?: string;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({
  runtimeUrl = 'http://localhost:4111/api/copilotkit',
}) => {
  const styles = useStyles();
  const [pageSpec, setPageSpec] = useState<PageSpec | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  const handleReset = useCallback(() => {
    setPageSpec(null);
  }, []);

  const handleLoadPreset = useCallback((spec: PageSpec) => {
    setPageSpec(spec);
  }, []);

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <div className={styles.root}>
        {/* ── LEFT: Chat Panel ── */}
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <CopilotGradientIcon />
              <Text weight="semibold" size={400}>Page Builder Playground</Text>
            </div>
            <Button
              appearance="subtle"
              icon={<Delete20Regular />}
              size="small"
              onClick={handleReset}
              aria-label="Reset"
            />
          </div>

          {/* Config bar */}
          <div className={styles.configBar}>
            <Label size="small">Model:</Label>
            <Dropdown
              size="small"
              value={MODEL_OPTIONS.find((m) => m.key === selectedModel)?.label ?? selectedModel}
              selectedOptions={[selectedModel]}
              onOptionSelect={(_, data) => setSelectedModel(data.optionValue ?? 'gpt-4o')}
              style={{ minWidth: 130 }}
            >
              {MODEL_OPTIONS.map((m) => (
                <Option key={m.key} value={m.key}>{m.label}</Option>
              ))}
            </Dropdown>
            <Label size="small" style={{ marginLeft: 8 }}>Load:</Label>
            {EXAMPLE_PRESETS.map((p) => (
              <Button
                key={p.key}
                size="small"
                appearance="subtle"
                onClick={() => handleLoadPreset(p.spec)}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <PlaygroundInner
            pageSpec={pageSpec}
            setPageSpec={setPageSpec}
            selectedModel={selectedModel}
          />
        </div>

        {/* ── RIGHT: Preview Panel ── */}
        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <Text weight="semibold" size={300}>Live Preview</Text>
            <div className={styles.statusBadge}>
              <div
                className={styles.statusDot}
                style={{ backgroundColor: pageSpec ? tokens.colorPaletteGreenForeground1 : tokens.colorNeutralForeground4 }}
              />
              {pageSpec ? `${pageSpec.service_name} — ${pageSpec.page_type}` : 'No page loaded'}
            </div>
          </div>
          <div className={styles.previewBody}>
            <PageSpecRenderer spec={pageSpec} />
          </div>
        </div>
      </div>
    </CopilotKit>
  );
};

// ─── Small Copilot gradient icon ─────────────────────────────────

const CopilotGradientIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="pg-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6264A7" />
        <stop offset="0.5" stopColor="#A45EDB" />
        <stop offset="1" stopColor="#E0588E" />
      </linearGradient>
    </defs>
    <path
      d="M19.75 3H8.81c-3.13 0-5 4.09-6.25 8.18C1.08 16.02-.86 22.5 4.75 22.5h4.91c1.3 0 2.44-.86 2.8-2.11.82-2.82 2.29-7.89 3.44-11.74.57-1.92 1.05-3.57 1.78-4.6A2.94 2.94 0 0 1 19.75 3Z"
      fill="url(#pg-grad)" opacity="0.7"
    />
    <path
      d="M12.25 29h10.93c3.13 0 5-4.09 6.25-8.18 1.48-4.85 3.42-11.32-2.18-11.32h-4.91c-1.3 0-2.45.86-2.81 2.11-.81 2.82-2.28 7.89-3.44 11.74-.57 1.92-1.05 3.57-1.78 4.59A2.94 2.94 0 0 1 12.25 29Z"
      fill="url(#pg-grad)"
    />
  </svg>
);
