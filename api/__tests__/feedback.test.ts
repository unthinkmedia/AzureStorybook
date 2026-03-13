import { feedbackHandler } from '../src/functions/feedback';
import { InvocationContext } from '@azure/functions';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function makeRequest(body: unknown) {
  return {
    json: async () => body,
    text: async () => JSON.stringify(body),
    method: 'POST',
    url: 'http://localhost:7071/api/feedback',
    headers: new Headers({ 'content-type': 'application/json' }),
  } as any;
}

const mockContext = {
  error: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
} as unknown as InvocationContext;

describe('feedbackHandler', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env.GITHUB_TOKEN = 'test-token-fake';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GITHUB_TOKEN;
  });

  it('returns 200 for valid submission', async () => {
    (fetch as any).mockResolvedValue({ ok: true, status: 204 });
    const req = makeRequest({
      event: 'submit',
      annotations: [
        {
          id: 'a1',
          comment: 'test',
          elementPath: 'div',
          element: 'div',
          timestamp: 123,
        },
      ],
      url: 'http://localhost:6006',
      timestamp: Date.now(),
      output: '## Test',
    });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(200);
    expect(result.jsonBody).toEqual({ ok: true });
  });

  it('returns 400 for empty annotations', async () => {
    const req = makeRequest({ event: 'submit', annotations: [] });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(400);
    expect((result.jsonBody as any).error).toMatch(/No annotations/i);
  });

  it('returns 400 when event field is missing', async () => {
    const req = makeRequest({
      annotations: [
        {
          id: 'a1',
          comment: 'x',
          elementPath: 'div',
          element: 'div',
          timestamp: 1,
        },
      ],
    });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(400);
  });

  it('returns 400 for wrong event type', async () => {
    const req = makeRequest({
      event: 'annotation.add',
      annotations: [
        {
          id: 'a1',
          comment: 'x',
          elementPath: 'div',
          element: 'div',
          timestamp: 1,
        },
      ],
    });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(400);
  });

  it('returns 502 when GitHub API returns error', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
    });
    const req = makeRequest({
      event: 'submit',
      annotations: [
        {
          id: 'a1',
          comment: 'test',
          elementPath: 'div',
          element: 'div',
          timestamp: 1,
        },
      ],
      url: 'http://localhost:6006',
      timestamp: Date.now(),
      output: '',
    });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(502);
    expect((result.jsonBody as any).error).toBe('Failed to dispatch to GitHub');
  });

  it('returns 502 when fetch throws (network error)', async () => {
    (fetch as any).mockRejectedValue(new Error('Network failure'));
    const req = makeRequest({
      event: 'submit',
      annotations: [
        {
          id: 'a1',
          comment: 'test',
          elementPath: 'div',
          element: 'div',
          timestamp: 1,
        },
      ],
      url: 'http://localhost:6006',
      timestamp: Date.now(),
      output: '',
    });
    const result = await feedbackHandler(req, mockContext);
    expect(result.status).toBe(502);
  });
});
