import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { WorkshopListComponent }           from '../workshoplist/workshoplist';
import { ScheduleworkshopmodalComponent }  from '../scheduleworkshopmodal/scheduleworkshopmodal';
import { EditworkshopmodalComponent }      from '../editworkshopmodal/editworkshopmodal';
import { TrainingService } from '../../../core/services/training/training';
import { Workshop, TrainingProgram, WorkshopRequest } from '../../../models/training.models';


@Component({
  selector: 'app-programdetails',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    WorkshopListComponent,
    ScheduleworkshopmodalComponent,
    EditworkshopmodalComponent,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './programdetails.html'
})
export class ProgramdetailsComponent implements OnInit {

  private route           = inject(ActivatedRoute);
  private trainingService = inject(TrainingService);
  private cdr             = inject(ChangeDetectorRef);

  currentProgramId = 0;
  isScheduleModalOpen = false;
  isEditWorkshopModalOpen = false;
  selectedWorkshop: Workshop | null = null;

  isLoading = true;

  program: TrainingProgram = {
    programId: 0, title: 'Loading…', description: '', startDate: '', endDate: '', status: '', managerId: 0
  };
  workshops: Workshop[] = [];

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  private toastTimer: any;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.currentProgramId = Number(idParam);
      this.loadRealData();
    }
  }

  loadRealData(): void {
    this.isLoading = true;

    this.trainingService.getProgramById(this.currentProgramId).subscribe({
      next: (data) => { this.program = data; this.cdr.detectChanges(); },
      error: (err)  => console.error('Failed to load program:', err)
    });

    this.trainingService.getWorkshopsByProgram(this.currentProgramId).subscribe({
      next: (data) => {
        this.workshops = data;
        this.isLoading  = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load workshops:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── SCHEDULE (Create) Workshop ──────────────
  openScheduleModal():  void { this.isScheduleModalOpen = true;  }
  closeScheduleModal(): void { this.isScheduleModalOpen = false; }

  handleScheduleWorkshop(newWorkshop: Workshop) {
  this.workshops.push(newWorkshop); 
  this.closeScheduleModal();
  this.showToast('Workshop scheduled successfully!', 'success');
}

  // ── EDIT Workshop ───────────────────────────
  openEditWorkshopModal(workshop: Workshop): void {
    this.selectedWorkshop       = workshop;
    this.isEditWorkshopModalOpen = true;
  }
  closeEditWorkshopModal(): void {
    this.isEditWorkshopModalOpen = false;
    this.selectedWorkshop        = null;
  }

  handleUpdateWorkshop(formData: WorkshopRequest): void {
    if (!this.selectedWorkshop?.workshopId) return;
    const id = this.selectedWorkshop.workshopId;

    this.trainingService.updateWorkshop(id, formData).subscribe({
      next: (updated) => {
        const idx = this.workshops.findIndex(w => w.workshopId === id);
        if (idx !== -1) this.workshops[idx] = updated;
        this.isEditWorkshopModalOpen = false;
        this.selectedWorkshop = null;
        this.showToast(`Workshop "${updated.title}" updated!`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating workshop:', err);
        this.showToast('Failed to update workshop.', 'error');
      }
    });
  }

  // ── DELETE Workshop ─────────────────────────
  handleDeleteWorkshop(workshopId: number): void {
    const w = this.workshops.find(w => w.workshopId === workshopId);
    if (!confirm(`Delete workshop "${w?.title ?? workshopId}"?`)) return;

    this.trainingService.deleteWorkshop(workshopId).subscribe({
      next: () => {
        this.workshops = this.workshops.filter(w => w.workshopId !== workshopId);
        this.showToast('Workshop deleted.', 'info');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting workshop:', err);
        this.showToast('Failed to delete workshop.', 'error');
      }
    });
  }

  // ── Toast ───────────────────────────────────
  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType    = type;
    this.cdr.detectChanges();
    this.toastTimer = setTimeout(() => { this.toastMessage = ''; this.cdr.detectChanges(); }, 3500);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return 'text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-opacity-50 ' + (map[status] ?? 'bg-gray-100 text-gray-800 border-gray-200');
  }
}