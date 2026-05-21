import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { CreateprogrammodalComponent }  from '../createprogrammodal/createprogrammodal';
import { EditprogrammodalComponent }    from '../editprogrammodal/editprogrammodal';
import { TrainingService } from '../../../core/services/training/training';
import { TrainingProgram, TrainingProgramRequest } from '../../../models/training.models';


type ActiveTab = 'all' | 'active' | 'draft' | 'completed';

@Component({
  selector: 'app-program-manager-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, CreateprogrammodalComponent, EditprogrammodalComponent, SidebarComponent, HeaderComponent],
  templateUrl: './programmanagerdashboard.html'
})
export class ProgrammanagerdashboardComponent implements OnInit {

  private router          = inject(Router);
  private trainingService = inject(TrainingService);
  private cdr             = inject(ChangeDetectorRef);

  // State
  allPrograms:   TrainingProgram[] = [];
  isLoading = true;
  activeTab: ActiveTab = 'all';

  // Modal state
  isCreateModalOpen = false;
  isEditModalOpen   = false;
  selectedProgram: TrainingProgram | null = null;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  private toastTimer: any;

  readonly tabs: { key: ActiveTab; label: string }[] = [
    { key: 'all',       label: 'All Programs' },
    { key: 'active',    label: 'Active'       },
    { key: 'draft',     label: 'Draft'        },
    { key: 'completed', label: 'Completed'    }
  ];

  get filteredPrograms(): TrainingProgram[] {
    if (this.activeTab === 'all') return this.allPrograms;
    return this.allPrograms.filter(p =>
      p.status.toLowerCase() === this.activeTab
    );
  }

  countByStatus(status: string): number {
    return this.allPrograms.filter(p => p.status.toLowerCase() === status).length;
  }

  ngOnInit(): void { this.loadPrograms(); }

  loadPrograms(): void {
    this.isLoading = true;
    this.trainingService.getAllPrograms().subscribe({
      next: (data) => {
        this.allPrograms = data;
        this.isLoading   = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch programs:', err);
        this.showToast('Could not load programs. Is the backend running?', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: ActiveTab): void { this.activeTab = tab; }

  viewDetails(programId: number): void {
    this.router.navigate(['manager/programdetails', programId]);
  }

  // ── CREATE ──────────────────────────────────
  openCreateModal():  void { this.isCreateModalOpen = true;  }
  closeCreateModal(): void { this.isCreateModalOpen = false; }

  handleSaveProgram(req: TrainingProgramRequest): void {
    this.trainingService.createProgram(req).subscribe({
      next: (created) => {
        this.allPrograms.unshift(created);
        this.isCreateModalOpen = false;
        this.showToast(`Program "${created.title}" created successfully!`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating program:', err);
        this.showToast('Failed to create program. Check console.', 'error');
      }
    });
  }

  // ── EDIT ────────────────────────────────────
  openEditModal(event: MouseEvent, program: TrainingProgram): void {
    event.stopPropagation(); // prevent navigating to program details
    this.selectedProgram  = program;
    this.isEditModalOpen  = true;
  }
  closeEditModal(): void { this.isEditModalOpen = false; this.selectedProgram = null; }

  handleUpdateProgram(req: TrainingProgramRequest): void {
    if (!this.selectedProgram) return;
    const id = this.selectedProgram.programId;
    this.trainingService.updateProgram(id, req).subscribe({
      next: (updated) => {
        const idx = this.allPrograms.findIndex(p => p.programId === id);
        if (idx !== -1) this.allPrograms[idx] = updated;
        this.isEditModalOpen = false;
        this.selectedProgram = null;
        this.showToast(`Program "${updated.title}" updated!`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating program:', err);
        this.showToast('Failed to update program.', 'error');
      }
    });
  }

  // ── DELETE ──────────────────────────────────
  deleteProgram(event: MouseEvent, program: TrainingProgram): void {
    event.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${program.title}"?\nThis will also delete all associated workshops.`)) return;

    this.trainingService.deleteProgram(program.programId).subscribe({
      next: () => {
        this.allPrograms = this.allPrograms.filter(p => p.programId !== program.programId);
        this.showToast(`Program "${program.title}" deleted.`, 'info');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting program:', err);
        this.showToast('Failed to delete program.', 'error');
      }
    });
  }

  // ── TOAST ───────────────────────────────────
  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType    = type;
    this.cdr.detectChanges();
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 3500);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active':    'bg-green-100 text-green-800 border-green-200',
      'Draft':     'bg-gray-100 text-gray-800 border-gray-200',
      'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return 'text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-opacity-50 ' + (map[status] ?? 'bg-gray-100 text-gray-800 border-gray-200');
  }
}