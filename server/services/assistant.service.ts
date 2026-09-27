import type { ChatMessage } from '../models/conversation.model';

export type AssistantServiceErrorCode =
  | 'configuration'
  | 'timeout'
  | 'unavailable'
  | 'upstream'
  | 'invalid-response';

export class AssistantServiceError extends Error {
  constructor(
    readonly code: AssistantServiceErrorCode,
    readonly upstreamStatus?: number
  ) {
    super(code);
    this.name = 'AssistantServiceError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readAssistantResponse(payload: unknown) {
  if (!isRecord(payload) || !Array.isArray(payload['choices'])) return;

  const firstChoice: unknown = payload['choices'][0];
  if (!isRecord(firstChoice)) return;

  const message: unknown = firstChoice['message'];
  if (!isRecord(message)) return;

  const content = message['content'];
  return typeof content === 'string' && content.trim() ? content.trim() : undefined;
}

export async function getAssistantResponse(messages: Pick<ChatMessage, 'role' | 'content'>[]) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new AssistantServiceError('configuration');

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
        messages
      }),
      signal: AbortSignal.timeout(30_000)
    });
  } catch (error) {
    const code = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'unavailable';
    throw new AssistantServiceError(code);
  }

  if (!upstreamResponse.ok) {
    throw new AssistantServiceError('upstream', upstreamResponse.status);
  }

  let payload: unknown;
  try {
    payload = await upstreamResponse.json();
  } catch {
    throw new AssistantServiceError('invalid-response');
  }

  const assistantResponse = readAssistantResponse(payload);
  if (!assistantResponse) throw new AssistantServiceError('invalid-response');

  return assistantResponse;
}