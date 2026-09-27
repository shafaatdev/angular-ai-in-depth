import { RequestHandler } from 'express';
import { conversations } from '../db-data';
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
    response.status(404).json({ error: 'Conversation not found' });
    return;
  }

  response.json({
    ...conversation,
    messages: conversation.messages.filter((message) => message.role !== 'system')
  });
};