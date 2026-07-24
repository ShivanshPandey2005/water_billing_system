import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { UsageDialogComponent } from './usage-dialog.component';
import { 
  LucideAngularModule, 
  Droplets, 
  Plus, 
  Search, 
  Filter, 
  History, 
  BarChart3, 
  Smartphone, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-angular';

interface UsageWithFlat {
  _id: string;
  flatId: string;
  flatNumber: string;
  ownerName: string;
  reading: number;
  readingDate: Date;
}

@Component({
  selector: 'app-manage-usage',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    LucideAngularModule
  ],
  template: `
    <div class="feature-shell animate-slide-up">
      
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-info">
          <h1 class="page-title">Meter Readings</h1>
          <p class="text-subtle">Record and monitor real-time water consumption</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openUsageDialog()" [disabled]="flats().length === 0">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Record Reading
          </button>
        </div>
      </header>

      <!-- Stats Overview -->
      <div class="stats-grid" *ngIf="usage().length > 0">
        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap blue">
            <lucide-icon name="history" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Total Readings</span>
            <h3 class="kpi-value">{{ usage().length }}</h3>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap purple">
            <lucide-icon name="layers" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Active Flats</span>
            <h3 class="kpi-value">{{ uniqueFlatsCount() }}</h3>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap green">
            <lucide-icon name="droplets" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Total Volume</span>
            <h3 class="kpi-value">{{ totalReading() | number:'1.1-1' }} <span class="unit">m³</span></h3>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <section class="glass-card filter-bar">
        <div class="search-input-group">
          <lucide-icon name="search" size="18" class="text-muted"></lucide-icon>
          <input type="text" placeholder="Search by flat or date..." class="saas-input">
        </div>
        <div class="filter-actions">
          <button class="btn-icon-only">
            <lucide-icon name="filter" size="18"></lucide-icon>
          </button>
        </div>
      </section>

      <!-- Table Section -->
      <div class="glass-card table-section">
        <table mat-table [dataSource]="usage()" class="saas-table">
          
          <ng-container matColumnDef="flatNumber">
            <th mat-header-cell *matHeaderCellDef>Flat</th>
            <td mat-cell *matCellDef="let u">
              <div class="flat-pill">
                <lucide-icon name="smartphone" size="12"></lucide-icon>
                {{ u.flatNumber }}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="ownerName">
            <th mat-header-cell *matHeaderCellDef>Owner</th>
            <td mat-cell *matCellDef="let u" class="text-main font-medium">
              {{ u.ownerName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="reading">
            <th mat-header-cell *matHeaderCellDef>Reading</th>
            <td mat-cell *matCellDef="let u">
              <div class="reading-indicator">
                <span class="vol-text">{{ u.reading | number:'1.1-1' }}</span>
                <span class="unit-text">m³</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="readingDate">
            <th mat-header-cell *matHeaderCellDef>Record Date</th>
            <td mat-cell *matCellDef="let u">
              <div class="date-chip">
                <lucide-icon name="calendar" size="14"></lucide-icon>
                {{ u.readingDate | date:'dd MMM yyyy, h:mm a' }}
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="saas-row"></tr>
        </table>

        <!-- Loading State -->
        <div *ngIf="loading()" class="state-container">
          <div class="saas-loader"></div>
          <p>Analyzing meter data...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="usage().length === 0 && !loading()" class="state-container">
          <div class="empty-art">
            <lucide-icon name="droplets" size="48"></lucide-icon>
          </div>
          <h3>No consumption data</h3>
          <p>Start recording meter readings to see usage analytics.</p>
          <button class="btn-primary" (click)="openUsageDialog()" [disabled]="flats().length === 0">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Record First Reading
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .feature-shell {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 8px;
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--text-main);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: var(--transition);
    }

    .kpi-card:hover { transform: translateY(-4px); }

    .kpi-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-icon-wrap.blue   { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .kpi-icon-wrap.purple { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
    .kpi-icon-wrap.green  { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .kpi-content { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; }
    .kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .kpi-value .unit { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }

    .filter-bar { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }

    .search-input-group {
      flex: 1;
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
    }

    .saas-input { background: transparent; border: none; color: var(--text-main); padding: 10px 0; width: 100%; font-size: 0.875rem; outline: none; }

    .table-section { min-height: 400px; padding: 0; overflow: hidden; position: relative; }

    .flat-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #38bdf8;
    }

    .reading-indicator { display: flex; align-items: baseline; gap: 4px; }
    .vol-text { font-size: 1.125rem; font-weight: 700; color: var(--primary); }
    .unit-text { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

    .date-chip { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-subtle); }

    /* States */
    .state-container { padding: 80px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .empty-art { width: 80px; height: 80px; background: var(--bg-surface); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border); }
  `]
})
export class ManageUsageComponent implements OnInit {
  apiService = inject(ApiService);
  dialog = inject(MatDialog);

  usage = signal<UsageWithFlat[]>([]);
  flats = signal<any[]>([]);
  loading = signal(true);
  displayedColumns: string[] = ['flatNumber', 'ownerName', 'reading', 'readingDate'];

  ngOnInit() {
    this.loadFlats();
  }

  loadFlats() {
    this.apiService.getFlats().subscribe({
      next: (res) => {
        if (res.success) {
          this.flats.set(res.data);
          this.loadUsage();
        }
      },
      error: () => this.loading.set(false)
    });
  }

  loadUsage() {
    this.loading.set(true);
    this.apiService.getAllUsage().subscribe({
      next: (res) => {
        if (res.success) {
          const flatMap = new Map(this.flats().map(f => [f._id, f]));
          const enriched: UsageWithFlat[] = res.data.map((u: any) => {
            const flat = flatMap.get(u.flatId);
            return {
              ...u,
              flatNumber: flat?.flatNumber ?? u.flatId,
              ownerName: flat?.ownerName ?? 'Unknown',
            };
          }).sort((a: UsageWithFlat, b: UsageWithFlat) =>
            new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
          );
          this.usage.set(enriched);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  uniqueFlatsCount = computed(() => {
    return new Set(this.usage().map(u => u.flatId)).size;
  });

  totalReading = computed(() => {
    return this.usage().reduce((sum, u) => sum + Number(u.reading), 0);
  });

  openUsageDialog() {
    const dialogRef = this.dialog.open(UsageDialogComponent, {
      width: '440px',
      data: { flats: this.flats() },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsage();
      }
    });
  }
}

