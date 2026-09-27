import { RequestHandler } from 'express';
import { conversations } from '../db-data';
import { logger } from '../logger';
import { Conversation } from '../models/conversation.model';

type ConversationParams = {
  id: string;
};

type ConversationError = {
  error: string;
};

export const getChatConversation: RequestHandler<
  ConversationParams,
  Conversation | ConversationError
> = (request, response) => {
  const conversation = conversations.find((item) => item.id === request.params.id);

  if (!conversation) {
    logger.warn({ conversationId: request.params.id }, 'Conversation lookup failed');
    response.status(404).json({ error: 'Conversation not found' });
    return;
  }

  const messages = conversation.messages.filter((message) => message.role !== 'system');
  logger.info(
    { conversationId: conversation.id, messageCount: messages.length },
    'Conversation retrieved'
  );
  response.json({
    ...conversation,
    messages
  });
};