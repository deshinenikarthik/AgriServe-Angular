import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';

// Import your Service and your Model
import { ComplianceService } from '../../../core/services/compliance/compliance';
import { AuditDTO } from '../../../models/compliance.models';

@Component({
  selector: 'app-allaudits', 
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './allaudits.html' 
})
export class AllauditsComponent implements OnInit {
  
  audits: AuditDTO[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadAuditsFromBackend();
  }

  loadAuditsFromBackend(): void {
    this.complianceService.getAllAudits().subscribe({
      next: (data: any) => {
        console.log('🟢 AUDITS RECEIVED:', data);

        if (Array.isArray(data)) {
          this.audits = data;
        } else if (data && data.content) {
          this.audits = data.content;
        } else if (data && data.data) {
          this.audits = data.data;
        } else {
          this.audits = data; 
        }

        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Failed to load audits:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const safeStatus = status?.toUpperCase();
    if (safeStatus === 'COMPLETED') return 'bg-green-100 text-green-800 border-green-200';
    if (safeStatus === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (safeStatus === 'FAILED' || safeStatus === 'NON_COMPLIANT') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200'; 
  }

  formatStatusText(status: string): string {
    if (!status) return 'Unknown';
    const cleanStatus = status.replace('_', ' ').toLowerCase();
    return cleanStatus.replace(/\b\w/g, char => char.toUpperCase());
  }

  fillRecord(auditId: number): void {
    this.router.navigate(['/compliance/fill-record'], {
      queryParams: { 
        entityId: auditId, 
        type: 'AUDIT' 
      }
    });
  }

  goToAuditForm(): void {
    // Assuming you registered it as 'auditform' in your app.routes.ts
    this.router.navigate(['/compliance/auditform']); 
  }

  goToUpdateForm(audit: AuditDTO): void {
    // We pass the selected audit object inside the "state" property
    this.router.navigate(['/compliance/auditform'], { state: { auditData: audit } }); 
  }
}