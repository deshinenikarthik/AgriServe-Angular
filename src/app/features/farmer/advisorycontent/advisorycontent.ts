import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';

import { FarmerService } from '../../../core/services/farmer/farmer';
import { AdvisoryContent } from '../../../models/farmer.models';
 
@Component({
  selector: 'app-advisory-content', 
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './advisorycontent.html' 
})
export class AdvisoryContentComponent implements OnInit { 
  
  advisoryList: AdvisoryContent[] = [];
  loading = true;
  error = false;
 
  constructor(
    private farmerService: FarmerService,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.fetchAdvisoryContent();
  }

  fetchAdvisoryContent(): void {
    this.farmerService.getActiveAdvisoryContent().subscribe({
      next: (data: any) => {
        console.log('🟢 Advisory Content Received:', data);
        
        // Safely extract the array depending on how Spring Boot wrapped it
        if (Array.isArray(data)) {
          this.advisoryList = data;
        } else if (data && data.content) {
          this.advisoryList = data.content; 
        } else if (data && data.data) {
          this.advisoryList = data.data;    
        } else {
          this.advisoryList = [];
        }
        
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('❌ Failed to load advisory content', err);
        this.error = true;
        this.loading = false;
        this.advisoryList = [];
        this.cdr.detectChanges(); 
      },
    });
  }
 

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
    });
  }
 
  getCategoryClass(category: string): string {
    const cat = category?.toLowerCase() || '';
    
    if (cat.includes('protection')) return 'bg-green-100 text-green-800';
    if (cat.includes('water')) return 'bg-blue-100 text-blue-800';
    if (cat.includes('government') || cat.includes('scheme')) return 'bg-amber-100 text-amber-800';
    if (cat.includes('soil')) return 'bg-lime-100 text-lime-800';
    if (cat.includes('pest')) return 'bg-red-100 text-red-800';
    if (cat.includes('market')) return 'bg-purple-100 text-purple-800';
    
    return 'bg-gray-100 text-gray-800';
  }
 
  getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
      'Crop Protection':    'ti-shield-check',
      'Water Management':   'ti-droplet',
      'Government Schemes': 'ti-building-community',
      'Soil Health':        'ti-flask',
      'Pest Management':    'ti-bug',
      'Market Advisory':    'ti-trending-up',
    };
    return map[category] ?? 'ti-book';
  }
 
  getThumbBg(category: string): string {
    const map: Record<string, string> = {
      'Crop Protection':    '#E1F5EE',
      'Water Management':   '#E6F1FB',
      'Government Schemes': '#FAEEDA',
      'Soil Health':        '#EAF3DE',
      'Pest Management':    '#FCEBEB',
      'Market Advisory':    '#F3EEFF',
    };
    return map[category] ?? '#F1EFE8';
  }
 
  getThumbColor(category: string): string {
    const map: Record<string, string> = {
      'Crop Protection':    '#085041',
      'Water Management':   '#185FA5',
      'Government Schemes': '#BA7517',
      'Soil Health':        '#3B6B1A',
      'Pest Management':    '#A32D2D',
      'Market Advisory':    '#5B2D9E',
    };
    return map[category] ?? '#5F5E5A';
  }

  downloadDocument(uri: string | undefined): void {
    if (!uri || uri.trim() === '') {
      console.warn('No file URI available for this document.');
      return;
    }

    let finalUrl = uri.trim();
    
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }
}