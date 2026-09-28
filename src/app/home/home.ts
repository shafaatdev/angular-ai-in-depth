import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatHistoryService } from './services/chat-history.service';
import { ChatMessage } from './models/chat-message.model';
import { Conversation } from './models/conversation.model';
import { ConversationSummary } from './models/conversation-summary.model';
import { ConversationThread } from './components/conversation-thread/conversation-thread';
import { EmptyState } from './components/empty-state/empty-state';
import { SideNavigation } from './components/side-navigation/side-navigation';

@Component({
  selector: 'home',
  imports: [ConversationThread, EmptyState, SideNavigation],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private chatHistoryService = inject(ChatHistoryService);
  conversations = signal<ConversationSummary[]>([]);
  sidebarCollapsed = signal(true);
  activeConversationId = signal<string | null>(null);
  activeConversation = signal<Conversation | null>(null);
  draft = signal('');

  constructor() {
    void this.loadConversations();
  }

  async loadConversations() {
    try {
      this.conversations.set(await this.chatHistoryService.getAllConversations());
    } catch (error) {
      console.error('Failed to load chat history', error);
    }
  }

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
      this.activeConversation.set(updated);
    } else {
      const conversation: Conversation = {
        id: `conversation-${Date.now()}`,
        title: prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt,
        messages: [userMessage, reply]
      };
      this.conversations.update((items) => [
        { id: conversation.id, title: conversation.title },
        ...items
      ]);
      this.activeConversationId.set(conversation.id);
      this.activeConversation.set(conversation);
      this.sidebarCollapsed.set(false);
    }

    this.draft.set('');
  }

  startNewChat() {
    this.activeConversationId.set(null);
    this.activeConversation.set(null);
    this.draft.set('');
  }

  async selectConversation(conversationId: string) {
    this.activeConversationId.set(conversationId);
    this.activeConversation.set(null);
    this.sidebarCollapsed.set(false);

    try {
      const conversation = await this.chatHistoryService.getConversationById(conversationId);
      if (this.activeConversationId() === conversationId) {
        this.activeConversation.set(conversation);
      }
    } catch (error) {
      console.error('Failed to load conversation', error);
      if (this.activeConversationId() === conversationId) {
        this.activeConversationId.set(null);
      }
    }
  }

  logout() {
    this.startNewChat();
    this.sidebarCollapsed.set(true);
  }
}