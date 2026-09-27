import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChatHistory } from '../chat-history/chat-history';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-side-navigation',
  imports: [NgOptimizedImage, ChatHistory],
  templateUrl: './side-navigation.html',
  styleUrl: './side-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavigation {
  collapsed = input(false);
  conversations = input.required<Conversation[]>();
  activeConversationId = input<string | null>(null);
  collapsedChange = output<boolean>();
  newChat = output();
  conversationSelected = output<string>();
  logout = output();
  searchOpen = signal(false);
  searchTerm = signal('');

  toggleSearch() {
    if (this.collapsed()) this.collapsedChange.emit(false);
    this.searchOpen.update((open) => !open);
    if (this.searchOpen()) this.searchTerm.set('');
  }

  updateSearch(event: Event) {
    if (event.target instanceof HTMLInputElement) this.searchTerm.set(event.target.value);
  }
}