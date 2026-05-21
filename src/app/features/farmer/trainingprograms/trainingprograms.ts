import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';
import { FarmerService } from '../../../core/services/farmer/farmer';
import { TrainingProgram, Workshop } from '../../../models/farmer.models';
 
@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './trainingprograms.html'
})
export class TrainingComponent implements OnInit {
  
  programs: TrainingProgram[] = [];
  loading = true;
  error = false;

  expandedProgramId: number | null = null;
  workshops: Workshop[] = [];
  loadingWorkshops = false;
  registeringWorkshopId: number | null = null;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;
 
  constructor(
    private farmerService: FarmerService,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.fetchPrograms();
  }

  fetchPrograms(): void {
    this.farmerService.getAllTrainingPrograms().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.programs = data;
        } else if (data && data.content) {
          this.programs = data.content; 
        } else if (data && data.data) {
          this.programs = data.data;    
        } else {
          this.programs = [];
        }
        
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('❌ Failed to load training programs', err);
        this.error = true;
        this.loading = false;
        this.programs = [];
        this.cdr.detectChanges(); 
      },
    });
  }

  toggleWorkshops(programId: number | undefined): void {
    if (!programId) return;

    if (this.expandedProgramId === programId) {
      this.expandedProgramId = null;
      this.workshops = [];
      return;
    }

    this.expandedProgramId = programId;
    this.loadingWorkshops = true;
    
    this.farmerService.getWorkshops(programId).subscribe({
      next: (data) => {
        this.workshops = data;
        this.loadingWorkshops = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load workshops', err);
        this.loadingWorkshops = false;
        this.workshops = [];
        this.showToast('Could not load workshops for this program.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  registerForWorkshop(event: Event, workshop: any): void {
    event.stopPropagation();
    
    const targetId = workshop.workshopId || workshop.id;

    if (!targetId) {
      this.showToast('Invalid workshop data. Please try again.', 'error');
      return;
    }

    this.registeringWorkshopId = targetId;
    
    this.farmerService.registerForWorkshop(targetId).subscribe({
      next: (res) => {
        this.registeringWorkshopId = null;
        this.showToast('Successfully registered for the workshop!', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.registeringWorkshopId = null;
        this.showToast('Registration failed. You may already be registered.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }
 
  formatDateRange(start: any, end: any): string {
    if (!start || !end) return 'Dates TBD';
    const s = new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-IN',   { day: 'numeric', month: 'short', year: 'numeric' });
    if (s === e) return s;
    return `${s} – ${e}`;
  }
 
  getStatusClass(status: string): string {
    const safeStatus = status?.toUpperCase() || '';
    if (safeStatus === 'ACTIVE' || safeStatus === 'OPEN') return 'bg-green-50 text-green-700 border-green-200';
    if (safeStatus === 'UPCOMING' || safeStatus === 'SCHEDULED') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (safeStatus === 'COMPLETED') return 'bg-gray-100 text-gray-600 border-gray-200';
    if (safeStatus === 'CANCELLED') return 'bg-red-50 text-red-700 border-red-200';
    
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}