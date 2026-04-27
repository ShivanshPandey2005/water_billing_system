import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminOverviewComponent } from './features/admin/admin-overview.component';
import { ManageFlatsComponent } from './features/admin/manage-flats.component';
import { ManageUsageComponent } from './features/admin/manage-usage.component';
import { ManageBillingComponent } from './features/admin/manage-billing.component';
import { ResidentOverviewComponent } from './features/resident/resident-overview.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

import { 
  LucideAngularModule, 
  Construction 
} from 'lucide-angular';

@Component({
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div style="padding: 64px 24px; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
      <div style="width: 80px; height: 80px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: var(--primary);">
        <lucide-icon name="construction" size="40"></lucide-icon>
      </div>
      <h2 style="color: var(--text-main); font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; margin-bottom: 8px;">Feature Coming Soon</h2>
      <p style="max-width: 320px; line-height: 1.6;">Our engineers are working hard to bring you this functionality. Stay tuned for updates!</p>
    </div>
  `
})
export class DummyComponent {}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminOverviewComponent, canActivate: [adminGuard] },
      { path: 'resident', component: ResidentOverviewComponent },
      { path: 'flats', component: ManageFlatsComponent, canActivate: [adminGuard] },
      { path: 'usage', component: ManageUsageComponent, canActivate: [adminGuard] },
      { path: 'bills', component: ManageBillingComponent, canActivate: [adminGuard] },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
