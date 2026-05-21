import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplianceService } from '../../../core/services/compliance/compliance';

@Component({
  selector: 'app-compliancerecordform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compliancerecordform.html'
})
export class CompliancerecordformComponent implements OnInit {
  recordForm!: FormGroup;
  isSubmitting = false;

  // 👇 NEW: Toast Notification State
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private complianceService = inject(ComplianceService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const entityId = this.route.snapshot.queryParamMap.get('entityId');
    const type = this.route.snapshot.queryParamMap.get('type');

    this.recordForm = this.fb.group({
      entityId: [{ value: entityId, disabled: true }, Validators.required],
      type: [{ value: type, disabled: true }, Validators.required],
      result: ['', Validators.required],
      notes: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.showToast('Please fill in all required fields.', 'error');
      return;
    }

    this.isSubmitting = true;
    const payload = this.recordForm.getRawValue();

    this.complianceService.submitRecord(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Optional: Show success toast briefly before navigating
        this.showToast('Record saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/compliance/records']), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error saving record:', err);
        this.showToast('Failed to save the record. Please try again.', 'error');
      }
    });
  }

  // 👇 Helper to show auto-hiding toast
  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  goBack(): void {
    this.router.navigate(['/compliance/records']);
  }
}