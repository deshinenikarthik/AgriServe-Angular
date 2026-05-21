import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComplianceRecordDTO } from '../../../models/compliance.models';
import { ComplianceService } from '../../../core/services/compliance/compliance';

@Component({
  selector: 'app-recentcompliancerecords',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recentcompliancerecords.html'
})
export class RecentcompliancerecordsComponent implements OnInit {
  
  records: ComplianceRecordDTO[] = []; 
  isLoading: boolean = true;

  constructor(
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef // Added ChangeDetectorRef for consistency
  ) {}

  ngOnInit(): void {
    this.fetchRecentRecords();
  }

  fetchRecentRecords(): void {
    this.complianceService.getAllComplianceRecords().subscribe({
      next: (data: any) => { // Changed to 'any' to allow safe extraction
        console.log('🟢 RECENT COMPLIANCE RECORDS RECEIVED:', data);

        let extractedRecords: ComplianceRecordDTO[] = [];

        // 1. Safe extraction wrapper (Standardized with AllRecords)
        if (Array.isArray(data)) {
          extractedRecords = data;
        } else if (data && data.content) {
          extractedRecords = data.content;
        } else if (data && data.data) {
          extractedRecords = data.data;
        } else {
          extractedRecords = data ? [data] : []; 
        }

        // 2. Sort by newest first and grab exactly the top 5
        this.records = extractedRecords
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5); 

        this.isLoading = false;
        this.cdr.detectChanges(); // Force the UI to draw the data
      },
      error: (error: any) => {
        console.error('Failed to load recent compliance records:', error);
        this.isLoading = false;
      }
    });
  }

  // Standardized formatter with "Unknown" fallback
  formatType(type: string): string {
    if (!type) return 'Unknown';
    // Kept your excellent Title Case formatting!
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  // Combined badge logic to handle ALL possible Spring Boot statuses
  getResultClass(result: string): string {
    const safeResult = result?.toUpperCase() || '';
    
    if (safeResult === 'COMPLIANT' || safeResult === 'PASS' || safeResult === 'APPROVED') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (safeResult === 'NON-COMPLIANT' || safeResult === 'NON_COMPLIANT' || safeResult === 'REJECTED') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      // Default / Pending / Under Review / Requires Attention
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  }
}