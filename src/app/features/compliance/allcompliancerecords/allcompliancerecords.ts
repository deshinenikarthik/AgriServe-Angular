import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../../../core/services/compliance/compliance';
import { ComplianceRecordDTO } from '../../../models/compliance.models';

@Component({
  selector: 'app-allcompliancerecords', 
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './allcompliancerecords.html' 
})
export class AllcompliancerecordsComponent implements OnInit {
  
  records: ComplianceRecordDTO[] = [];
  isLoading = true;

  // 👇 NEW: Track which row is expanded
  expandedRecordId: number | null = null;

  constructor(
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRecordsFromBackend();
  }

  loadRecordsFromBackend(): void {
    this.complianceService.getAllComplianceRecords().subscribe({
      next: (data: any) => {
        console.log('🟢 COMPLIANCE RECORDS RECEIVED:', data);

        if (Array.isArray(data)) {
          this.records = data;
        } else if (data && data.content) {
          this.records = data.content;
        } else if (data && data.data) {
          this.records = data.data;
        } else {
          this.records = data; 
        }

        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Failed to load compliance records:', error);
        this.isLoading = false;
      }
    });
  }

  // 👇 NEW: Toggle the details row
  toggleDetails(id: number | undefined): void {
    if (!id) return;
    // If clicking the same row that's already open, close it. Otherwise, open the new one.
    this.expandedRecordId = this.expandedRecordId === id ? null : id;
  }

  getResultBadgeClass(result: string): string {
    const safeResult = result?.toUpperCase();
    if (safeResult === 'COMPLIANT' || safeResult === 'APPROVED') return 'bg-green-100 text-green-800 border-green-200';
    if (safeResult === 'NON-COMPLIANT' || safeResult === 'NON_COMPLIANT' || safeResult === 'REJECTED') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200'; 
  }

  formatType(type: string): string {
    if (!type) return 'Unknown';
    return type.replace('_', ' '); 
  }
}