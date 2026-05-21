import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplianceService } from '../../../core/services/compliance/compliance';
import { AuditPayload } from '../../../models/compliance.models';

@Component({
  selector: 'app-auditform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditform.html'
})
export class AuditformComponent {
  
  auditData: AuditPayload = {
    scope: '',
    findings: '',
    status: 'PENDING'
  };

  isSubmitting = false;
  isUpdateMode = false;
  updateAuditId: number | null = null;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  private complianceService = inject(ComplianceService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // 👇 Catch the data passed from the table's "Update" button
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { auditData: any };
    
    if (state && state.auditData) {
      this.isUpdateMode = true;
      this.updateAuditId = state.auditData.auditId; // Adjust 'auditId' if your primary key is named differently
      
      // Pre-fill the form
      this.auditData = {
        scope: state.auditData.scope || '',
        findings: state.auditData.findings || '',
        status: state.auditData.status || 'PENDING'
      };
    }
  }

  onSubmit(): void {
    if (!this.auditData.scope || this.auditData.scope.trim().length === 0) {
      this.showToast('Scope is required!', 'error');
      return;
    }

    this.isSubmitting = true;

    // 👇 Decide whether to PUT (Update) or POST (Create)
    const request$ = this.isUpdateMode 
      ? this.complianceService.updateAudit(this.updateAuditId!, this.auditData)
      : this.complianceService.createAudit(this.auditData);

    request$.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showToast(this.isUpdateMode ? 'Audit updated successfully!' : 'Audit created successfully!', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/compliance/audits']);
        }, 1500);
      },
      error: (error) => {
        console.error('🔴 Action failed:', error);
        this.isSubmitting = false;
        this.showToast('Failed to save the audit. Please try again.', 'error');
      }
    });
  }

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

  cancel(): void {
    this.router.navigate(['/compliance/audits']);
  }
}