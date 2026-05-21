import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatcardComponent } from '../statcard/statcard';
import { RecentcompliancerecordsComponent } from '../recentcompliancerecords/recentcompliancerecords';
import { RecentauditsComponent } from '../recentaudits/recentaudits';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { StatCardData, ComplianceRecordDTO, AuditDTO } from '../../../models/compliance.models';
import { ComplianceService } from '../../../core/services/compliance/compliance';

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule, StatcardComponent, RecentcompliancerecordsComponent, 
    RecentauditsComponent, SidebarComponent, HeaderComponent],
  templateUrl: './compliancedashboard.html'
})
export class ComplianceDashboardComponent implements OnInit {
  
  // 1. Initialize stats with a loading state (e.g., '...')
  dashboardStats: StatCardData[] = [
    { 
      title: 'Total Records', 
      value: '...', 
      border: 'border-l-gray-500', 
      bg: 'bg-gray-50', 
      text: 'text-gray-600', 
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' 
    },
    { 
      title: 'Total Audits', 
      value: '...', 
      border: 'border-l-green-600', 
      bg: 'bg-green-50', 
      text: 'text-green-600', 
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' 
    },
    { 
      title: 'Pending Audits', 
      value: '...', 
      border: 'border-l-amber-500', 
      bg: 'bg-amber-50', 
      text: 'text-amber-600', 
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' 
    }
  ];

  // 2. Inject your service AND the ChangeDetectorRef
  constructor(
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef  // <--- ADDED THIS HERE
  ) {}

  ngOnInit(): void {
    this.fetchDashboardMetrics();
  }

  // 3. Fetch data and dynamically update the array values
  fetchDashboardMetrics(): void {
    
    // Get total compliance records
    this.complianceService.getAllComplianceRecords().subscribe({
      next: (data: any) => {
        const records = Array.isArray(data) ? data : (data.content || data.data || []);
        this.dashboardStats[0].value = records.length; 
        
        // <--- ADDED THIS: Force Angular to redraw the card!
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed to fetch record stats', err)
    });

    // Get audit statistics
    this.complianceService.getAllAudits().subscribe({
      next: (data: any) => {
        const audits = Array.isArray(data) ? data : (data.content || data.data || []);
        
        // Update "Total Audits"
        this.dashboardStats[1].value = audits.length; 

        // Calculate and update "Pending Audits"
        const pendingCount = audits.filter((a: AuditDTO) => 
          a.status === 'IN_PROGRESS' || a.status === 'SCHEDULED' || a.status === 'PENDING'
        ).length;
        
        this.dashboardStats[2].value = pendingCount;

        // <--- ADDED THIS: Force Angular to redraw the cards!
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed to fetch audit stats', err)
    });
  }
}