import { RequestHandler } from 'express';
import { conversations } from '../db-data';
import { logger } from '../logger';
import { ConversationSummary } from '../models/conversation.model';

export const getChatHistory: RequestHandler<unknown, ConversationSummary[]> = (_request, response) => {
  const history = conversations.map(({ id, title }) => ({ id, title }));
  logger.info({ conversationCount: history.length }, 'Chat history retrieved');
  response.json(history);
};