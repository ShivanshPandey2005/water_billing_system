import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';
import { 
  LucideAngularModule, 
  Building2, 
  User, 
  Layers, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-angular';

@Component({
  selector: 'app-flat-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    LucideAngularModule
  ],
  template: `
    <div class="saas-dialog animate-fade-in">
      
      <!-- Dialog Header -->
      <header class="dialog-header">
        <div class="header-content">
          <div class="icon-wrap">
            <lucide-icon [name]="data ? 'building-2' : 'plus'" size="20"></lucide-icon>
          </div>
          <div>
            <h2 class="dialog-title">{{ data ? 'Edit Flat' : 'Add New Flat' }}</h2>
            <p class="dialog-subtitle">Configure residential unit details</p>
          </div>
        </div>
        <button class="close-btn" (click)="onCancel()">
          <lucide-icon name="x" size="20"></lucide-icon>
        </button>
      </header>
      
      <form [formGroup]="flatForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <div class="form-body">
          
          <!-- Flat Number -->
          <div class="form-field">
            <label class="field-label">Flat Number</label>
            <div class="input-group" [class.error]="flatForm.get('flatNumber')?.invalid && flatForm.get('flatNumber')?.touched">
              <lucide-icon name="building-2" size="18" class="field-icon"></lucide-icon>
              <input type="text" formControlName="flatNumber" placeholder="e.g. 101, B-402" class="saas-input">
            </div>
            <span class="error-text" *ngIf="flatForm.get('flatNumber')?.hasError('required') && flatForm.get('flatNumber')?.touched">
              Flat number is required
            </span>
          </div>

          <!-- Floor -->
          <div class="form-field">
            <label class="field-label">Floor</label>
            <div class="input-group" [class.error]="flatForm.get('floor')?.invalid && flatForm.get('floor')?.touched">
              <lucide-icon name="layers" size="18" class="field-icon"></lucide-icon>
              <input type="number" formControlName="floor" placeholder="e.g. 1, 4" class="saas-input">
            </div>
            <span class="error-text" *ngIf="flatForm.get('floor')?.hasError('required') && flatForm.get('floor')?.touched">
              Floor is required
            </span>
          </div>

          <!-- Owner Name -->
          <div class="form-field">
            <label class="field-label">Owner Name</label>
            <div class="input-group" [class.error]="flatForm.get('ownerName')?.invalid && flatForm.get('ownerName')?.touched">
              <lucide-icon name="user" size="18" class="field-icon"></lucide-icon>
              <input type="text" formControlName="ownerName" placeholder="e.g. John Doe" class="saas-input">
            </div>
            <span class="error-text" *ngIf="flatForm.get('ownerName')?.hasError('required') && flatForm.get('ownerName')?.touched">
              Owner name is required
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
          <button type="submit" class="btn-primary" [disabled]="flatForm.invalid || loading()">
            <span *ngIf="!loading()">{{ data ? 'Update Flat' : 'Create Flat' }}</span>
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
    .input-group:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
    .input-group.error { border-color: #ef4444; }
    .field-icon { color: var(--text-muted); }
    .saas-input { background: transparent; border: none; color: var(--text-main); padding: 10px 0; width: 100%; font-size: 0.875rem; outline: none; }
    .error-text { font-size: 0.75rem; color: #ef4444; font-weight: 500; }
    .form-error { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #ef4444; font-size: 0.85rem; margin-top: 8px; }

    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
    .btn-primary { height: 44px; padding: 0 20px; gap: 8px; font-weight: 600; }
    .btn-secondary { height: 44px; padding: 0 20px; background: transparent; border: 1px solid var(--border); color: var(--text-subtle); border-radius: 8px; font-weight: 600; cursor: pointer; transition: var(--transition); }
    .btn-secondary:hover { background: var(--bg-surface); color: var(--text-main); }
  `]
})
export class FlatDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  apiService = inject(ApiService);
  dialogRef = inject(MatDialogRef<FlatDialogComponent>);

  flatForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.flatForm = this.fb.group({
      flatNumber: ['', [Validators.required]],
      floor: ['', [Validators.required, Validators.min(0)]],
      ownerName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.flatForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.flatForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const request = this.data 
        ? this.apiService.updateFlat(this.data._id, this.flatForm.value)
        : this.apiService.createFlat(this.flatForm.value);

      request.subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.dialogRef.close(true);
          } else {
            this.error.set(res.message || 'Operation failed');
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

