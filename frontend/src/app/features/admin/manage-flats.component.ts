import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { FlatDialogComponent } from './flat-dialog.component';
import { 
  LucideAngularModule, 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Filter,
  ArrowUpDown
} from 'lucide-angular';

@Component({
  selector: 'app-manage-flats',
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
          <h1 class="page-title">Manage Flats</h1>
          <p class="text-subtle">Register and manage residents within your society</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openFlatDialog()">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Add New Flat
          </button>
        </div>
      </header>

      <!-- Search & Filters -->
      <section class="glass-card filter-bar">
        <div class="search-input-group">
          <lucide-icon name="search" size="18" class="text-muted"></lucide-icon>
          <input type="text" placeholder="Search by flat number or owner..." class="saas-input">
        </div>
        <div class="filter-actions">
          <button class="btn-icon-only">
            <lucide-icon name="filter" size="18"></lucide-icon>
          </button>
        </div>
      </section>

      <!-- Data Table Section -->
      <div class="glass-card table-section">
        <table mat-table [dataSource]="flats()" class="saas-table">
          
          <ng-container matColumnDef="flatNumber">
            <th mat-header-cell *matHeaderCellDef>
              <div class="cell-header">
                Flat Number
                <lucide-icon name="arrow-up-down" size="12" class="sort-icon"></lucide-icon>
              </div>
            </th>
            <td mat-cell *matCellDef="let flat" class="font-bold text-main">
              {{ flat.flatNumber }}
            </td>
          </ng-container>

          <ng-container matColumnDef="floor">
            <th mat-header-cell *matHeaderCellDef>Floor</th>
            <td mat-cell *matCellDef="let flat">
              <span class="floor-badge">{{ flat.floor }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="ownerName">
            <th mat-header-cell *matHeaderCellDef>Owner Name</th>
            <td mat-cell *matCellDef="let flat" class="font-medium">
              {{ flat.ownerName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="actions-header">Actions</th>
            <td mat-cell *matCellDef="let flat" class="actions-cell">
              <div class="action-btn-group">
                <button class="btn-icon-only text-primary" (click)="openFlatDialog(flat)">
                  <lucide-icon name="edit-2" size="16"></lucide-icon>
                </button>
                <button class="btn-icon-only text-danger">
                  <lucide-icon name="trash-2" size="16"></lucide-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="saas-row"></tr>
        </table>

        <!-- Empty State -->
        <div *ngIf="flats().length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <lucide-icon name="building-2" size="48"></lucide-icon>
          </div>
          <h3>No flats registered</h3>
          <p>Get started by adding your society's first residential unit.</p>
          <button class="btn-secondary" (click)="openFlatDialog()">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Add Flat
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

    .filter-bar {
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .search-input-group {
      flex: 1;
      max-width: 400px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      transition: var(--transition);
    }

    .search-input-group:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-light);
    }

    .saas-input {
      background: transparent;
      border: none;
      color: var(--text-main);
      padding: 10px 0;
      width: 100%;
      font-size: 0.875rem;
      outline: none;
    }

    .table-section {
      min-height: 400px;
      padding: 0;
      overflow: hidden;
    }

    .cell-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sort-icon {
      opacity: 0;
      transition: var(--transition);
    }

    th:hover .sort-icon {
      opacity: 0.5;
    }

    .floor-badge {
      display: inline-flex;
      padding: 2px 8px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-subtle);
    }

    .action-btn-group {
      display: flex;
      gap: 4px;
      justify-content: flex-end;
    }

    .btn-icon-only {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-muted);
      transition: var(--transition);
    }

    .btn-icon-only:hover {
      background: var(--bg-elevated);
      color: var(--text-main);
    }

    .empty-state {
      padding: 80px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .empty-icon-wrap {
      width: 80px;
      height: 80px;
      background: var(--bg-surface);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      margin-bottom: 12px;
      border: 1px solid var(--border);
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    .empty-state p {
      color: var(--text-subtle);
      max-width: 300px;
      margin: 0 0 12px;
    }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .header-actions { width: 100%; }
      .btn-primary { width: 100%; justify-content: center; }
      .filter-bar { flex-direction: column; }
      .search-input-group { max-width: 100%; }
    }
  `]
})
export class ManageFlatsComponent implements OnInit {
  apiService = inject(ApiService);
  dialog = inject(MatDialog);

  flats = signal<any[]>([]);
  displayedColumns: string[] = ['flatNumber', 'floor', 'ownerName', 'actions'];

  ngOnInit() {
    this.loadFlats();
  }

  loadFlats() {
    this.apiService.getFlats().subscribe({
      next: (res) => {
        if (res.success) {
          this.flats.set(res.data);
        }
      }
    });
  }

  openFlatDialog(flat?: any) {
    const dialogRef = this.dialog.open(FlatDialogComponent, {
      width: '440px',
      data: flat || null,
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFlats();
      }
    });
  }
}

