import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((module) => module.Home)
  },
  { path: '**', redirectTo: '/home' }
];
