import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../core/services/auth.service';
import { 
  LucideAngularModule, 
  User as UserIcon, 
  ShieldCheck, 
  Mail, 
  Layers, 
  Cpu, 
  Globe, 
  Monitor, 
  LogOut, 
  ExternalLink
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LucideAngularModule],
  template: `
    <div class="feature-shell animate-slide-up">
      
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-info">
          <h1 class="page-title">Account <span class="text-primary">Settings</span></h1>
          <p class="text-subtle">Manage your personal information and security preferences.</p>
        </div>
      </header>

      <div class="profile-grid">
        
        <!-- Sidebar Profile Card -->
        <aside class="profile-side">
          <div class="glass-card user-main-card">
            <div class="avatar-container">
              <div class="avatar-ring">
                <div class="avatar-image">
                  {{ initials() }}
                </div>
              </div>
              <div class="online-indicator"></div>
            </div>
            
            <div class="user-info-brief">
              <h2 class="user-fullname">{{ user()?.name }}</h2>
              <p class="user-email">{{ user()?.email }}</p>
            </div>

            <div class="badge-row">
              <span class="badge" [class.primary]="user()?.role === 'admin'" [class.secondary]="user()?.role === 'resident'">
                <lucide-icon [name]="user()?.role === 'admin' ? 'shield-check' : 'user'" size="12"></lucide-icon>
                {{ user()?.role | uppercase }}
              </span>
            </div>

            <div class="card-divider"></div>

            <button class="logout-action-btn" (click)="logout()">
              <lucide-icon name="log-out" size="18"></lucide-icon>
              <span>Sign Out</span>
            </button>
          </div>

          <div class="glass-card status-card">
            <div class="status-header">
              <span class="status-dot"></span>
              <span class="status-text">System Status: Online</span>
            </div>
            <p class="status-desc">All systems are operational. You are connected to the primary society node.</p>
          </div>
        </aside>

        <!-- Main Content Options -->
        <main class="profile-main">
          
          <!-- Sections -->
          <div class="glass-card settings-section">
            <div class="section-header">
              <div class="section-title-box">
                <lucide-icon name="user" size="18" class="text-primary"></lucide-icon>
                <h3>Personal Information</h3>
              </div>
            </div>
            
            <div class="settings-list">
              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="user" size="16"></lucide-icon>
                  <span>Full Name</span>
                </div>
                <div class="item-value">{{ user()?.name }}</div>
              </div>

              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="mail" size="16"></lucide-icon>
                  <span>Email Address</span>
                </div>
                <div class="item-value">{{ user()?.email }}</div>
              </div>

              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="layers" size="16"></lucide-icon>
                  <span>Assigned Unit</span>
                </div>
                <div class="item-value">{{ user()?.flatId || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <div class="glass-card settings-section mt-6">
            <div class="section-header">
              <div class="section-title-box">
                <lucide-icon name="monitor" size="18" class="text-primary"></lucide-icon>
                <h3>System & Environment</h3>
              </div>
            </div>
            
            <div class="settings-list">
              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="cpu" size="16"></lucide-icon>
                  <span>Instance Mode</span>
                </div>
                <div class="item-value">
                  <span class="badge ghost accent">MOCK DEMO</span>
                </div>
              </div>

              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="globe" size="16"></lucide-icon>
                  <span>API Gateway</span>
                </div>
                <div class="item-value text-primary flex items-center gap-1">
                  localhost:3000
                  <lucide-icon name="external-link" size="12"></lucide-icon>
                </div>
              </div>

              <div class="setting-item">
                <div class="item-label">
                  <lucide-icon name="monitor" size="16"></lucide-icon>
                  <span>Client Version</span>
                </div>
                <div class="item-value text-muted">v2.1.0-stable</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    .feature-shell { display: flex; flex-direction: column; gap: 32px; }
    .page-header { display: flex; flex-direction: column; gap: 8px; }
    .page-title { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; color: var(--text-main); margin: 0; }
    .page-title span { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }
    
    /* Side Sidebar */
    .user-main-card { padding: 40px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .avatar-container { position: relative; margin-bottom: 24px; }
    .avatar-ring { padding: 4px; border: 2px solid var(--primary); border-radius: 50%; background: var(--bg-surface); }
    .avatar-image { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 800; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .online-indicator { position: absolute; bottom: 8px; right: 8px; width: 18px; height: 18px; background: #10b981; border: 3px solid var(--bg-surface); border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
    
    .user-info-brief h2 { font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0 0 4px; }
    .user-info-brief p { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
    .badge-row { margin-top: 16px; }
    
    .card-divider { width: 100%; height: 1px; background: var(--border); margin: 32px 0 24px; }
    .logout-action-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border-radius: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: 600; cursor: pointer; transition: var(--transition); }
    .logout-action-btn:hover { background: rgba(239, 68, 68, 0.12); transform: translateY(-2px); }

    .status-card { padding: 20px; margin-top: 24px; }
    .status-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
    .status-text { font-size: 0.75rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; }
    .status-desc { font-size: 0.8rem; color: var(--text-subtle); margin: 0; line-height: 1.5; }

    /* Main Settings Content */
    .settings-section { overflow: hidden; }
    .section-header { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .section-title-box { display: flex; align-items: center; gap: 10px; }
    .section-title-box h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 0; }
    
    .settings-list { padding: 8px 0; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border); transition: var(--transition); }
    .setting-item:last-child { border-bottom: none; }
    .setting-item:hover { background: rgba(255, 255, 255, 0.02); }
    
    .item-label { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }
    .item-value { color: var(--text-main); font-weight: 600; font-size: 0.875rem; }

    .mt-6 { margin-top: 24px; }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

    @media (max-width: 1024px) {
      .profile-grid { grid-template-columns: 1fr; }
      .profile-side { width: 100%; }
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  user = signal<User | null>(null);

  constructor() {
    this.user.set(this.authService.currentUser());
  }

  initials(): string {
    const user = this.user();
    const name = user?.name ?? '';
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() {
    this.authService.logout();
  }
}
