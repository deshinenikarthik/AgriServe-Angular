import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { TrainingprogramsComponent } from '../trainingprograms/trainingprograms';
import { AdvisorysessionsComponent } from '../advisorysessions/advisorysessions';
import { AllcompliancerecordsComponent } from '../allcompliancerecords/allcompliancerecords';
import { HeaderComponent } from '../../../features/shared/header/header';


@Component({
  selector: 'app-compliancerecordnavbar',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    TrainingprogramsComponent, 
    AdvisorysessionsComponent, 
    AllcompliancerecordsComponent,
    HeaderComponent
  ],
  templateUrl: './compliancerecordnavbar.html'
})
export class CompliancerecordnavbarComponent {
  // Default tab when the page loads
  activeTab: 'training' | 'advisory' | 'all' = 'training';

  // Method triggered by clicking the tabs
  switchTab(tab: 'training' | 'advisory' | 'all'): void {
    this.activeTab = tab;
  }
}