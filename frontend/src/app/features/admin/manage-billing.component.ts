import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { 
  LucideAngularModule, 
  Receipt, 
  Calculator, 
  Bolt, 
  CheckCircle, 
  AlertCircle, 
  IndianRupee, 
  Clock, 
  CheckCheck,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  CreditCard,
  History
} from 'lucide-angular';

interface BillWithFlat {
  _id: string;
  flatId: string;
  flatNumber: string;
  ownerName: string;
  month: string;
  consumption: number;
  totalAmount: number;
  status: string;
  billDate: Date;
  breakdown: { slab: string; rate: number; unitsInSlab: number; subtotal: number }[];
}

@Component({
  selector: 'app-manage-billing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    LucideAngularModule
  ],
  template: `
    <div class="feature-shell animate-slide-up">
      
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-info">
          <h1 class="page-title">Billing Management</h1>
          <p class="text-subtle">Generate and track water invoices for society members</p>
        </div>
      </header>

      <!-- Quick Action: Generate Bill -->
      <section class="glass-card billing-action-card">
        <div class="card-header">
          <div class="header-title">
            <lucide-icon name="calculator" size="18" class="text-primary"></lucide-icon>
            <h3>Generate Invoice</h3>
          </div>
          <p class="text-subtle">Select flat and billing period to calculate charges</p>
        </div>

        <div class="billing-form">
          <div class="form-group flex-1">
            <mat-form-field appearance="outline" class="saas-select full-width">
              <mat-select [(ngModel)]="selectedFlatId" placeholder="Select Flat">
                <mat-option *ngFor="let flat of flats()" [value]="flat._id">
                  {{ flat.flatNumber }} — {{ flat.ownerName }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-group flex-1">
            <mat-form-field appearance="outline" class="saas-select full-width">
              <input matInput type="month" [(ngModel)]="selectedMonth">
            </mat-form-field>
          </div>

          <button class="btn-primary generate-btn" 
                  [disabled]="!selectedFlatId || !selectedMonth || generating()"
                  (click)="generateBill()">
            <span *ngIf="!generating()">Generate Bill</span>
            <span *ngIf="generating()" class="saas-loader mini"></span>
            <lucide-icon *ngIf="!generating()" name="bolt" size="18"></lucide-icon>
          </button>
        </div>

        <!-- Feedback Messages -->
        <div *ngIf="generateError()" class="msg-banner error animate-shake">
          <lucide-icon name="alert-circle" size="16"></lucide-icon>
          <span>{{ generateError() }}</span>
        </div>
        <div *ngIf="generateSuccess()" class="msg-banner success animate-fade-in">
          <lucide-icon name="check-circle" size="16"></lucide-icon>
          <span>Invoice generated successfully!</span>
        </div>
      </section>

      <!-- Stats Grid -->
      <div class="stats-grid" *ngIf="bills().length > 0">
        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap blue">
            <lucide-icon name="history" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Total Invoices</span>
            <h3 class="kpi-value">{{ bills().length }}</h3>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap amber">
            <lucide-icon name="clock" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Pending Payments</span>
            <h3 class="kpi-value">{{ unpaidCount() }}</h3>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap green">
            <lucide-icon name="indian-rupee" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Total Billed</span>
            <h3 class="kpi-value">₹{{ totalRevenue() | number:'1.0-0' }}</h3>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="glass-card table-section">
        <table mat-table [dataSource]="bills()" class="saas-table">
          
          <ng-container matColumnDef="flat">
            <th mat-header-cell *matHeaderCellDef>Flat</th>
            <td mat-cell *matCellDef="let b">
              <div class="flat-pill purple">{{ b.flatNumber }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="owner">
            <th mat-header-cell *matHeaderCellDef>Owner</th>
            <td mat-cell *matCellDef="let b" class="font-medium">{{ b.ownerName }}</td>
          </ng-container>

          <ng-container matColumnDef="month">
            <th mat-header-cell *matHeaderCellDef>Month</th>
            <td mat-cell *matCellDef="let b" class="text-subtle font-mono">{{ b.month }}</td>
          </ng-container>

          <ng-container matColumnDef="consumption">
            <th mat-header-cell *matHeaderCellDef>Usage</th>
            <td mat-cell *matCellDef="let b">
              <span class="text-main font-bold">{{ b.consumption | number:'1.1-1' }}</span>
              <span class="text-xs text-muted ml-1">m³</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let b">
              <span class="amount-text">₹{{ b.totalAmount | number:'1.0-0' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let b">
              <span class="badge" [class.success]="b.status === 'paid'" [class.warning]="b.status === 'unpaid'">
                <lucide-icon [name]="b.status === 'paid' ? 'check-check' : 'clock'" size="12"></lucide-icon>
                {{ b.status | uppercase }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="actions-header">Action</th>
            <td mat-cell *matCellDef="let b" class="actions-cell">
              <button class="btn-outline-sm" *ngIf="b.status === 'unpaid'" (click)="markPaid(b)">
                Settle Payment
              </button>
              <div *ngIf="b.status === 'paid'" class="text-muted text-xs flex items-center gap-1">
                <lucide-icon name="check-check" size="14" class="text-success"></lucide-icon>
                Settled
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="saas-row"></tr>
        </table>

        <!-- Loading State -->
        <div *ngIf="loading()" class="state-container">
          <div class="saas-loader"></div>
          <p>Syncing financial data...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="bills().length === 0 && !loading()" class="state-container">
          <div class="empty-art pink">
            <lucide-icon name="history" size="48"></lucide-icon>
          </div>
          <h3>No billing history</h3>
          <p>Once you generate invoices, they will appear here for tracking and settlement.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .feature-shell { display: flex; flex-direction: column; gap: 24px; }
    .page-header { margin-bottom: 8px; }
    .page-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.02em; margin: 0; color: var(--text-main); }

    /* Action Card */
    .billing-action-card { padding: 24px; }
    .card-header { margin-bottom: 24px; }
    .header-title { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .header-title h3 { font-size: 1.1rem; font-weight: 700; margin: 0; color: var(--text-main); }
    
    .billing-form { display: flex; gap: 16px; align-items: center; }
    .form-group { position: relative; }
    .generate-btn { height: 44px; min-width: 160px; justify-content: center; gap: 10px; }

    .saas-select ::ng-deep .mat-mdc-text-field-wrapper {
      background: var(--bg-surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
    }
    .saas-select ::ng-deep .mdc-notched-outline { display: none; }
    .saas-select ::ng-deep .mat-mdc-form-field-infix { padding: 10px 0 !important; min-height: unset !important; }

    .msg-banner { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-top: 16px; }
    .msg-banner.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
    .msg-banner.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .kpi-card { padding: 24px; display: flex; align-items: center; gap: 20px; transition: var(--transition); }
    .kpi-card:hover { transform: translateY(-4px); }
    .kpi-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-icon-wrap.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .kpi-icon-wrap.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .kpi-icon-wrap.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .kpi-content { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; }
    .kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }

    /* Table */
    .table-section { min-height: 400px; padding: 0; overflow: hidden; position: relative; }
    .flat-pill { display: inline-flex; padding: 4px 10px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: #a78bfa; }
    .amount-text { font-size: 1rem; font-weight: 800; color: var(--primary); }
    
    .actions-cell { display: flex; justify-content: flex-end; align-items: center; height: 100%; }
    .btn-outline-sm { background: transparent; border: 1px solid var(--border); color: var(--text-subtle); padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
    .btn-outline-sm:hover { background: var(--bg-surface); border-color: var(--primary); color: var(--primary); }

    .state-container { padding: 80px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .empty-art { width: 80px; height: 80px; background: var(--bg-surface); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border); }
    .empty-art.pink { background: rgba(244, 114, 182, 0.1); color: #f472b6; border-color: rgba(244, 114, 182, 0.2); }

    @media (max-width: 768px) {
      .billing-form { flex-direction: column; align-items: stretch; }
      .generate-btn { width: 100%; }
    }
  `]
})
export class ManageBillingComponent implements OnInit {
  apiService = inject(ApiService);

