import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatHistoryService } from './services/chat-history.service';
import { ConversationService } from './services/conversation.service';
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
  private conversationService = inject(ConversationService);
  conversations = signal<ConversationSummary[]>([]);
  sidebarCollapsed = signal(true);
  activeConversationId = signal<string | null>(null);
  activeConversation = signal<Conversation | null>(null);
  draft = signal('');
  isSending = signal(false);
  loadingConversationId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

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

  async sendMessage(event?: Event) {
    event?.preventDefault();
    const prompt = this.draft().trim();
    if (!prompt || this.isSending()) return;

    const current = this.activeConversation();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt
    };
    const pendingConversationId = current?.id ?? `pending-${Date.now()}`;
    const pendingConversation: Conversation = current
      ? { ...current, messages: [...current.messages, userMessage] }
      : {
          id: pendingConversationId,
          title: prompt.replace(/\s+/g, ' ').slice(0, 60),
          messages: [userMessage]
        };

    this.activeConversationId.set(pendingConversationId);
    this.activeConversation.set(pendingConversation);
    if (!current) {
      this.sidebarCollapsed.set(false);
    }
    this.draft.set('');
    this.errorMessage.set(null);
    this.isSending.set(true);
    this.loadingConversationId.set(pendingConversationId);

    try {
      let conversationId: string;
      let response: string;
      if (current) {
        const result = await this.conversationService.continueConversation(current.id, prompt);
        conversationId = current.id;
        response = result.response;
      } else {
        const result = await this.conversationService.startConversation('angular-tutor', prompt);
        conversationId = result.conversationId;
        response = result.response;
      }
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response
      };
      const completedConversation: Conversation = {
        ...pendingConversation,
        id: conversationId,
        messages: [...pendingConversation.messages, assistantMessage]
      };

      if (!current) {
        this.conversations.update((items) => [
          { id: conversationId, title: completedConversation.title },
          ...items.filter((item) => item.id !== conversationId)
        ]);
      }

      if (this.activeConversationId() === pendingConversationId) {
        this.activeConversationId.set(conversationId);
        this.activeConversation.set(completedConversation);
      }
    } catch (error) {
      console.error('Failed to send chat message', error);
      if (this.activeConversationId() === pendingConversationId) {
        this.activeConversationId.set(current?.id ?? null);
        this.activeConversation.set(current);
        this.draft.set(this.draft() || prompt);
        this.errorMessage.set('Unable to get a response. Please try again.');
      }
    } finally {
      this.isSending.set(false);
      this.loadingConversationId.set(null);
    }
  }

  startNewChat() {
    this.activeConversationId.set(null);
    this.activeConversation.set(null);
    this.draft.set('');
    this.errorMessage.set(null);
  }

  async selectConversation(conversationId: string) {
    this.activeConversationId.set(conversationId);
    this.activeConversation.set(null);
    this.errorMessage.set(null);
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