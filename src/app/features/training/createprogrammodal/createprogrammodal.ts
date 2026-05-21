import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { TrainingProgramRequest } from '../../../models/training.models';

@Component({
  selector: 'app-create-program-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './createprogrammodal.html'
})
export class CreateprogrammodalComponent {
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TrainingProgramRequest>();

  formData: TrainingProgramRequest = {
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  };

  // Frontend Validation matching your Java Annotations
  get isFormValid(): boolean {
    return !!this.formData.title &&
           this.formData.title.trim().length >= 3 &&
           this.formData.title.length <= 100 &&
           !!this.formData.description.trim() &&
           !!this.formData.startDate &&
           !!this.formData.endDate;
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    if (this.isFormValid) {
      this.save.emit(this.formData);
    }
  }
}