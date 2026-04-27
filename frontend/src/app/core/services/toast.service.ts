import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();
  private nextId = 0;

  show(type: Toast['type'], message: string, title?: string, duration = 4000) {
    const id = ++this.nextId;
    this._toasts.update(t => [...t, { id, type, message, title, duration }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, title = 'Success') { this.show('success', message, title); }
  error(message: string, title = 'Error')     { this.show('error',   message, title); }
  info(message: string, title = 'Info')       { this.show('info',    message, title); }
  warning(message: string, title = 'Warning') { this.show('warning', message, title); }

  dismiss(id: number) {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
