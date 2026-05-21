import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { TrainingService } from '../../../core/services/training/training';
import { AttendanceUpdateRequest, Participation, Workshop, FarmerAttendance } from '../../../models/training.models';


@Component({
  selector: 'app-attendance-details',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './attendancedetails.html'
})
export class AttendancedetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private trainingService = inject(TrainingService);
  private cdr = inject(ChangeDetectorRef);

  currentWorkshopId: number = 0;
  isSubmitting = false;
  isLoading = true;

  workshop: Workshop | any = {
    title: 'Loading details...',
    programTitle: '...',
    date: new Date().toISOString(),
    location: 'Loading...',
    enrolledCount: 0,
    status: 'Loading...'
  };

  farmers: FarmerAttendance[] = [];

  // Workshop Status dropdown
  workshopStatusOptions = ['Scheduled', 'Completed', 'Cancelled'];
  selectedStatus = 'Scheduled';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.currentWorkshopId = Number(idParam);
      this.loadWorkshopDetails();
      this.loadParticipants();
    }
  }

  loadWorkshopDetails() {
    this.trainingService.getWorkshopById(this.currentWorkshopId).subscribe({
      next: (data) => {
        this.workshop = data;
        this.workshop.enrolledCount = this.farmers.length;
        this.selectedStatus = data.status || 'Scheduled';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load workshop details', err)
    });
  }

  loadParticipants() {
    this.isLoading = true;
    this.trainingService.getParticipantsForWorkshop(this.currentWorkshopId).subscribe({
      next: (data: Participation[]) => {
        this.farmers = data.map(p => ({
          participationId: p.participationId,
          farmerId: p.farmerId,
          name: `Farmer ID: ${p.farmerId}`, // Mock name
          village: 'Registered Online',
          phone: 'N/A',
          isPresent: p.attendanceStatus === 'Present',
          status: p.attendanceStatus
        }));

        this.workshop.enrolledCount = this.farmers.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load participants', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.farmers.forEach(farmer => farmer.isPresent = isChecked);
  }

  submitBulkAttendance() {
    this.isSubmitting = true;
    const attendanceUpdates: AttendanceUpdateRequest[] = this.farmers.map(farmer => ({
      participationId: farmer.participationId,
      newAttendanceStatus: farmer.isPresent ? 'Present' : 'Absent'
    }));

    this.trainingService.submitBulkAttendance(attendanceUpdates).subscribe({
      next: (responses) => {
        alert('Attendance successfully saved to database!');
        this.isSubmitting = false;
        this.farmers.forEach(f => f.status = f.isPresent ? 'Present' : 'Absent');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update attendance', err);
        alert('Error saving attendance. Check your console logs.');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // PATCH workshop status
  updateWorkshopStatus() {
    this.trainingService.updateWorkshopStatus(this.currentWorkshopId, this.selectedStatus).subscribe({
      next: (updatedWorkshop) => {
        this.workshop.status = updatedWorkshop.status;
        alert('Workshop status updated successfully!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update workshop status:', err);
        alert('Failed to update workshop status.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': 'bg-amber-100 text-amber-800 border-amber-200',
      'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return map[status] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  }
}