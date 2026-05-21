import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { Workshop, WorkshopRequest } from '../../../models/training.models';


@Component({
  selector: 'app-edit-workshop-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './editworkshopmodal.html'
})
export class EditworkshopmodalComponent implements OnInit {

  @Input() workshop!: Workshop;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<WorkshopRequest>();

  formData: WorkshopRequest = {
    programId: 0, title: '', officerId: 0, location: '', date: ''
  };

  // ⚠️ TESTING ONLY — hardcoded officer list.
  // PRODUCTION: Fetch from User Service via HTTP.
  availableOfficers = [
    { id: 301, name: 'Officer Rajesh' },
    { id: 302, name: 'Officer Priya'  }
  ];

  ngOnInit(): void {
    // Pre-populate with existing workshop values
    // Convert ISO datetime from backend to "datetime-local" input format (YYYY-MM-DDTHH:mm)
    const datePart = this.workshop.date
      ? this.workshop.date.substring(0, 16)  // "2025-06-15T10:00"
      : '';

    this.formData = {
      programId: this.workshop.programId,
      title:     this.workshop.title,
      officerId: this.workshop.officerId,
      location:  this.workshop.location,
      date:      datePart
    };
  }

  get isFormValid(): boolean {
    return !!this.formData.title &&
           this.formData.title.trim().length >= 3 &&
           !!this.formData.location &&
           !!this.formData.date &&
           !!this.formData.officerId;
  }

  onCancel(): void { this.close.emit(); }
  onSubmit(): void { if (this.isFormValid) this.save.emit(this.formData); }
}
