import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MOCK_CONVERSATIONS } from './data/mock-conversations';
import { ChatMessage } from './models/chat-message.model';
import { Conversation } from './models/conversation.model';
import { ConversationThread } from './components/conversation-thread/conversation-thread';
import { EmptyState } from './components/empty-state/empty-state';
import { SideNavigation } from './components/side-navigation/side-navigation';

@Component({
  selector: 'app-home',
  imports: [ConversationThread, EmptyState, SideNavigation],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  conversations = signal(MOCK_CONVERSATIONS);
  sidebarCollapsed = signal(true);
  activeConversationId = signal<string | null>(null);
  draft = signal('');
  activeConversation = computed(() =>
    this.conversations().find((conversation) => conversation.id === this.activeConversationId()) ?? null
  );

  updateDraft(event: Event) {
    if (event.target instanceof HTMLTextAreaElement) this.draft.set(event.target.value);
  }

  handleComposerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(event?: Event) {
    event?.preventDefault();
    const prompt = this.draft().trim();
    if (!prompt) return;

    const current = this.activeConversation();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt
    };
    const reply: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: 'Thanks for your question. This is a local preview, so no live AI service is connected.'
    };

    if (current) {
      const updated: Conversation = {
        ...current,
        messages: [...current.messages, userMessage, reply]
      };
      this.conversations.update((items) => items.map((item) => item.id === current.id ? updated : item));
    } else {
      const conversation: Conversation = {
        id: `conversation-${Date.now()}`,
        title: prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt,
        messages: [userMessage, reply]
      };
      this.conversations.update((items) => [conversation, ...items]);
      this.activeConversationId.set(conversation.id);
      this.sidebarCollapsed.set(false);
    }

    this.draft.set('');
  }

  startNewChat() {
    this.activeConversationId.set(null);
    this.draft.set('');
  }

  selectConversation(conversationId: string) {
    this.activeConversationId.set(conversationId);
    this.sidebarCollapsed.set(false);
  }

  logout() {
    this.startNewChat();
    this.sidebarCollapsed.set(true);
  }
}