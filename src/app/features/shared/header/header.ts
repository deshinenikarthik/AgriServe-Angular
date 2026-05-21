import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

export interface HeaderMenuItem {
  label: string;
  route: string;
  allowedRoles: string[]; 
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  isHomePage: boolean = false; 
  
  userInitials: string = 'US';
  userName: string = 'My Account';
  
  filteredHeaderMenu: HeaderMenuItem[] = [];

  private allHeaderItems: HeaderMenuItem[] = [
    { label: 'Home', route: '/home', allowedRoles: ['FARMER', 'EXTENSIONOFFICER', 'ADMIN', 'PROGRAMMANAGER', 'COMPLIANCEOFFICER', 'AUDITOR'] },
    // Farmer
    { label: 'Farmer Dashboard', route: '/farmerdashboard', allowedRoles: ['FARMER'] },
    { label: 'My Documents', route: '/farmer/documents', allowedRoles: ['FARMER'] },
    { label: 'Training Program', route: '/farmer/training', allowedRoles: ['FARMER'] },
    { label: 'Advisory Content', route: '/farmer/advisorycontent', allowedRoles: ['FARMER'] },

    // Compliance Officer
    { label: 'Compliance Dashboard', route: '/compliancedashboard', allowedRoles: ['COMPLIANCEOFFICER'] },
    { label: 'Compliance Records', route: '/compliance/records', allowedRoles: ['COMPLIANCEOFFICER'] },
    { label: 'Audits', route: '/compliance/audits', allowedRoles: ['COMPLIANCEOFFICER'] },

    // Admin
    { label: 'Admin Dashboard', route: '/admindashboard', allowedRoles: ['ADMIN'] },
    { label: 'Users', route: '/admin/users', allowedRoles: ['ADMIN'] },

    // Extension Officer
    { label: 'Officer Dashboard', route: '/officerdashboard', allowedRoles: ['EXTENSIONOFFICER'] },
    { label: 'Content Library', route: '/officer/advisory/content', allowedRoles: ['EXTENSIONOFFICER'] },
    { label: 'Advisory Session', route: '/officer/advisory/session', allowedRoles: ['EXTENSIONOFFICER'] },



    // Program Manager
    { label: 'Manager Dashboard', route: '/managerdashboard', allowedRoles: ['PROGRAMMANAGER'] }

  ];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url.includes('/home') || this.router.url === '/';
    });
  }

  ngOnInit(): void {
    this.isHomePage = this.router.url.includes('/home') || this.router.url === '/';

    const token = localStorage.getItem('jwt_token');
    this.isLoggedIn = !!token; 

    if (this.isLoggedIn) {
      
      // 👇 FIX 1: Read the correct key for the user's name
      const storedName = localStorage.getItem('name');
      
      if (storedName && storedName !== 'null') {
        this.userName = storedName;
        // Generate initials from their actual name (e.g., "Sarah Jenkins" -> "SJ")
        const nameParts = storedName.split(' ');
        if (nameParts.length > 1) {
          this.userInitials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
        } else {
          this.userInitials = storedName.substring(0, 2).toUpperCase();
        }
      } else {
        // Fallback if no name exists
        const rawRole = localStorage.getItem('user_role') || 'FARMER';
        const userRole = rawRole.toUpperCase().replace(/[^A-Z]/g, ''); 
        if (userRole.includes('COMPLIANCE')) this.userInitials = 'CO';
        else if (userRole.includes('FARMER')) this.userInitials = 'FA';
        else if (userRole.includes('ADMIN')) this.userInitials = 'AD';
        else if (userRole.includes('AUDITOR')) this.userInitials = 'AU';
      }

      // Filter the Top Menu based on the user's role
      const rawRole = localStorage.getItem('user_role') || 'FARMER';
      const userRole = rawRole.toUpperCase().replace(/[^A-Z]/g, ''); 
      this.filteredHeaderMenu = this.allHeaderItems.filter(item => 
        item.allowedRoles.includes(userRole)
      );
    }
  }

  logout(): void {
    // 👇 FIX 2: Clear ALL local storage items, including the new profile data
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('contactInfo');
    
    this.isLoggedIn = false;
    
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}