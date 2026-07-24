import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';
import { 
  LucideAngularModule, 
  Droplets, 
  Smartphone, 
  Plus, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-angular';

@Component({
  selector: 'app-usage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    LucideAngularModule
  ],
  template: `
    <div class="saas-dialog animate-fade-in">
      
      <!-- Dialog Header -->
      <header class="dialog-header">
        <div class="header-content">
          <div class="icon-wrap droplets">
            <lucide-icon name="droplets" size="20"></lucide-icon>
          </div>
          <div>
            <h2 class="dialog-title">Record Meter Reading</h2>
            <p class="dialog-subtitle">Log current water consumption for a flat</p>
          </div>
        </div>
        <button class="close-btn" (click)="onCancel()">
          <lucide-icon name="x" size="20"></lucide-icon>
        </button>
      </header>

      <form [formGroup]="usageForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <div class="form-body">

          <!-- Select Flat -->
          <div class="form-field">
            <label class="field-label">Select Residential Unit</label>
            <div class="input-group select-wrap" [class.error]="usageForm.get('flatId')?.invalid && usageForm.get('flatId')?.touched">
              <lucide-icon name="smartphone" size="18" class="field-icon"></lucide-icon>
              <mat-select formControlName="flatId" placeholder="Choose Flat..." class="saas-select-field">
                <mat-option *ngFor="let flat of data.flats" [value]="flat._id">
                  <div class="option-content">
                    <span class="flat-num">{{ flat.flatNumber }}</span>
                    <span class="owner-name">— {{ flat.ownerName }}</span>
                  </div>
                </mat-option>
              </mat-select>
            </div>
            <span class="error-text" *ngIf="usageForm.get('flatId')?.hasError('required') && usageForm.get('flatId')?.touched">
              Please select a flat
            </span>
          </div>

          <!-- Current Reading -->
          <div class="form-field">
            <label class="field-label">Current Meter Reading (m³)</label>
            <div class="input-group" [class.error]="usageForm.get('reading')?.invalid && usageForm.get('reading')?.touched">
              <lucide-icon name="droplets" size="18" class="field-icon"></lucide-icon>
              <input type="number" formControlName="reading" placeholder="e.g. 125.5" step="0.1" class="saas-input">
            </div>
            <p class="field-hint">Enter the latest value shown on the meter</p>
            <span class="error-text" *ngIf="usageForm.get('reading')?.invalid && usageForm.get('reading')?.touched">
              Valid consumption reading is required
            </span>
          </div>

          <div *ngIf="error()" class="form-error animate-shake">
            <lucide-icon name="alert-circle" size="16"></lucide-icon>
            {{ error() }}
          </div>
        </div>

        <footer class="dialog-footer">
          <button type="button" class="btn-secondary" (click)="onCancel()" [disabled]="loading()">
            Cancel
          </button>
          <button type="submit" class="btn-primary" [disabled]="usageForm.invalid || loading()">
            <span *ngIf="!loading()">Record Reading</span>
            <span *ngIf="loading()" class="saas-loader mini"></span>
            <lucide-icon *ngIf="!loading()" name="check" size="18"></lucide-icon>
          </button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .header-content { display: flex; gap: 16px; }
    .icon-wrap {
      width: 44px;
      height: 44px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }
    .icon-wrap.droplets { color: #38bdf8; }
    .dialog-title { font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0; }
    .dialog-subtitle { font-size: 0.875rem; color: var(--text-muted); margin: 2px 0 0; }
    .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; transition: var(--transition); }
    .close-btn:hover { background: var(--bg-surface); color: var(--text-main); }

    .form-body { display: flex; flex-direction: column; gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.05em; }
    .input-group {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      transition: var(--transition);
    }
    .input-group.select-wrap { padding-right: 8px; }
    .input-group:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
    .input-group.error { border-color: #ef4444; }
    
    .saas-select-field { width: 100%; font-size: 0.875rem; color: var(--text-main); }
    ::ng-deep .mat-mdc-select-trigger { height: 42px; display: flex; align-items: center; }
    ::ng-deep .mat-mdc-select-value { color: var(--text-main) !important; }
    
    .option-content { display: flex; gap: 8px; align-items: center; }
    .flat-num { font-weight: 700; color: var(--primary); }
    .owner-name { color: var(--text-muted); font-size: 0.85rem; }

    .field-icon { color: var(--text-muted); }
    .saas-input { background: transparent; border: none; color: var(--text-main); padding: 10px 0; width: 100%; font-size: 0.875rem; outline: none; }
    .field-hint { font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0; }
    .error-text { font-size: 0.75rem; color: #ef4444; font-weight: 500; }
    
    .form-error { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #ef4444; font-size: 0.85rem; margin-top: 8px; }

    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
    .btn-primary { height: 44px; padding: 0 20px; gap: 8px; font-weight: 600; }
    .btn-secondary { height: 44px; padding: 0 20px; background: transparent; border: 1px solid var(--border); color: var(--text-subtle); border-radius: 8px; font-weight: 600; cursor: pointer; transition: var(--transition); }
    .btn-secondary:hover { background: var(--bg-surface); color: var(--text-main); }
  `]
})
export class UsageDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  apiService = inject(ApiService);
  dialogRef = inject(MatDialogRef<UsageDialogComponent>);

  usageForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { flats: any[] }) {
    this.usageForm = this.fb.group({
      flatId: ['', [Validators.required]],
      reading: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.usageForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      this.apiService.addUsage(this.usageForm.value).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.dialogRef.close(true);
          } else {
            this.error.set(res.message || 'Failed to record reading');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Something went wrong. Please try again.');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

