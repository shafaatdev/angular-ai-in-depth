import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { ConversationSummary } from '../models/conversation-summary.model';

@Injectable({ providedIn: 'root' })
export class ChatHistoryService {
  private http = inject(HttpClient);

  async getAllConversations() {
    return firstValueFrom(this.http.get<ConversationSummary[]>('/api/get-chat-history'));
  }

  async getConversationById(conversationId: string) {
    return firstValueFrom(
      this.http.get<Conversation>(`/api/get-chat-conversation/${encodeURIComponent(conversationId)}`)
    );
  }
}