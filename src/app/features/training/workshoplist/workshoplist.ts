import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Workshop } from '../../../models/training.models';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './workshoplist.html'
})
export class WorkshopListComponent {
  @Input() workshops: Workshop[] = [];
  @Input() programTitle: string = '';

  @Output() editWorkshop   = new EventEmitter<Workshop>();
  @Output() deleteWorkshop = new EventEmitter<number>();

  onEdit(workshop: Workshop): void   { this.editWorkshop.emit(workshop); }
  onDelete(workshopId: number): void { this.deleteWorkshop.emit(workshopId); }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': 'bg-amber-100 text-amber-800 border-amber-200',
      'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return 'text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-opacity-50 ' + (map[status] ?? 'bg-gray-100 text-gray-800 border-gray-200');
  }
}