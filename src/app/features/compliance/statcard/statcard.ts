import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statcard.html'
})
export class StatcardComponent {
  // @Input() makes this component modular and ready for backend data!
  @Input() title: string = 'Metric';
  @Input() value: string | number = 0;
  
  // Tailwind color classes passed from the parent
  @Input() borderClass: string = 'border-l-gray-500';
  @Input() iconBgClass: string = 'bg-gray-50';
  @Input() iconTextClass: string = 'text-gray-600';
  
  // Pass raw SVG strings or use an icon library later
  @Input() iconSvg: string = ''; 
}