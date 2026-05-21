import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// 👇 Replaced FormsModule with ReactiveFormsModule
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { AdvisoryService } from '../../../core/services/advisory/advisory'; 
import { AdvisoryContent } from '../../../models/advisory.models';

@Component({
  selector: 'app-session-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './sessionportal.html'
})
export class SessionPortalComponent implements OnInit, OnDestroy {
  // 👇 Reactive Form setup
  sessionForm!: FormGroup;
  
  // Data from backend
  farmers: any[] = [];
  activeContent: AdvisoryContent[] = [];
  recentSessions: any[] = [];
  
  // State
  selectedSession: any = null;
  isSubmitting = false;
  isLoading = true;
  submitError = ''; // Replaces the API failure alert
  
  // Logged-in user info
  currentOfficerName = '';
  currentOfficerId = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private advisoryService: AdvisoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.currentOfficerName = localStorage.getItem('name') || localStorage.getItem('officerName') || '';
    this.currentOfficerId = Number(localStorage.getItem('officerId')) || 0;

    this.loadPortalData();
  }

  // Initialize form with validation rules matching your backend DTO
  initForm(): void {
    this.sessionForm = this.fb.group({
      farmerId: [0, [Validators.required, Validators.min(1)]],
      contentId: [0, [Validators.required, Validators.min(1)]],
      feedback: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  // Helper getter for easy access to form fields in the HTML
  get f() { return this.sessionForm.controls; }

  loadPortalData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      farmers: this.advisoryService.getFarmers().pipe(catchError(() => of([]))),
      content: this.advisoryService.getActiveContent().pipe(catchError(() => of([]))),
      sessions: this.advisoryService.getAllSessions().pipe(catchError(err => {
        console.error('Sessions API Error:', err);
        return of([]); 
      }))
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses) => {
        this.farmers = responses.farmers;
        this.activeContent = responses.content;

        this.recentSessions = responses.sessions.filter(
          (session: any) => session.officerName === this.currentOfficerName
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Major failure:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onLogSession(): void {
    this.submitError = ''; // Clear previous errors

    // 1. Check validation instantly without alerts
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched(); // Triggers the red text in HTML
      return; 
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    // 2. Extract clean values from the form
    const formVals = this.sessionForm.value;
    const payload = {
      farmerId: Number(formVals.farmerId),
      contentId: Number(formVals.contentId),
      officerId: this.currentOfficerId,
      feedback: formVals.feedback,
      status: 'Completed'
    };

    this.advisoryService.createSession(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPortalData(); 
          this.resetForm();
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error saving session:', err);
          // Replaces the error alert
          this.submitError = 'Failed to save session. Please check your connection and try again.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
  }

  viewDetails(session: any): void { 
    this.selectedSession = session; 
    this.cdr.detectChanges();
  }
  
  closeDetails(): void { 
    this.selectedSession = null; 
    this.cdr.detectChanges();
  }
  
  resetForm(): void { 
    this.sessionForm.reset({ farmerId: 0, contentId: 0, feedback: '' });
    this.submitError = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}