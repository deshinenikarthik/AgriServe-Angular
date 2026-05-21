import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrainingService } from '../../../core/services/training/training';
import { WorkshopRequest } from '../../../models/training.models';

@Component({
  selector: 'app-schedule-workshop-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduleworkshopmodal.html'
})
export class ScheduleworkshopmodalComponent implements OnInit {
  
  // 👇 NEW: We need the program ID to link this workshop to the correct program!
  @Input() programId!: number; 
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private trainingService = inject(TrainingService);
  private http = inject(HttpClient); // Used to fetch officers

  formData = {
    title: '',
    location: '',
    date: '',
    officerId: null as number | null
  };

  // State variables
  availableOfficers: any[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.fetchOfficers();
  }

  // 1. FETCH OFFICERS FROM BACKEND
  fetchOfficers(): void {
    // Replaced {role} with the exact enum value expected by Spring Boot
    const role = 'ExtensionOfficer'; 
    
    this.http.get<any[]>(`http://localhost:8081/api/users/role/${role}`).subscribe({
      next: (data) => {
        this.availableOfficers = data;
      },
      error: (err) => {
        console.error('Failed to load extension officers', err);
      }
    });
  }

  get isFormValid(): boolean {
    return !!this.formData.title && 
           this.formData.title.trim().length >= 3 &&
           !!this.formData.location && 
           !!this.formData.date && 
           !!this.formData.officerId;
  }

  onCancel(): void {
    this.close.emit();
  }

  // 2. SAVE TO BACKEND
  onSubmit(): void {
    if (!this.isFormValid || !this.programId) return;

    this.isSubmitting = true;

    // Construct the payload exactly as the backend expects it
    const requestPayload: WorkshopRequest = {
      programId: this.programId,
      title: this.formData.title,
      officerId: this.formData.officerId!,
      location: this.formData.location,
      date: this.formData.date 
    };

    this.trainingService.scheduleWorkshop(requestPayload).subscribe({
      next: (savedWorkshop) => {
        this.isSubmitting = false;
        // Emit the saved workshop back to the parent component so it can update the table
        this.save.emit(savedWorkshop); 
      },
      error: (err) => {
        console.error('Error scheduling workshop:', err);
        this.isSubmitting = false;
        alert('Failed to schedule workshop. Please try again.');
      }
    });
  }
}