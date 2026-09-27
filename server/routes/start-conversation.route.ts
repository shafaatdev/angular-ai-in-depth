import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { conversations } from '../db-data';
import { logger } from '../logger';
import { Conversation } from '../models/conversation.model';
import { StartConversationError, StartConversationRequest, StartConversationResponse } from '../models/start-conversation.model';
import { prompts } from '../prompts';
import { AssistantServiceError, getAssistantResponse } from '../services/assistant.service';

type StartConversationResult = StartConversationResponse | StartConversationError;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStartConversationRequest(value: unknown): value is StartConversationRequest {
  if (!isRecord(value)) return false;

  const hasExpectedKeys = Object.keys(value).every((key) => key === 'promptId' || key === 'message');
  const promptId = value['promptId'];
  const message = value['message'];

  return hasExpectedKeys &&
    typeof promptId === 'string' && promptId.trim().length > 0 && promptId.length <= 100 &&
    typeof message === 'string' && message.trim().length > 0 && message.length <= 8000;
}

export const startConversation: RequestHandler<unknown, StartConversationResult, unknown> = async (
  request,
  response
) => {
  const body: unknown = request.body;
  if (!isStartConversationRequest(body)) {
    logger.warn({ reason: 'invalid_request' }, 'Conversation start request rejected');
    response.status(400).json({ error: 'Provide a promptId and message.' });
    return;
  }

  const promptId = body.promptId.trim();
  const message = body.message.trim();
  const systemPrompt = prompts[promptId];

  if (!Object.hasOwn(prompts, promptId) || typeof systemPrompt !== 'string') {
    logger.warn({ promptId }, 'Conversation start request used an unknown prompt');
    response.status(404).json({ error: 'Prompt not found.' });
    return;
  }

  try {
    const assistantResponse = await getAssistantResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]);
    const conversationId = randomUUID();
    const conversation: Conversation = {
      id: conversationId,
      title: message.replace(/\s+/g, ' ').slice(0, 60),
      promptId,
      messages: [
        { id: randomUUID(), role: 'user', content: message },
        { id: randomUUID(), role: 'assistant', content: assistantResponse }
      ]
    };

    conversations.unshift(conversation);
    logger.info({ conversationId, promptId }, 'Conversation started');
    response.status(201).json({ conversationId, response: assistantResponse });
  } catch (error) {
    if (error instanceof AssistantServiceError) {
      const statusCode = error.code === 'configuration' ? 503 : error.code === 'timeout' ? 504 : 502;
      logger.error(
        { promptId, failure: error.code, upstreamStatus: error.upstreamStatus },
        'Assistant response request failed'
      );
      response.status(statusCode).json({ error: 'Unable to start a conversation right now.' });
      return;
    }

    logger.error(
      { promptId, errorName: error instanceof Error ? error.name : 'UnknownError' },
      'Conversation start failed unexpectedly'
    );
    response.status(500).json({ error: 'Unable to start a conversation right now.' });
  }
};