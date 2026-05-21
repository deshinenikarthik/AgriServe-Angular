import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { TrainingProgram, TrainingProgramRequest } from '../../../models/training.models';

@Component({
  selector: 'app-edit-program-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './editprogrammodal.html'
})
export class EditprogrammodalComponent implements OnInit {

  @Input() program!: TrainingProgram;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<TrainingProgramRequest>();

  formData: TrainingProgramRequest = {
    title: '', description: '', startDate: '', endDate: '', status: ''
  };

  readonly statusOptions = ['Draft', 'Active', 'Completed'];

  ngOnInit(): void {
    // Pre-populate form with the existing program data
    this.formData = {
      title:       this.program.title,
      description: this.program.description,
      startDate:   this.program.startDate,
      endDate:     this.program.endDate,
      status:      this.program.status
    };
  }

  get isFormValid(): boolean {
    return !!this.formData.title &&
           this.formData.title.trim().length >= 3 &&
           this.formData.title.length <= 100 &&
           !!this.formData.description.trim() &&
           !!this.formData.startDate &&
           !!this.formData.endDate;
  }

  onCancel(): void { this.close.emit(); }

  onSubmit(): void {
    if (this.isFormValid) { this.save.emit(this.formData); }
  }
}
