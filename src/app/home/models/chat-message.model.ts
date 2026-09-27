import type { ChatMessageRole } from './chat-message-role.model';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
};