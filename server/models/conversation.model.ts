export type ChatMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  promptId: string;
  messages: ChatMessage[];
};

export type ConversationSummary = Pick<Conversation, 'id' | 'title'>;