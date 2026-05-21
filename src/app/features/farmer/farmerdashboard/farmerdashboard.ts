import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { FarmerService } from '../../../core/services/farmer/farmer';
import { Workshop } from '../../../models/farmer.models';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  providers: [FarmerService],
  templateUrl: './farmerdashboard.html'
})
export class FarmerDashboardComponent implements OnInit {
  
  // 👇 Updated to match your exact FarmerResponseDTO
  farmer: any = {
    farmerId: null,
    name: 'Loading...',
    dob: '',
    gender: '',
    address: '',
    contactInfo: '',
    landSize: 0,
    cropType: 'N/A',
    status: 'Loading...',
    userId: null
  };

  workshops: Workshop[] = [];
  loading = true;

  constructor(
    private farmerService: FarmerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    // 1. Fetch Farmer Profile
    this.farmerService.getFarmer().subscribe({
      next: (data: any) => {
        console.log('🟢 Farmer Data Received:', data);
        if (data) {
          this.farmer = data;
        }
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('❌ Failed to load farmer profile', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });

    // 2. Fetch Upcoming Workshops
    this.farmerService.getMyWorkshops().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.workshops = data;
        } else if (data && data.content) {
          this.workshops = data.content;
        } else if (data && data.data) {
          this.workshops = data.data;
        }
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('❌ Failed to load workshops', err);
        this.workshops = [];
        this.cdr.detectChanges();
      },
    });
  }

  // --- Formatting Helpers ---

  formatDate(date: any): string {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getDay(date: any): string {
    if (!date) return '--';
    return new Date(date).getDate().toString().padStart(2, '0');
  }

  getMonth(date: any): string {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getTime(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    const safeStatus = status?.toUpperCase();
    if (safeStatus === 'REGISTERED') return 'bg-green-100 text-green-800 border-green-200';
    if (safeStatus === 'PENDING') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (safeStatus === 'OPEN') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200'; 
  }
}