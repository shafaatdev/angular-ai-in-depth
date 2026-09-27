export type ContinueConversationRequest = {
  conversationId: string;
  message: string;
};

export type ContinueConversationResponse = {
  response: string;
};

export type ContinueConversationError = {
  error: string;
};