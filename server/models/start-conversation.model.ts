export type StartConversationRequest = {
  promptId: string;
  message: string;
};

export type StartConversationResponse = {
  conversationId: string;
  response: string;
};

export type StartConversationError = {
  error: string;
};