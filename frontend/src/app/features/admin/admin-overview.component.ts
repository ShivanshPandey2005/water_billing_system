import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { 
  LucideAngularModule, 
  Building2, 
  Droplets, 
  ReceiptText, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-angular';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    BaseChartDirective, 
    LucideAngularModule
  ],
  template: `
    <div class="overview-shell animate-slide-up">
      
      <!-- Header Section -->
      <section class="overview-header">
        <div class="header-content">
          <h1 class="page-title">Society Overview</h1>
          <p class="text-subtle">Real-time consumption analytics for your society</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" routerLink="/dashboard/flats">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Add Flat
          </button>
          <button class="btn-primary" routerLink="/dashboard/bills">
            <lucide-icon name="zap" size="18"></lucide-icon>
            Generate Bills
          </button>
        </div>
      </section>

      <!-- KPI Grid -->
      <section class="stats-grid">
        <div class="kpi-card glass-card" (click)="navigate('/dashboard/flats')">
          <div class="kpi-icon-wrap blue">
            <lucide-icon name="building-2"></lucide-icon>
          </div>
          <div class="kpi-data">
            <p class="kpi-label">Total Flats</p>
            <h3 class="kpi-value">{{ stats().totalFlats }}</h3>
            <div class="kpi-trend up">
              <lucide-icon name="trending-up" size="14"></lucide-icon>
              <span>+2 this month</span>
            </div>
          </div>
          <div class="kpi-decoration"><lucide-icon name="building-2" size="64"></lucide-icon></div>
        </div>

        <div class="kpi-card glass-card" (click)="navigate('/dashboard/usage')">
          <div class="kpi-icon-wrap green">
            <lucide-icon name="droplets"></lucide-icon>
          </div>
          <div class="kpi-data">
            <p class="kpi-label">Total Readings</p>
            <h3 class="kpi-value">{{ stats().totalReadings }}</h3>
            <div class="kpi-trend up">
              <lucide-icon name="trending-up" size="14"></lucide-icon>
              <span>98.5% uptime</span>
            </div>
          </div>
          <div class="kpi-decoration"><lucide-icon name="droplets" size="64"></lucide-icon></div>
        </div>

        <div class="kpi-card glass-card" (click)="navigate('/dashboard/bills')">
          <div class="kpi-icon-wrap purple">
            <lucide-icon name="receipt-text"></lucide-icon>
          </div>
          <div class="kpi-data">
            <p class="kpi-label">Total Revenue</p>
            <h3 class="kpi-value">₹{{ stats().totalBilled | number:'1.0-0' }}</h3>
            <div class="kpi-trend up">
              <lucide-icon name="trending-up" size="14"></lucide-icon>
              <span>+5.2% from Mar</span>
            </div>
          </div>
          <div class="kpi-decoration"><lucide-icon name="receipt-text" size="64"></lucide-icon></div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon-wrap orange">
            <lucide-icon name="clock"></lucide-icon>
          </div>
          <div class="kpi-data">
            <p class="kpi-label">Pending Dues</p>
            <h3 class="kpi-value">{{ stats().unpaidBills }}</h3>
            <div class="kpi-trend down">
              <lucide-icon name="trending-down" size="14"></lucide-icon>
              <span>-12% collection gap</span>
            </div>
          </div>
          <div class="kpi-decoration"><lucide-icon name="clock" size="64"></lucide-icon></div>
        </div>
      </section>

      <!-- Charts & Tables -->
      <div class="dashboard-rows">
        
        <!-- Main row -->
        <div class="data-row">
          <div class="glass-card chart-container wide">
            <div class="card-header">
              <div class="header-title">
                <lucide-icon name="trending-up" size="18" class="text-primary"></lucide-icon>
                <span>Water Consumption Trends (m³)</span>
              </div>
              <div class="header-actions">
                <select class="saas-select">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
            </div>
            <div class="card-body chart-body">
              <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" [type]="'line'"></canvas>
            </div>
          </div>

          <div class="glass-card chart-container">
            <div class="card-header">
              <div class="header-title">
                <lucide-icon name="users" size="18" class="text-accent"></lucide-icon>
                <span>Consumption Share</span>
              </div>
            </div>
            <div class="card-body pie-body">
              <canvas baseChart [data]="donutChartData" [options]="donutChartOptions" [type]="'doughnut'"></canvas>
            </div>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="data-row">
          <div class="glass-card table-section">
            <div class="card-header">
              <div class="header-title">
                <lucide-icon name="zap" size="18" class="text-warning"></lucide-icon>
                <span>Recent Activity</span>
              </div>
              <button class="text-btn">View All</button>
            </div>
            <div class="card-body">
              <div class="activity-list">
                <div class="activity-item" *ngFor="let act of recentActivities">
                  <div class="activity-marker" [style.background-color]="act.color"></div>
                  <div class="activity-info">
                    <p class="activity-text">{{ act.text }}</p>
                    <span class="activity-time">{{ act.time }}</span>
                  </div>
                  <lucide-icon name="arrow-up-right" size="14" class="activity-link"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .overview-shell {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0 0 4px;
      letter-spacing: -0.02em;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-secondary {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-secondary:hover {
      background: var(--bg-elevated);
      border-color: var(--primary);
    }

    /* KPI Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .kpi-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .kpi-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .kpi-icon-wrap.blue   { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .kpi-icon-wrap.green  { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .kpi-icon-wrap.purple { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
    .kpi-icon-wrap.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

    .kpi-data {
      flex: 1;
      display: flex;
      flex-direction: column;
      z-index: 1;
    }

    .kpi-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 2px;
    }

    .kpi-value {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0 0 4px;
      color: var(--text-main);
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .kpi-trend.up   { color: #10b981; }
    .kpi-trend.down { color: #f59e0b; }

    .kpi-decoration {
      position: absolute;
      right: -10px;
      bottom: -10px;
      opacity: 0.03;
      transform: rotate(-15deg);
      pointer-events: none;
    }

    /* Rows */
    .dashboard-rows {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .data-row {
      display: flex;
      gap: 20px;
    }

    .chart-container {
      display: flex;
      flex-direction: column;
      min-height: 400px;
    }

    .chart-container.wide { flex: 2; }
    .chart-container:not(.wide) { flex: 1; }
    .table-section { flex: 1; }

    .card-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-main);
    }

    .saas-select {
      background: var(--bg-main);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 0.75rem;
      color: var(--text-muted);
      cursor: pointer;
    }

    .card-body {
      padding: 24px;
      flex: 1;
    }

    .chart-body { height: 300px; width: 100%; }
    .pie-body   { display: flex; align-items: center; justify-content: center; height: 300px; }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border-radius: 10px;
      transition: var(--transition);
      cursor: pointer;
    }

    .activity-item:hover {
      background: var(--primary-light);
    }

    .activity-marker {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .activity-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .activity-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-main);
      margin: 0;
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }

    .activity-link {
      color: var(--text-subtle);
      opacity: 0;
      transition: var(--transition);
    }

    .activity-item:hover .activity-link {
      opacity: 1;
      transform: translate(2px, -2px);
      color: var(--primary);
    }

    .text-btn {
      background: transparent;
      border: none;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 900px) {
      .data-row { flex-direction: column; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminOverviewComponent implements OnInit {
  apiService = inject(ApiService);
  router = inject(Router);

  stats = signal({ totalFlats: 0, totalReadings: 0, totalBilled: 0, unpaidBills: 0 });

  recentActivities = [
    { text: 'New Reading recorded for Flat A-201', time: '10 mins ago', color: '#10b981' },
    { text: 'Monthly bill generated for 120 flats', time: '2 hours ago', color: '#6366f1' },
    { text: 'Resident A-105 updated profile details', time: '4 hours ago', color: '#a78bfa' },
    { text: 'Water leakage alert in Block C', time: '1 day ago', color: '#ef4444' }
  ];

  ngOnInit() {
    this.apiService.getFlats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.update(s => ({ ...s, totalFlats: res.count }));
        }
      },
      error: (err) => {
        console.error('Error fetching flats:', err);
      }
    });

    this.apiService.getAllUsage().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.update(s => ({ ...s, totalReadings: res.count }));
        }
      },
      error: (err) => {
        console.error('Error fetching usage:', err);
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  /* ── Charts Logic ── */

  // Line Chart
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hoverRadius: 6, backgroundColor: '#6366f1' }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      }
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [420, 580, 490, 710, 640, 820],
        label: 'Current Year',
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        borderWidth: 3
      },
      {
        data: [380, 520, 410, 650, 590, 720],
        label: 'Previous Year',
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        fill: false,
        borderWidth: 2
      }
    ]
  };

  // Donut Chart
  public donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 8, padding: 20 }
      }
    }
  };

  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Block A', 'Block B', 'Block C', 'Others'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: ['#6366f1', '#0ea5e9', '#a78bfa', '#f1f5f9'],
      hoverOffset: 10,
      borderWidth: 0
    }]
  };
}

