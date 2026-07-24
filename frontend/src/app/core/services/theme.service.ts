import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>((localStorage.getItem('aquasmart-theme') as Theme) || 'dark');

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('aquasmart-theme', t);
    });
    // Apply on init
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggle() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
