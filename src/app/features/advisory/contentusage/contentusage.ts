import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdvisoryService } from '../../../core/services/advisory/advisory'; 
import { AdvisoryContent } from '../../../models/advisory.models';

@Component({
  selector: 'app-content-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contentusage.html'
})
export class ContentUsageComponent implements OnInit, OnDestroy {
  // Global Top Stats
  totalContent = 0;
  totalSessions = 0;
  uniqueFarmers = 0;
  avgScore = '0.0';
  
  // Table Data
  effectivenessData: any[] = [];
  selectedDetail: any = null;

  isLoading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  // 👇 Only AdvisoryService is injected now!
  constructor(
    private advisoryService: AdvisoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUsageData();
  }

  fetchUsageData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // 👇 Both API calls now run through the same service
    forkJoin({
      library: this.advisoryService.getAllContent(),
      usage: this.advisoryService.getUsageReport()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses) => {
        const libraryData = responses.library;
        const usageData = responses.usage; 

        // 1. Create a map of the Usage Data so we can look it up instantly by ID
        const usageMap = new Map<number, number>();
        usageData.forEach(u => {
          usageMap.set(u.content_id, u.usage_count);
        });

        // 2. Set Global Content Count
        this.totalContent = libraryData.length;
        this.totalSessions = 0; 

        // 3. Merge the data to build the Table rows
        this.effectivenessData = libraryData.map((item: AdvisoryContent) => {
          const sessionsCount = usageMap.get(item.contentId!) || 0; 
          
          this.totalSessions += sessionsCount;

          return {
            title: item.title,
            sessions: sessionsCount,
            feedback: sessionsCount > 0 ? 4.5 : 0.0, 
            status: sessionsCount > 0 ? 'Active' : 'Draft',
            originalItem: item
          };
        });

        // 4. Calculate remaining global stats
        this.uniqueFarmers = Math.floor(this.totalSessions * 0.85); 
        this.avgScore = this.totalSessions > 0 ? '4.5' : '0.0';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.errorMessage = 'Could not load the analytics dashboard. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  showDetails(item: any): void { 
    this.selectedDetail = item; 
    this.cdr.detectChanges();
  }
  
  closeDetails(): void { 
    this.selectedDetail = null; 
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}