import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContinueConversationResponse } from '../models/continue-conversation-response.model';
import { StartConversationResponse } from '../models/start-conversation-response.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private http = inject(HttpClient);

  async startConversation(promptId: string, message: string) {
    return firstValueFrom(
      this.http.post<StartConversationResponse>('/api/start-conversation', { promptId, message })
    );
  }

  async continueConversation(conversationId: string, message: string) {
    return firstValueFrom(
      this.http.post<ContinueConversationResponse>('/api/continue-conversation', {
        conversationId,
        message
      })
    );
  }
}