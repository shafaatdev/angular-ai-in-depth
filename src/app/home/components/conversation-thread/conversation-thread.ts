import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'conversation-thread',
  imports: [NgOptimizedImage],
  templateUrl: './conversation-thread.html',
  styleUrl: './conversation-thread.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationThread {
  conversation = input.required<Conversation>();
}