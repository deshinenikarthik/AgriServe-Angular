import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Adjust paths to your actual folder structure
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';
import { AdminService } from '../../../core/services/admin/admin';
import { SystemUser } from '../../../models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './admindashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  
  loading = true;
  error = false;

  // Initializing at 0 while the backend fetches data
  stats = {
    totalUsers: 0,
    totalFarmers: 0,
    totalExtensionOfficers: 0,
    totalManagers: 0
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAndCalculateStats();
  }

  fetchAndCalculateStats(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data: any) => {
        
        let users: SystemUser[] = [];
        if (Array.isArray(data)) {
          users = data;
        } else if (data && data.content) {
          users = data.content; 
        } else if (data && data.data) {
          users = data.data;    
        }

        // Dynamically calculate the stats from the user list
        this.stats = {
          totalUsers: users.length,
          
          totalFarmers: users.filter(u => 
            u.role?.toUpperCase() === 'FARMER'
          ).length,
          
          totalExtensionOfficers: users.filter(u => 
            u.role?.toUpperCase().replace(/[^A-Z]/g, '') === 'EXTENSIONOFFICER'
          ).length,
          
          totalManagers: users.filter(u => 
            u.role?.toUpperCase() === 'MANAGER' || 
            u.role?.toUpperCase() === 'PROGRAMMANAGER'
          ).length
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Failed to fetch users for dashboard stats', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}