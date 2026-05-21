import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';
import { FarmerService } from '../../../core/services/farmer/farmer';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './uploaddocuments.html'
})
export class UploadDocumentsComponent implements OnInit {
  
  farmerIdDisplay = 'Loading...';
  actualFarmerId: number = 0; 

  documentType = '';
  driveLink = ''; 
  
  submitting = false;
  submitted = false;
  errorMsg = '';
 
  documentTypes: string[] = [
    'Aadhaar', 
    'Land Permit',
    'Bank Passbook',
    'Crop Insurance',
    'Soil Health Card',
    'PAN Card',
    'Voter ID',
    'Other',
  ];
 
  constructor(
    private farmerService: FarmerService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.farmerService.getFarmer().subscribe({
      next: (data: any) => {
        if (data && data.farmerId) {
          this.actualFarmerId = data.farmerId;
          this.farmerIdDisplay = `FRM-${this.actualFarmerId}`;
          this.cdr.detectChanges(); 
        }
      },
      error: (err: any) => {
        console.error('❌ Failed to load farmer ID', err);
        this.farmerIdDisplay = 'FRM-ERROR';
        this.cdr.detectChanges();
      }
    });
  }
 
  isValid(): boolean {
    return !!this.documentType && !!this.driveLink && this.actualFarmerId !== 0;
  }
 
  onSubmit(): void {
    if (!this.isValid() || this.submitting) return;
 
    this.submitting = true;
    this.cdr.detectChanges();

    // 👇 URL SANITIZATION: Catch "drive.google.com..." and turn it into "https://drive.google.com..."
    let cleanLink = this.driveLink.trim();
    if (!/^https?:\/\//i.test(cleanLink)) {
      cleanLink = 'https://' + cleanLink;
    }
 
    const payload = {
      farmerId: this.actualFarmerId, 
      docType: this.documentType,
      fileURI: cleanLink, // Save the fully sanitized absolute URL to the database
    };

    this.farmerService
      .uploadDocument(payload)
      .subscribe({
        next: (response: any) => {
          this.submitting = false;
          this.submitted = true; 
          
          this.documentType = '';
          this.driveLink = '';
          this.errorMsg = '';
          
          this.cdr.detectChanges(); 
          
          setTimeout(() => {
            this.submitted = false;
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err: any) => {
          this.errorMsg = 'Failed to save document link. Please try again.';
          this.submitting = false;
          this.cdr.detectChanges();
        },
      });
  }
 
  onCancel(): void {
    this.router.navigate(['/farmer/documents']);
  }
}