  bills = signal<BillWithFlat[]>([]);
  flats = signal<any[]>([]);
  loading = signal(true);
  generating = signal(false);
  generateError = signal<string | null>(null);
  generateSuccess = signal(false);
  selectedFlatId = '';
  selectedMonth = '';
  displayedColumns = ['flat', 'owner', 'month', 'consumption', 'amount', 'status', 'actions'];

  ngOnInit() {
    this.apiService.getFlats().subscribe({
      next: (res) => {
        if (res.success) {
          this.flats.set(res.data);
          this.loadAllBills();
        }
      }
    });
  }

  loadAllBills() {
    this.loading.set(true);
    const flats = this.flats();
    if (flats.length === 0) { this.loading.set(false); return; }

    const flatMap = new Map(flats.map(f => [f._id, f]));
    let allBills: BillWithFlat[] = [];
    let completed = 0;

    flats.forEach(flat => {
      this.apiService.getFlatBills(flat._id).subscribe({
        next: (res) => {
          if (res.success) {
            const enriched = res.data.map((b: any) => ({
              ...b,
              flatNumber: flatMap.get(b.flatId)?.flatNumber ?? b.flatId,
              ownerName: flatMap.get(b.flatId)?.ownerName ?? 'Unknown'
            }));
            allBills = [...allBills, ...enriched];
          }
          completed++;
          if (completed === flats.length) {
            allBills.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());
            this.bills.set(allBills);
            this.loading.set(false);
          }
        },
        error: () => {
          completed++;
          if (completed === flats.length) { this.loading.set(false); }
        }
      });
    });
  }

  generateBill() {
    this.generating.set(true);
    this.generateError.set(null);
    this.generateSuccess.set(false);

    this.apiService.calculateBill({ flatId: this.selectedFlatId, month: this.selectedMonth }).subscribe({
      next: (res) => {
        this.generating.set(false);
        if (res.success) {
          this.generateSuccess.set(true);
          setTimeout(() => this.generateSuccess.set(false), 3000);
          this.loadAllBills();
        } else {
          this.generateError.set(res.message || 'Failed to generate bill');
        }
      },
      error: (err) => {
        this.generating.set(false);
        this.generateError.set(err.error?.message || 'Something went wrong.');
      }
    });
  }

  markPaid(bill: BillWithFlat) {
    this.apiService.payBill(bill._id).subscribe({
      next: (res) => {
        if (res.success) { this.loadAllBills(); }
      }
    });
  }

  unpaidCount = computed(() => this.bills().filter(b => b.status === 'unpaid').length);
  totalRevenue = computed(() => this.bills().reduce((s, b) => s + b.totalAmount, 0));
}

