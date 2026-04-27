import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [class]="type">
      
      <!-- Table Skeleton -->
      <ng-container *ngIf="type === 'table'">
        <div class="sk-table-header">
          <div class="sk-item h-4 w-1/4"></div>
          <div class="sk-item h-4 w-1/3"></div>
          <div class="sk-item h-4 w-1/6"></div>
          <div class="sk-item h-4 w-1/6"></div>
        </div>
        <div class="sk-table-row" *ngFor="let r of rows()">
          <div class="sk-item h-4 w-1/4"></div>
          <div class="sk-item h-4 w-1/3"></div>
          <div class="sk-item h-4 w-1/6"></div>
          <div class="sk-item h-6 w-1/6 rounded-full"></div>
        </div>
      </ng-container>

      <!-- KPI Grid Skeleton -->
      <ng-container *ngIf="type === 'kpi'">
        <div class="sk-kpi-grid">
          <div class="sk-kpi-card glass-card" *ngFor="let c of [1,2,3]">
            <div class="sk-kpi-icon h-12 w-12 rounded-xl"></div>
            <div class="sk-kpi-content">
              <div class="sk-item h-3 w-20 mb-2"></div>
              <div class="sk-item h-8 w-32 mb-1"></div>
              <div class="sk-item h-3 w-16"></div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Profile Section Skeleton -->
      <ng-container *ngIf="type === 'profile'">
        <div class="sk-profile-flex">
          <div class="sk-item h-24 w-24 rounded-full"></div>
          <div class="sk-profile-info">
            <div class="sk-item h-6 w-48 mb-3"></div>
            <div class="sk-item h-4 w-32"></div>
          </div>
        </div>
      </ng-container>

      <!-- Generic Card Skeleton -->
      <ng-container *ngIf="type === 'cards'">
        <div class="sk-generic-card glass-card" *ngFor="let c of rows()">
          <div class="sk-item h-5 w-3/4 mb-3"></div>
          <div class="sk-item h-4 w-1/2"></div>
        </div>
      </ng-container>

      <!-- Chart Skeleton -->
      <ng-container *ngIf="type === 'chart'">
        <div class="sk-chart-wrap">
          <div class="sk-chart-bars">
            <div class="sk-item sk-bar" *ngFor="let b of [60,80,45,90,70,55]" [style.height.%]="b"></div>
          </div>
        </div>
      </ng-container>

    </div>
  `,
  styles: [`
    .skeleton-container { width: 100%; }

    /* Base Shimmer Item */
    .sk-item {
      position: relative;
      overflow: hidden;
      background: var(--bg-surface);
      border-radius: 6px;
    }
    .sk-item::after {
      content: "";
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.03) 20%,
        rgba(255, 255, 255, 0.06) 50%,
        rgba(255, 255, 255, 0.03) 80%,
        transparent 100%
      );
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }

    /* Utilitiy Classes */
    .h-3 { height: 12px; }
    .h-4 { height: 16px; }
    .h-5 { height: 20px; }
    .h-6 { height: 24px; }
    .h-8 { height: 32px; }
    .h-12 { height: 48px; }
    .h-24 { height: 96px; }
    .w-12 { width: 48px; }
    .w-16 { width: 64px; }
    .w-20 { width: 80px; }
    .w-24 { width: 96px; }
    .w-32 { width: 128px; }
    .w-48 { width: 192px; }
    .w-1\\/2 { width: 50%; }
    .w-1\\/3 { width: 33.33%; }
    .w-1\\/4 { width: 25%; }
    .w-1\\/6 { width: 16.66%; }
    .w-3\\/4 { width: 75%; }
    .w-full { width: 100%; }
    .rounded-full { border-radius: 9999px; }
    .rounded-xl { border-radius: 12px; }
    .mb-1 { margin-bottom: 4px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }

    /* Table Component */
    .sk-table-header { display: flex; gap: 20px; padding: 16px 24px; border-bottom: 1px solid var(--border); opacity: 0.5; }
    .sk-table-row { display: flex; gap: 20px; padding: 16px 24px; border-bottom: 1px solid var(--border); }

    /* KPI Grid */
    .sk-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .sk-kpi-card { padding: 24px; display: flex; align-items: center; gap: 20px; }
    .sk-kpi-icon { background: var(--bg-surface); }
    .sk-kpi-content { flex: 1; }

    /* Profile Section */
    .sk-profile-flex { display: flex; align-items: center; gap: 24px; padding: 12px; }
    .sk-profile-info { flex: 1; }

    /* Chart Section */
    .sk-chart-wrap { height: 200px; padding: 24px; background: var(--bg-surface); border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: flex-end; }
    .sk-chart-bars { width: 100%; display: flex; align-items: flex-end; justify-content: space-around; height: 100%; }
    .sk-bar { width: 12%; min-height: 20px; }

    /* Generic Cards */
    .sk-generic-card { padding: 24px; margin-bottom: 16px; }
  `]
})
export class SkeletonComponent {
  @Input() type: 'table' | 'kpi' | 'cards' | 'profile' | 'chart' = 'table';
  @Input() count = 5;
  
  rows = computed(() => Array(this.count).fill(0));
}

