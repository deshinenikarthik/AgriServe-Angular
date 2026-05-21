import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core'; // 👈 added inject
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 added Router import
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { AdvisoryService } from '../../../core/services/advisory/advisory'; 

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent
  ],
  templateUrl: './officerdashboard.html'
})
export class OfficerDashboardComponent implements OnInit, OnDestroy {
  officerName = '';
  workshops: any[] = []; 

  isLoading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();
  
  // 👇 NEW: Inject the router
  private router = inject(Router);

  constructor(
    private advisoryService: AdvisoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.officerName = localStorage.getItem('name') || 'Officer';
    const currentOfficerId = Number(localStorage.getItem('user_id'));

    this.advisoryService.getMyWorkshops(currentOfficerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.workshops = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error fetching workshops:', err);
          this.errorMessage = 'Could not load your assigned workshops.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // 👇 NEW: Navigation Method
  openAttendanceDetails(workshopId: number): void {
    // ⚠️ NOTE: Make sure this path matches your app.routes.ts exactly!
    // If your route is 'officer/advisory/session/:id', update the string below to match.
    console.log('Navigating to Workshop ID:', workshopId);
    this.router.navigate(['/officer/attendance', workshopId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}