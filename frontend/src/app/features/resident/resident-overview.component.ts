import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  LucideAngularModule, 
  Droplets, 
  ReceiptText, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  History,
  Activity,
  Calendar,
  Wallet
} from 'lucide-angular';

@Component({
  selector: 'app-resident-overview',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    BaseChartDirective,
    LucideAngularModule
  ],
  template: `
    <div class="feature-shell animate-slide-up">
      
      <!-- Welcome Hero -->
      <header class="page-header">
        <div class="header-info">
          <h1 class="page-title">Welcome back, <span class="text-primary">{{ firstName() }}</span>!</h1>
          <p class="text-subtle">Manage your water consumption and monitor your bills with ease.</p>
        </div>
        <div class="header-actions" *ngIf="unpaidBill()">
          <button class="btn-primary" (click)="payBill()">
            <lucide-icon name="wallet" size="18"></lucide-icon>
            Pay Owed Balance
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap" [class.amber]="currentBalance() > 0" [class.green]="currentBalance() === 0">
            <lucide-icon [name]="currentBalance() > 0 ? 'clock' : 'check-circle'" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Current Balance</span>
            <h3 class="kpi-value">₹{{ currentBalance() | number:'1.0-0' }}</h3>
            <div class="kpi-trend" [class.text-danger]="currentBalance() > 0" [class.text-success]="currentBalance() === 0">
              <lucide-icon [name]="currentBalance() > 0 ? 'alert-circle' : 'check'" size="12"></lucide-icon>
              {{ currentBalance() > 0 ? 'Payment Overdue' : 'Account Settled' }}
            </div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap blue">
            <lucide-icon name="droplets" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Total Consumption</span>
            <h3 class="kpi-value">{{ totalConsumption() | number:'1.1-1' }} <span class="unit">m³</span></h3>
            <div class="kpi-trend text-success">
              <lucide-icon name="activity" size="12"></lucide-icon>
              Tracking Active
            </div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap purple">
            <lucide-icon name="receipt-text" size="20"></lucide-icon>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Bills Generated</span>
            <h3 class="kpi-value">{{ bills().length }}</h3>
            <div class="kpi-trend text-muted">
              <lucide-icon name="history" size="12"></lucide-icon>
              Lifetime Records
            </div>
          </div>
        </div>
      </section>

      <!-- Dashboard Content -->
      <div class="dashboard-rows">
        
        <!-- Usage Chart -->
        <div class="glass-card chart-container-card">
          <div class="card-inner-header">
            <div class="header-title-group">
              <lucide-icon name="trending-up" size="18" class="text-primary"></lucide-icon>
              <h3>Usage Trend</h3>
            </div>
            <div class="header-actions">
              <span class="badge ghost">Last 6 Months</span>
            </div>
          </div>
          <div class="card-inner-body">
            <div class="chart-holder" *ngIf="!loading(); else chartSkeleton">
              <canvas baseChart [data]="usageChartData" [options]="usageChartOptions" [type]="'line'"></canvas>
            </div>
            <ng-template #chartSkeleton>
              <div class="saas-loader"></div>
            </ng-template>
          </div>
        </div>

        <!-- Billing History -->
        <div class="glass-card table-container-card">
          <div class="card-inner-header">
            <div class="header-title-group">
              <lucide-icon name="history" size="18" class="text-primary"></lucide-icon>
              <h3>Recent Invoices</h3>
            </div>
          </div>
          
          <div class="table-scroll" *ngIf="!loading(); else tableSkeleton">
            <table mat-table [dataSource]="bills()" class="saas-table">
              
              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef>Billing Period</th>
                <td mat-cell *matCellDef="let b" class="font-mono text-xs">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="calendar" size="14" class="text-muted"></lucide-icon>
                    {{ b.month }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="consumption">
                <th mat-header-cell *matHeaderCellDef>Consumption</th>
                <td mat-cell *matCellDef="let b">
                  <span class="text-main font-bold">{{ b.consumption | number:'1.1-1' }}</span>
                  <span class="text-xs text-muted ml-1">m³</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let b" class="font-bold text-main">₹{{ b.totalAmount }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let b">
                  <span class="badge" [class.success]="b.status==='paid'" [class.warning]="b.status==='unpaid'">
                    <lucide-icon [name]="b.status==='paid' ? 'check-circle' : 'clock'" size="12"></lucide-icon>
                    {{ b.status | uppercase }}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="saas-row"></tr>
            </table>

            <div *ngIf="bills().length === 0" class="empty-results">
              <div class="empty-icon-box">
                <lucide-icon name="receipt-text" size="40"></lucide-icon>
              </div>
              <h4>No invoices found</h4>
              <p>Billing records will appear here as they are generated.</p>
            </div>
          </div>

          <ng-template #tableSkeleton>
            <div class="skeleton-wrapper">
              <div class="skeleton-line" *ngFor="let i of [1,2,3,4]"></div>
            </div>
          </ng-template>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .feature-shell { display: flex; flex-direction: column; gap: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
    .page-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin: 0; color: var(--text-main); }
    .page-title span { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
    .kpi-card { padding: 24px; display: flex; align-items: center; gap: 20px; transition: var(--transition); }
    
    .kpi-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface); border: 1px solid var(--border); }
    .kpi-icon-wrap.blue { color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
    .kpi-icon-wrap.purple { color: #a78bfa; background: rgba(167, 139, 250, 0.1); }
    .kpi-icon-wrap.amber { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
    .kpi-icon-wrap.green { color: #10b981; background: rgba(16, 185, 129, 0.1); }

    .kpi-content { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .kpi-value { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin: 2px 0; }
    .kpi-value .unit { font-size: 0.875rem; color: var(--text-subtle); }
    .kpi-trend { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }

    .dashboard-rows { display: flex; flex-direction: column; gap: 24px; }
    
    .card-inner-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .header-title-group { display: flex; align-items: center; gap: 10px; }
    .header-title-group h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 0; }
    
    .chart-holder { height: 320px; padding: 24px; }
    .table-scroll { overflow-x: auto; }

    .empty-results { padding: 64px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .empty-icon-box { width: 80px; height: 80px; background: var(--bg-surface); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--border); }
    .empty-results h4 { font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin: 0; }
    .empty-results p { color: var(--text-subtle); font-size: 0.875rem; max-width: 300px; margin: 0; }

    .skeleton-wrapper { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
    .skeleton-line { height: 40px; background: var(--bg-surface); border-radius: 8px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
      .header-actions { width: 100%; }
      .btn-primary { width: 100%; justify-content: center; }
    }
  `]
})
export class ResidentOverviewComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  bills = signal<any[]>([]);
  loading = signal(true);
  displayedColumns = ['month', 'consumption', 'amount', 'status'];

  firstName(): string { 
    return this.authService.currentUser()?.name?.split(' ')[0] ?? 'Resident'; 
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    // Resident usually has flatId assigned to them
    const flatId = user?.flatId || user?.id; 
    
    if (flatId) {
      this.apiService.getFlatBills(flatId).subscribe({
        next: (res) => {
          if (res.success) {
            this.bills.set(res.data);
            this.updateChartData(res.data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  unpaidBill = computed(() => this.bills().find(b => b.status === 'unpaid'));

  currentBalance = computed(() => {
    return this.bills()
      .filter(b => b.status === 'unpaid')
      .reduce((s, b) => s + b.totalAmount, 0);
  });

  totalConsumption = computed(() => {
    return this.bills().reduce((s, b) => s + b.consumption, 0);
  });

  payBill() {
    const bill = this.unpaidBill();
    if (!bill) return;
    this.apiService.payBill(bill._id).subscribe({
      next: (res) => {
        if (res.success) {
          const updated = this.bills().map(b => b._id === bill._id ? { ...b, status: 'paid' } : b);
          this.bills.set(updated);
        }
      }
    });
  }

  /* ── Chart Configuration ── */
  public usageChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hoverRadius: 6, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: '#fff' }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)', drawTicks: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }
    }
  };

  public usageChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Usage (m³)',
      borderColor: '#3b82f6',
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return undefined;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.15)');
        return gradient;
      },
      fill: true,
      borderWidth: 3
    }]
  };

  private updateChartData(bills: any[]) {
    const sorted = [...bills].reverse(); // Oldest first
    this.usageChartData.labels = sorted.map(b => b.month);
    this.usageChartData.datasets[0].data = sorted.map(b => b.consumption);
  }
}


