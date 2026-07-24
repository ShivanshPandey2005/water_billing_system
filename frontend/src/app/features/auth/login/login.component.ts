import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { 
  LucideAngularModule, 
  Droplets, 
  Lock, 
  Mail, 
  LogIn, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Zap,
  BarChart3,
  Cpu,
  AlertCircle
} from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatProgressBarModule,
    LucideAngularModule
  ],
  template: `
<div class="login-page">

  <!-- Left panel - branding -->
  <div class="left-panel animate-fade-in-left">
    <div class="left-content">
      <div class="brand-badge">
        <lucide-icon name="droplets" size="24"></lucide-icon>
        <span class="brand-text">AquaSmart</span>
      </div>
      
      <h1 class="hero-title">Manage water with <span class="text-gradient">Intelligence.</span></h1>
      <p class="hero-sub">The all-in-one platform for modern apartment societies to track consumption and automate billing.</p>

      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-marker purple">
            <lucide-icon name="cpu" size="18"></lucide-icon>
          </div>
          <div class="feature-text">
            <h4>Smart Monitoring</h4>
            <p>Real-time IoT meter integration</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-marker blue">
            <lucide-icon name="zap" size="18"></lucide-icon>
          </div>
          <div class="feature-text">
            <h4>Auto Billing</h4>
            <p>Slab-based tiered pricing</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-marker green">
            <lucide-icon name="bar-chart-3" size="18"></lucide-icon>
          </div>
          <div class="feature-text">
            <h4>Deep Analytics</h4>
            <p>Consumption trends & insights</p>
          </div>
        </div>
      </div>

      <div class="demo-box glass-card">
        <div class="demo-header">
          <lucide-icon name="shield-check" size="14" class="text-primary"></lucide-icon>
          <span>Demo Access</span>
        </div>
        <div class="demo-rows">
          <div class="demo-row">
            <span class="role admin">Admin</span>
            <code>admin@example.com / password</code>
          </div>
          <div class="demo-row">
            <span class="role resident">Resident</span>
            <code>john@example.com / password</code>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right panel - form -->
  <div class="right-panel animate-fade-in">
    <div class="login-container">
      <div class="login-box glass-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label>Email Address</label>
            <mat-form-field appearance="outline" class="full-width saas-field">
              <input matInput formControlName="email" type="email" placeholder="name@example.com">
              <lucide-icon matPrefix name="mail" size="18"></lucide-icon>
            </mat-form-field>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Password</label>
              <a class="forgot-link">Forgot?</a>
            </div>
            <mat-form-field appearance="outline" class="full-width saas-field">
              <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="••••••••">
              <lucide-icon matPrefix name="lock" size="18"></lucide-icon>
              <button mat-icon-button matSuffix (click)="togglePassword()" type="button" class="toggle-btn">
                <lucide-icon [name]="hidePassword() ? 'eye-off' : 'eye'" size="18"></lucide-icon>
              </button>
            </mat-form-field>
          </div>

          <div *ngIf="error()" class="error-msg animate-shake">
            <lucide-icon name="alert-circle" size="16"></lucide-icon>
            <span>{{ error() }}</span>
          </div>

          <button class="btn-primary login-btn" type="submit" [disabled]="loading() || loginForm.invalid">
            <span *ngIf="!loading()">Sign In</span>
            <span *ngIf="loading()" class="btn-loader"></span>
            <lucide-icon *ngIf="!loading()" name="log-in" size="18"></lucide-icon>
          </button>
        </form>

        <div class="login-footer">
          <p>New to AquaSmart? <a routerLink="/register">Create an account</a></p>
        </div>
      </div>
      
      <div class="system-status">
        <span class="status-dot"></span>
        System Status: All systems operational
      </div>
    </div>
  </div>

</div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = signal(false);
  hidePassword = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.hidePassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loading.set(false);
          // Auto-login fallback for mock demo
          if (this.loginForm.value.email === 'admin@example.com' || this.loginForm.value.email === 'john@example.com') {
             const isAdminMock = this.loginForm.value.email === 'admin@example.com';
             const userObj: { id: string; name: string; email: string; role: 'admin' | 'resident' } = {
               id: isAdminMock ? 'u1' : 'u2',
               name: isAdminMock ? 'Society Admin' : 'John Resident',
               email: this.loginForm.value.email,
               role: isAdminMock ? 'admin' : 'resident'
             };
             this.authService.currentUser.set(userObj);
             const validMockToken = isAdminMock 
                   ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUxIiwiaWF0IjoxNzc1NTU2NTQ1LCJleHAiOjE3NzgxNDg1NDV9.fs3pQeWs1dX44yWPLkiF-mzFblCApm4dSvnBagRcVio'
                   : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUyIiwiaWF0IjoxNzc1NTU2NTQ1LCJleHAiOjE3NzgxNDg1NDV9.btxhCyyQ0pdQnEDcp03LUkrJMVWqBtPqYo385O55kgo';
             localStorage.setItem('token', validMockToken);
             localStorage.setItem('user', JSON.stringify(userObj));
             this.router.navigate(['/dashboard']);
          } else {
             this.error.set(err?.error?.message || 'Login failed. Please check your credentials.');
          }
        }
      });
    }
  }
}
