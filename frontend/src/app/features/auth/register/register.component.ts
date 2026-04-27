import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { 
  LucideAngularModule, 
  Droplets, 
  User, 
  Mail, 
  Lock, 
  UserPlus,
  ShieldCheck,
  Zap,
  BarChart3,
  Cpu,
  AlertCircle,
  Users
} from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
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
          
          <h1 class="hero-title">Join the <span class="text-gradient">Future</span> of Water management.</h1>
          <p class="hero-sub">Create your account today and start tracking your society's water consumption with precision.</p>

          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-marker purple">
                <lucide-icon name="users" size="18"></lucide-icon>
              </div>
              <div class="feature-text">
                <h4>Role-Based Access</h4>
                <p>Tailored views for Admins & Residents</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-marker blue">
                <lucide-icon name="shield-check" size="18"></lucide-icon>
              </div>
              <div class="feature-text">
                <h4>Verified Accounts</h4>
                <p>Secure authentication for every user</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-marker green">
                <lucide-icon name="zap" size="18"></lucide-icon>
              </div>
              <div class="feature-text">
                <h4>Instant Setup</h4>
                <p>Connect your flat in seconds</p>
              </div>
            </div>
          </div>

          <div class="demo-box glass-card">
            <div class="demo-header">
              <lucide-icon name="shield-check" size="14" class="text-primary"></lucide-icon>
              <span>Security Note</span>
            </div>
            <p class="text-subtle" style="font-size: 0.8rem; margin: 0;">Your data is encrypted and managed according to society privacy standards.</p>
          </div>
        </div>
      </div>

      <!-- Right panel - form -->
      <div class="right-panel animate-fade-in">
        <div class="login-container">
          <div class="login-box glass-card">
            <div class="login-header">
              <h2>Create Account</h2>
              <p>Start your journey with AquaSmart</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="login-form">
              <div class="form-group">
                <label>Full Name</label>
                <mat-form-field appearance="outline" class="full-width saas-field">
                  <input matInput formControlName="name" placeholder="John Doe">
                  <lucide-icon matPrefix name="user" size="18"></lucide-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <mat-form-field appearance="outline" class="full-width saas-field">
                  <input matInput formControlName="email" type="email" placeholder="name@example.com">
                  <lucide-icon matPrefix name="mail" size="18"></lucide-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <label>Password</label>
                <mat-form-field appearance="outline" class="full-width saas-field">
                  <input matInput formControlName="password" type="password" placeholder="••••••••">
                  <lucide-icon matPrefix name="lock" size="18"></lucide-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <label>Your Role</label>
                <mat-form-field appearance="outline" class="full-width saas-field">
                  <lucide-icon matPrefix name="users" size="18"></lucide-icon>
                  <mat-select formControlName="role">
                    <mat-option value="resident">Resident</mat-option>
                    <mat-option value="admin">Admin</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div *ngIf="error()" class="error-msg animate-shake">
                <lucide-icon name="alert-circle" size="16"></lucide-icon>
                <span>{{ error() }}</span>
              </div>

              <button class="btn-primary login-btn" type="submit" [disabled]="loading() || registerForm.invalid">
                <span *ngIf="!loading()">Create Account</span>
                <span *ngIf="loading()" class="btn-loader"></span>
                <lucide-icon *ngIf="!loading()" name="user-plus" size="18"></lucide-icon>
              </button>
            </form>

            <div class="login-footer">
              <p>Already have an account? <a routerLink="/login">Sign in</a></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      min-height: 100vh;
      background: var(--bg-main);
      overflow: hidden;
      position: relative;
    }

    .login-page::before {
      content: '';
      position: absolute;
      top: -10%;
      right: -10%;
      width: 60%;
      height: 60%;
      background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
      filter: blur(80px);
      opacity: 0.4;
      pointer-events: none;
    }

    .left-panel {
      flex: 1.2;
      padding: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      border-right: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.3);
    }

    .left-content { max-width: 520px; }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 32px;
    }

    .brand-badge lucide-icon { color: var(--primary); }
    .brand-text { font-weight: 700; color: var(--text-main); font-size: 1.1rem; }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 20px;
      letter-spacing: -0.04em;
      color: var(--text-main);
    }

    .text-gradient {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-sub {
      font-size: 1.125rem;
      color: var(--text-subtle);
      line-height: 1.6;
      margin-bottom: 48px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 64px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .feature-marker {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-marker.purple { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
    .feature-marker.blue   { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .feature-marker.green  { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .feature-text h4 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-main); }
    .feature-text p { margin: 0; font-size: 0.875rem; color: var(--text-subtle); }

    .right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      z-index: 2;
    }

    .login-container {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .login-box { padding: 40px; }
    .login-header h2 { font-size: 1.75rem; font-weight: 800; margin: 0; color: var(--text-main); }
    .login-header p { color: var(--text-subtle); margin: 8px 0 32px; }

    .form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .saas-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: var(--bg-surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      padding: 0 16px !important;
    }

    .saas-field ::ng-deep .mdc-notched-outline { display: none; }
    .saas-field ::ng-deep .mat-mdc-form-field-infix { padding: 12px 0 !important; min-height: unset !important; }
    .saas-field lucide-icon { color: var(--text-subtle); margin-right: 12px; }

    .login-btn {
      width: 100%;
      height: 52px;
      margin-top: 12px;
      justify-content: center;
      gap: 12px;
      font-size: 1rem;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 10px;
      color: #ef4444;
      font-size: 0.875rem;
      margin: 12px 0;
    }

    .login-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-subtle);
    }

    .login-footer a { color: var(--primary); font-weight: 700; text-decoration: none; }

    /* Loader */
    .btn-loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Animations */
    .animate-fade-in-left { animation: fadeInLeft 0.6s ease-out; }
    .animate-fade-in { animation: fadeIn 0.6s ease-out 0.2s both; }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    @media (max-width: 1024px) {
      .left-panel { display: none; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['resident', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Registration failed. Please try again.');
        }
      });
    }
  }
}

