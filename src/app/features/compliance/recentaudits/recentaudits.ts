import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComplianceService } from '../../../core/services/compliance/compliance';
import { AuditDTO } from '../../../models/compliance.models';

@Component({
  selector: 'app-recentaudits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recentaudits.html'
})
export class RecentauditsComponent implements OnInit {
  
  // 2. Component now manages its own state
  audits: AuditDTO[] = [];
  isLoading: boolean = true;

  constructor(
    private auditService: ComplianceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchRecentAudits();
  }

  fetchRecentAudits(): void {
    // Replace 'getAllAudits()' with your actual service method name
    this.auditService.getAllAudits().subscribe({
      next: (data: any) => {
        console.log('🟢 RECENT AUDITS RECEIVED:', data);

        let extractedAudits: AuditDTO[] = [];

        // 3. Safe extraction wrapper to handle pagination or raw arrays
        if (Array.isArray(data)) {
          extractedAudits = data;
        } else if (data && data.content) {
          extractedAudits = data.content;
        } else if (data && data.data) {
          extractedAudits = data.data;
        } else {
          extractedAudits = data ? [data] : []; 
        }

        // 4. Sort by newest date first and slice exactly the top 5
        this.audits = extractedAudits
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5); 

        this.isLoading = false;
        this.cdr.detectChanges(); // Force Angular to draw the UI
      },
      error: (error: any) => {
        console.error('Failed to load recent audits:', error);
        this.isLoading = false;
      }
    });
  }

  // Helper method to assign badge colors based on AuditStatus
  getStatusClass(status: string): string {
    const stat = status?.toUpperCase() || '';
    if (stat === 'COMPLETED' || stat === 'PASSED' || stat === 'APPROVED') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (stat === 'IN_PROGRESS' || stat === 'SCHEDULED' || stat === 'PENDING') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200'; // For FAILED or ACTION_REQUIRED
    }
  }

  // Helper to format Enums with an 'Unknown' fallback
  formatStatus(status: string): string {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }
}