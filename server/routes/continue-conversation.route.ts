import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { conversations } from '../db-data';
import { logger } from '../logger';
import type { ChatMessage } from '../models/conversation.model';
import type {
  ContinueConversationError,
  ContinueConversationRequest,
  ContinueConversationResponse
} from '../models/continue-conversation.model';
import { prompts } from '../prompts';
import { AssistantServiceError, getAssistantResponse } from '../services/assistant.service';

type ContinueConversationResult = ContinueConversationResponse | ContinueConversationError;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isContinueConversationRequest(value: unknown): value is ContinueConversationRequest {
  if (!isRecord(value)) return false;

  const hasExpectedKeys = Object.keys(value).every((key) => key === 'conversationId' || key === 'message');
  const conversationId = value['conversationId'];
  const message = value['message'];

  return hasExpectedKeys &&
    typeof conversationId === 'string' && conversationId.trim().length > 0 && conversationId.length <= 100 &&
    typeof message === 'string' && message.trim().length > 0 && message.length <= 8000;
}

function getClientStatus(error: AssistantServiceError) {
  if (error.code === 'configuration') return 503;
  if (error.code === 'timeout') return 504;
  return 502;
}

export const continueConversation: RequestHandler<unknown, ContinueConversationResult, unknown> = async (
  request,
  response
) => {
  const body: unknown = request.body;
  if (!isContinueConversationRequest(body)) {
    logger.warn({ reason: 'invalid_request' }, 'Conversation continuation request rejected');
    response.status(400).json({ error: 'Provide a conversationId and message.' });
    return;
  }

  const conversationId = body.conversationId.trim();
  const message = body.message.trim();
  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation) {
    logger.warn({ conversationId }, 'Conversation continuation request used an unknown conversation');
    response.status(404).json({ error: 'Conversation not found.' });
    return;
  }

  const systemPrompt = prompts[conversation.promptId];
  if (!Object.hasOwn(prompts, conversation.promptId) || typeof systemPrompt !== 'string') {
    logger.error({ conversationId, promptId: conversation.promptId }, 'Conversation prompt is unavailable');
    response.status(500).json({ error: 'Unable to continue this conversation right now.' });
    return;
  }

  const userMessage: ChatMessage = {
    id: randomUUID(),
    role: 'user',
    content: message
  };

  try {
    const assistantResponse = await getAssistantResponse([
      { role: 'system', content: systemPrompt },
      ...conversation.messages
        .filter((item) => item.role !== 'system')
        .map(({ role, content }) => ({ role, content })),
      { role: 'user', content: userMessage.content }
    ]);

    const assistantMessage: ChatMessage = {
      id: randomUUID(),
      role: 'assistant',
      content: assistantResponse
    };
    conversation.messages.push(userMessage, assistantMessage);

    logger.info({ conversationId, promptId: conversation.promptId }, 'Conversation continued');
    response.json({ response: assistantResponse });
  } catch (error) {
    if (error instanceof AssistantServiceError) {
      logger.error(
        {
          conversationId,
          failure: error.code,
          upstreamStatus: error.upstreamStatus
        },
        'Assistant response request failed'
      );
      response.status(getClientStatus(error)).json({ error: 'Unable to continue this conversation right now.' });
      return;
    }

    logger.error(
      { conversationId, errorName: error instanceof Error ? error.name : 'UnknownError' },
      'Conversation continuation failed unexpectedly'
    );
    response.status(500).json({ error: 'Unable to continue this conversation right now.' });
  }
};