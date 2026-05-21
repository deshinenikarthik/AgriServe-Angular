import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';
import { FarmerService } from '../../../core/services/farmer/farmer';
import { Document } from '../../../models/farmer.models';
 
@Component({
  selector: 'app-my-documents',
  standalone: true,
  // 👇 Added SidebarComponent and HeaderComponent to imports
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './mydocuments.html'
  // Notice: styleUrls was removed since we are using 100% Tailwind now!
})
export class MyDocumentsComponent implements OnInit {
  
  documents: Document[] = [];
  loading = true;
 
  constructor(
    private farmerService: FarmerService,
    private cdr: ChangeDetectorRef // 👈 Injected ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.farmerService.getDocuments().subscribe({
      next: (data: any) => {
        console.log('🟢 Documents Received:', data);
        
        // Safely extract the array depending on how Spring Boot wrapped it
        if (Array.isArray(data)) {
          this.documents = data;
        } else if (data && data.content) {
          this.documents = data.content;
        } else if (data && data.data) {
          this.documents = data.data;
        } else {
          this.documents = [];
        }
        
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Force UI Redraw
      },
      error: (err: any) => {
        console.error('❌ Failed to load documents', err);
        this.documents = [];
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Force UI Redraw
      },
    });
  }
 
  // --- Derived State (Calculated on the fly) ---

  get accepted(): number {
    return this.documents.filter((d) => d.verificationStatus?.toUpperCase() === 'VERIFIED').length;
  }
 
  get pending(): number {
    return this.documents.filter((d) => d.verificationStatus?.toUpperCase() === 'PENDING').length;
  }
 
  get rejected(): number {
    return this.documents.filter((d) => d.verificationStatus?.toUpperCase() === 'REJECTED').length;
  }
 
  // --- UI Formatting Helpers ---

  getStatusClass(status: string): string {
    const safeStatus = status?.toUpperCase();
    // 👇 Updated to check for VERIFIED instead of ACCEPTED
    if (safeStatus === 'VERIFIED') return 'bg-green-50 text-green-700 border-green-200';
    if (safeStatus === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (safeStatus === 'REJECTED') return 'bg-red-50 text-red-700 border-red-200';
    
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
 
  getDocIcon(docType: string): string {
    const map: Record<string, string> = {
      'Aadhaar Card':         'ti-id-badge',
      'Land Permit (Khasra)': 'ti-map',
      'Bank Passbook':        'ti-building-bank',
      'Crop Insurance':       'ti-shield',
      'Soil Health Card':     'ti-leaf',
      'PAN Card':             'ti-credit-card',
      'Voter ID':             'ti-user-check',
    };
    return map[docType] ?? 'ti-file';
  }
 
  getDocIconBg(docType: string): string {
    const blueTypes = ['Aadhaar Card', 'Land Permit (Khasra)', 'Bank Passbook', 'Voter ID', 'PAN Card'];
    // 👇 Converted to return exact Tailwind classes!
    return blueTypes.includes(docType) 
      ? 'bg-blue-50 text-blue-600' 
      : 'bg-amber-50 text-amber-600';
  }
 
  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  openDocument(url: string | undefined): void {
    if (url) {
      // Opens the link in a new browser tab safely
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No file URI available for this document.');
    }
  }
}