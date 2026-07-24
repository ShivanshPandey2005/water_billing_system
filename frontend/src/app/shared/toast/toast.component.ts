import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { 
  LucideAngularModule, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X 
} from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts(); trackBy: trackByFn"
        class="toast glass-card"
        [class]="'toast-' + toast.type"
        (click)="toastService.dismiss(toast.id)">
        <div class="toast-icon-box">
          <lucide-icon [name]="icon(toast.type)" size="20"></lucide-icon>
        </div>
        <div class="toast-content">
          <h4 class="toast-title" *ngIf="toast.title">{{ toast.title }}</h4>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" (click)="$event.stopPropagation(); toastService.dismiss(toast.id)">
          <lucide-icon name="x" size="14"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 380px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      pointer-events: all;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(100%) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }

    .toast-icon-box {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Type styles */
    .toast-success .toast-icon-box { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .toast-success { border-left: 4px solid #10b981; }

    .toast-error .toast-icon-box { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .toast-error { border-left: 4px solid #ef4444; }

    .toast-info .toast-icon-box { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .toast-info { border-left: 4px solid #38bdf8; }

    .toast-warning .toast-icon-box { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .toast-warning { border-left: 4px solid #f59e0b; }

    .toast-content { flex: 1; }
    .toast-title {
      font-size: 0.9rem;
      font-weight: 700;
      margin: 0 0 2px;
      color: var(--text-main);
    }
    .toast-message {
      font-size: 0.85rem;
      margin: 0;
      color: var(--text-subtle);
      line-height: 1.4;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: var(--transition);
    }

    .toast-close:hover {
      background: var(--bg-elevated);
      color: var(--text-main);
    }

    @media (max-width: 480px) {
      .toast-container {
        width: calc(100% - 48px);
        left: 24px;
        right: 24px;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  trackByFn(_: number, t: Toast) { return t.id; }

  icon(type: Toast['type']): string {
    return { 
      success: 'check-circle-2', 
      error: 'alert-circle', 
      info: 'info', 
      warning: 'alert-triangle' 
    }[type];
  }
}
