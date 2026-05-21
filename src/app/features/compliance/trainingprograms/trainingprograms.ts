import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ComplianceService } from '../../../core/services/compliance/compliance'; 

// Mapped exactly to your Java fields
export interface TrainingProgramDTO {
  programId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerId: number;
}

@Component({
  selector: 'app-trainingprograms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainingprograms.html'
})
export class TrainingprogramsComponent implements OnInit {
  // 1. Start with an empty array
  programs: TrainingProgramDTO[] = [];
  
  // 2. Add a loading state to track network requests
  isLoading = true; 

  // 3. Inject BOTH the Router and the ComplianceService
  constructor(
    private router: Router,
    private complianceService: ComplianceService,
    private cdr: ChangeDetectorRef
  ) {}

  // 4. Trigger the fetch when the component loads
  ngOnInit(): void {
    this.loadProgramsFromBackend();
  }

  // 5. The method that actually calls your Spring Boot API
  loadProgramsFromBackend(): void {
    this.complianceService.getTrainingPrograms().subscribe({
      next: (data: any) => {
        console.log('🟢 DATA RECEIVED IN COMPONENT:', data); // Check the F12 Console for this!

        if (Array.isArray(data)) {
          this.programs = data;
        } else if (data && data.content) {
          this.programs = data.content;
        } else {
          this.programs = data; 
        }

        this.isLoading = false;
        
        // 🔥 FORCE ANGULAR TO REDRAW THE SCREEN
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Failed to load training programs from backend:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    // Added a safety check (.toUpperCase()) just in case the backend sends lowercase enums
    const safeStatus = status?.toUpperCase();
    if (safeStatus === 'COMPLETED') return 'bg-green-100 text-green-800 border-green-200';
    if (safeStatus === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200'; // SCHEDULED/PENDING
  }

  fillRecord(programId: number): void {
    // Navigates to the form and passes the ID and Type in the URL
    this.router.navigate(['/compliance/fill-record'], {
      queryParams: { 
        entityId: programId, 
        type: 'TRAINING_PROGRAM' 
      }
    });
  }
}