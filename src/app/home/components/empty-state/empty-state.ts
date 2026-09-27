import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'empty-state',
  imports: [NgOptimizedImage],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {}