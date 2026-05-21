import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// 1. Import your Service and your Model (Make sure paths match your structure!)
import { ComplianceService } from '../../../core/services/compliance/compliance';
import { AdvisorySessionDTO } from '../../../models/compliance.models';

@Component({
  selector: 'app-advisorysessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advisorysessions.html'
})
export class AdvisorysessionsComponent implements OnInit {
  
  // Start with an empty array
  sessions: AdvisorySessionDTO[] = [];
  isLoading = true;

  // Inject the Router, Service, AND ChangeDetectorRef
  constructor(
    private router: Router,
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadSessionsFromBackend();
  }

  loadSessionsFromBackend(): void {
    this.complianceService.getAdvisorySessions().subscribe({
      next: (data: any) => {
        console.log('🟢 ADVISORY SESSIONS RECEIVED:', data);

        // 2. Safely extract the array just like we did for programs
        if (Array.isArray(data)) {
          this.sessions = data;
        } else if (data && data.content) {
          this.sessions = data.content;
        } else if (data && data.data) {
          this.sessions = data.data;
        } else {
          this.sessions = data; 
        }

        this.isLoading = false;
        
        // 3. Force Angular to redraw the screen!
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Failed to load advisory sessions:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const safeStatus = status?.toUpperCase();
    if (safeStatus === 'COMPLETED') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }

  fillRecord(sessionId: number): void {
    this.router.navigate(['/compliance/fill-record'], {
      queryParams: { 
        entityId: sessionId, 
        type: 'ADVISORY_SESSION' 
      }
    });
  }
}