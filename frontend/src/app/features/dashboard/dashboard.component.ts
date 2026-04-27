import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  Building2, 
  Droplets, 
  ReceiptText, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  ShieldCheck,
  Search
} from 'lucide-angular';
import { AuthService, User as UserProfile } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule, 
    MatTooltipModule,
    MatMenuModule,
    LucideAngularModule
  ],
  animations: [
    trigger('sidebarToggle', [
      state('expanded', style({ width: '260px' })),
      state('collapsed', style({ width: '80px' })),
      transition('expanded <=> collapsed', animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ],
  template: `
    <div class="dashboard-shell" [class.sidebar-collapsed]="isCollapsed()">

      <!-- ── Sidebar ── -->
      <aside class="sidebar" [@sidebarToggle]="isCollapsed() ? 'collapsed' : 'expanded'">
        <!-- Brand -->
        <div class="sidebar-brand">
          <div class="brand-logo">
            <lucide-icon name="droplets" class="text-white"></lucide-icon>
          </div>
          <div class="brand-text" *ngIf="!isCollapsed()">
            <span class="brand-name">AquaSmart</span>
            <span class="brand-tag">Water Systems</span>
          </div>
        </div>

        <!-- Nav links -->
        <nav class="sidebar-nav">
          <p class="nav-section" *ngIf="!isCollapsed()">MAIN</p>

          <a class="nav-item" [routerLink]="isAdmin() ? '/dashboard/admin' : '/dashboard/resident'" routerLinkActive="active"
             [matTooltip]="isCollapsed() ? 'Dashboard' : ''" matTooltipPosition="right">
            <div class="nav-icon"><lucide-icon name="layout-dashboard"></lucide-icon></div>
            <span class="nav-label" *ngIf="!isCollapsed()">Dashboard</span>
          </a>

          <ng-container *ngIf="isAdmin()">
            <p class="nav-section" *ngIf="!isCollapsed()">MANAGEMENT</p>

            <a class="nav-item" routerLink="/dashboard/flats" routerLinkActive="active"
               [matTooltip]="isCollapsed() ? 'Manage Flats' : ''" matTooltipPosition="right">
              <div class="nav-icon"><lucide-icon name="building-2"></lucide-icon></div>
              <span class="nav-label" *ngIf="!isCollapsed()">Manage Flats</span>
            </a>

            <a class="nav-item" routerLink="/dashboard/usage" routerLinkActive="active"
               [matTooltip]="isCollapsed() ? 'Usage Tracking' : ''" matTooltipPosition="right">
              <div class="nav-icon"><lucide-icon name="droplets"></lucide-icon></div>
              <span class="nav-label" *ngIf="!isCollapsed()">Meter Readings</span>
            </a>

            <a class="nav-item" routerLink="/dashboard/bills" routerLinkActive="active"
               [matTooltip]="isCollapsed() ? 'Billing' : ''" matTooltipPosition="right">
              <div class="nav-icon"><lucide-icon name="receipt-text"></lucide-icon></div>
              <span class="nav-label" *ngIf="!isCollapsed()">Billing</span>
            </a>
          </ng-container>

          <ng-container *ngIf="!isAdmin()">
            <p class="nav-section" *ngIf="!isCollapsed()">ACCOUNT</p>
            <a class="nav-item" routerLink="/dashboard/bills" routerLinkActive="active"
               [matTooltip]="isCollapsed() ? 'My Bills' : ''" matTooltipPosition="right">
              <div class="nav-icon"><lucide-icon name="receipt-text"></lucide-icon></div>
              <span class="nav-label" *ngIf="!isCollapsed()">My Bills</span>
            </a>
          </ng-container>

          <p class="nav-section" *ngIf="!isCollapsed()">SYSTEM</p>
          <a class="nav-item" routerLink="/dashboard/profile" routerLinkActive="active"
             [matTooltip]="isCollapsed() ? 'Profile' : ''" matTooltipPosition="right">
            <div class="nav-icon"><lucide-icon name="user"></lucide-icon></div>
            <span class="nav-label" *ngIf="!isCollapsed()">Account Profile</span>
          </a>
        </nav>

        <!-- Sidebar Collapse Toggle -->
        <button class="collapse-toggle" (click)="toggleSidebar()">
          <lucide-icon [name]="isCollapsed() ? 'chevron-right' : 'chevron-left'"></lucide-icon>
        </button>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="user-pill" [class.collapsed]="isCollapsed()">
            <div class="user-avatar">{{ initials() }}</div>
            <div class="user-info" *ngIf="!isCollapsed()">
              <span class="user-name">{{ user()?.name }}</span>
              <span class="user-role">{{ userRoleLabel() }}</span>
            </div>
            <button class="logout-btn" (click)="onLogout()" [matTooltip]="isCollapsed() ? 'Log Out' : ''" matTooltipPosition="right">
              <lucide-icon name="log-out"></lucide-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- ── Main Content Area ── -->
      <div class="main-wrapper">
        <!-- Top Navbar -->
        <header class="navbar">
          <div class="navbar-left">
            <div class="page-title-wrap">
              <h2 class="page-title">{{ getPageTitle() }}</h2>
              <div class="breadcrumb">
                <span>Dashboard</span>
                <span class="sep">/</span>
                <span class="active">{{ getPageTitle() }}</span>
              </div>
            </div>
          </div>

          <div class="navbar-right">
            <!-- Search -->
            <div class="search-bar">
              <lucide-icon name="search" size="18"></lucide-icon>
              <input type="text" placeholder="Search data...">
            </div>

            <div class="divider"></div>

            <!-- Theme Toggle -->
            <button class="nav-action-btn" (click)="themeService.toggle()" matTooltip="Toggle Appearance">
              <lucide-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" size="20"></lucide-icon>
            </button>

            <!-- Notifications -->
            <button class="nav-action-btn" matTooltip="Notifications">
              <lucide-icon name="bell" size="20"></lucide-icon>
              <span class="notification-indicator"></span>
            </button>

            <div class="divider"></div>

            <!-- Profile Dropdown -->
            <button class="profile-trigger" [matMenuTriggerFor]="profileMenu">
              <div class="avatar-sm">{{ initials() }}</div>
              <div class="profile-labels">
                <span class="name">{{ user()?.name?.split(' ')?.[0] }}</span>
                <lucide-icon name="chevron-down" size="14"></lucide-icon>
              </div>
            </button>
            <mat-menu #profileMenu="matMenu" class="saas-menu">
              <div class="menu-header">
                <p class="menu-name">{{ user()?.name }}</p>
                <p class="menu-email">{{ user()?.email }}</p>
              </div>
              <button mat-menu-item routerLink="/dashboard/profile">
                <lucide-icon name="user" size="16"></lucide-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item (click)="onLogout()">
                <lucide-icon name="log-out" size="16" class="text-danger"></lucide-icon>
                <span class="text-danger">Log Out</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <main class="content-viewport">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-shell {
      display: flex;
      height: 100vh;
      width: 100vw;
      background: var(--bg-main);
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      height: 100vh;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 50;
      transition: width 0.3s ease;
    }

    .sidebar-brand {
      height: 72px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      overflow: hidden;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      background: var(--primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .brand-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.01em;
      color: var(--text-main);
      white-space: nowrap;
    }

    .brand-tag {
      font-size: 0.7rem;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 14px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-section {
      color: var(--text-subtle);
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      margin: 20px 0 8px 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition);
      gap: 12px;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .collapse-toggle {
      width: 24px;
      height: 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: -12px;
      top: 36px;
      cursor: pointer;
      color: var(--text-muted);
      transition: var(--transition);
      z-index: 60;
    }

    .collapse-toggle:hover {
      color: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border);
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: var(--bg-main);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .user-pill.collapsed {
      padding: 6px;
      justify-content: center;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.725rem;
      color: var(--text-subtle);
    }

    .logout-btn {
      background: transparent;
      border: none;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: flex;
      transition: var(--transition);
    }

    .logout-btn:hover {
      color: var(--danger);
      background: rgba(239, 68, 68, 0.1);
    }

    /* ── Main Area ── */
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100vh;
    }

    /* Navbar */
    .navbar {
      height: 72px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      flex-shrink: 0;
    }

    .page-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-main);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-subtle);
      margin-top: 2px;
    }

    .breadcrumb .sep { opacity: 0.5; }
    .breadcrumb .active { color: var(--primary); font-weight: 600; }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-bar {
      display: flex;
      align-items: center;
      background: var(--bg-main);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0 12px;
      height: 40px;
      width: 240px;
      color: var(--text-subtle);
    }

    .search-bar input {
      background: transparent;
      border: none;
      padding: 0 10px;
      color: var(--text-main);
      font-size: 0.875rem;
      width: 100%;
    }

    .search-bar input:focus { outline: none; }

    .nav-action-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-main);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: var(--transition);
    }

    .nav-action-btn:hover {
      background: var(--bg-elevated);
      color: var(--primary);
      border-color: var(--primary);
    }

    .notification-indicator {
      position: absolute;
      top: 10px;
      right: 11px;
      width: 8px;
      height: 8px;
      background: var(--danger);
      border-radius: 50%;
      border: 2px solid var(--bg-surface);
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--border);
      margin: 0 4px;
    }

    .profile-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 10px;
      transition: var(--transition);
    }

    .profile-trigger:hover {
      background: var(--bg-main);
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 0.75rem;
    }

    .profile-labels {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .profile-labels .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .profile-labels lucide-icon { color: var(--text-subtle); }

    .content-viewport {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .saas-menu {
      min-width: 200px !important;
      border-radius: 12px !important;
      border: 1px solid var(--border) !important;
      background: var(--bg-surface) !important;
      padding: 8px !important;
      box-shadow: var(--shadow-lg) !important;
    }

    .menu-header {
      padding: 12px 16px 16px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 8px;
    }

    .menu-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    .menu-email {
      font-size: 0.75rem;
      color: var(--text-subtle);
      margin: 2px 0 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .search-bar { display: none; }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: absolute;
        left: -260px;
      }
      .sidebar-collapsed .sidebar {
        left: 0;
        width: 260px !important;
      }
      .main-wrapper { width: 100%; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);

  user = signal<UserProfile | null>(null);
  isCollapsed = signal<boolean>(false);
  theme = this.themeService.theme;

  constructor() {
    this.user.set(this.authService.currentUser());
  }

  ngOnInit() {
    if (this.router.url === '/dashboard') {
      this.router.navigate([this.isAdmin() ? '/dashboard/admin' : '/dashboard/resident']);
    }
  }

  isAdmin(): boolean { return this.authService.isAdmin(); }
  
  userRoleLabel(): string {
    return this.user()?.role === 'admin' ? 'Society Admin' : 'Resident';
  }

  initials(): string {
    const name = this.user()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/flats')) return 'Manage Flats';
    if (url.includes('/usage')) return 'Meter Readings';
    if (url.includes('/bills')) return 'Billing Overview';
    if (url.includes('/profile')) return 'My Profile';
    if (url.includes('/admin')) return 'Admin Overview';
    if (url.includes('/resident')) return 'Resident Portal';
    return 'Dashboard';
  }

  onLogout() { this.authService.logout(); }
}

