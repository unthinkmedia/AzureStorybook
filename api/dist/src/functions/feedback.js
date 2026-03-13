"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackHandler = feedbackHandler;
const functions_1 = require("@azure/functions");
const MAX_PAYLOAD_BYTES = 1000000;
const DISPATCH_URL = 'https://api.github.com/repos/unthinkmedia/AzureStorybook/dispatches';
async function feedbackHandler(request, context) {
    let body;
    try {
        body = (await request.json());
    }
    catch {
        return { status: 400, jsonBody: { error: 'Invalid JSON body' } };
    }
    if (JSON.stringify(body).length > MAX_PAYLOAD_BYTES) {
        return { status: 413, jsonBody: { error: 'Payload too large' } };
    }
    if (body.event !== 'submit') {
        return { status: 400, jsonBody: { error: 'Invalid event type' } };
    }
    const annotations = Array.isArray(body.annotations) ? body.annotations : null;
    if (!annotations || annotations.length === 0) {
        return { status: 400, jsonBody: { error: 'No annotations to submit' } };
    }
    const output = body.output;
    const url = body.url;
    const timestamp = body.timestamp;
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        context.error('Missing GITHUB_TOKEN for feedback dispatch');
        return { status: 500, jsonBody: { error: 'Server configuration error' } };
    }
    try {
        const response = await fetch(DISPATCH_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'agentation_feedback',
                client_payload: { output, annotations, url, timestamp },
            }),
        });
        if (!response.ok) {
            context.error('GitHub repository_dispatch failed', {
                status: response.status,
                statusText: response.statusText,
            });
            return { status: 502, jsonBody: { error: 'Failed to dispatch to GitHub' } };
        }
    }
    catch (error) {
        context.error('Error calling GitHub repository_dispatch', error);
        return { status: 502, jsonBody: { error: 'Failed to dispatch to GitHub' } };
    }
    return { status: 200, jsonBody: { ok: true } };
}
functions_1.app.http('feedback', {
    methods: ['POST'],
    route: 'feedback',
    handler: feedbackHandler,
});
//# sourceMappingURL=feedback.js.map