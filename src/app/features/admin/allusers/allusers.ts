import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar'; 
import { HeaderComponent } from '../../../features/shared/header/header';
import { AdminService } from '../../../core/services/admin/admin';
import { SystemUser } from '../../../models/admin.models';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './allusers.html'
})
export class AllUsersComponent implements OnInit {
  
  users: SystemUser[] = [];
  loading = true;
  error = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.users = data;
        } else if (data && data.content) {
          this.users = data.content; 
        } else if (data && data.data) {
          this.users = data.data;    
        } else {
          this.users = [];
        }
        
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('❌ Failed to load users', err);
        this.error = true;
        this.loading = false;
        this.users = [];
        this.cdr.detectChanges(); 
      }
    });
  }

  // Deactivate Logic
  onDeactivate(userId: number): void {
    if (!confirm('Are you sure you want to deactivate this user? They will lose login access.')) return;

    this.adminService.deactivateUser(userId).subscribe({
      next: () => {
        // Optimistically update UI
        const userIndex = this.users.findIndex(u => u.userId === userId);
        if (userIndex !== -1) {
          this.users[userIndex].status = 'INACTIVE';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to deactivate user:', err);
        alert('Failed to deactivate user. Check permissions.');
      }
    });
  }

  // Delete Logic
  onDelete(userId: number): void {
    if (!confirm('Warning: Are you sure you want to permanently delete this user? This cannot be undone.')) return;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        // Remove the user from the UI immediately
        this.users = this.users.filter(u => u.userId !== userId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user. They may have dependent records preventing deletion.');
      }
    });
  }


  // Safe Status Check
  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200'; // Fallback for null
    
    const s = status.toUpperCase();
    if (s === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (s === 'INACTIVE' || s === 'SUSPENDED') return 'bg-red-100 text-red-800';
    if (s === 'PENDING') return 'bg-amber-100 text-amber-800';
    
    return 'bg-gray-100 text-gray-800';
  }

  // Safe Deactivate Check (Moves logic out of HTML)
  canDeactivate(status: string | null | undefined): boolean {
    if (!status) return true; // If status is null, allow deactivation
    return status.toUpperCase() !== 'INACTIVE';
  }

  // Safe Active Dot Check
  isActive(status: string | null | undefined): boolean {
    if (!status) return true; // Assuming null means active by default
    return status.toUpperCase() === 'ACTIVE';
  }

  // Safe Role check
  getRoleBadgeClass(role: string | null | undefined): string {
    if (!role) return 'bg-gray-50 text-gray-700 border-gray-200';
    
    const r = role.toUpperCase();
    if (r === 'ADMIN') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (r === 'FARMER') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (r === 'MANAGER' || r === 'PROGRAMMANAGER') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (r === 'COMPLIANCEOFFICER' || r === 'AUDITOR') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (r === 'EXTENSIONOFFICER' || r === 'EXTENSION_OFFICER') return 'bg-blue-50 text-blue-700 border-blue-200';
    
    return 'bg-gray-50 text-gray-700 border-gray-200'; 
  }

  formatRoleName(role: string | null | undefined): string {
    if (!role) return 'Unknown Role';
    
    const r = role.toUpperCase();
    if (r === 'EXTENSIONOFFICER' || r === 'EXTENSION_OFFICER') return 'Extension Officer';
    if (r === 'PROGRAMMANAGER') return 'Program Manager';
    if (r === 'COMPLIANCEOFFICER') return 'Compliance Officer';
    
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}