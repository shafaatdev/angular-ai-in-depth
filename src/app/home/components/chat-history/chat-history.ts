import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'chat-history',
  imports: [],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHistory {
  conversations = input.required<Conversation[]>();
  activeConversationId = input<string | null>(null);
  searchTerm = input('');
  conversationSelected = output<string>();

  filteredConversations = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return this.conversations();

    return this.conversations().filter((conversation) =>
      conversation.title.toLowerCase().includes(query) ||
      conversation.messages.some((message) => message.content.toLowerCase().includes(query))
    );
  });
}