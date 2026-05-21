import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // 👈 1. Import Location

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  
  userData = {
    name: 'Loading...',
    email: 'Loading...',
    role: 'Loading...',
    contactInfo: 'Loading...'
  };

  // 👇 2. Inject Location into the constructor
  constructor(private location: Location) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userData = {
      name: localStorage.getItem('name') || 'User Profile',
      email: localStorage.getItem('email') || 'No email provided',
      role: localStorage.getItem('user_role') || 'Unknown Role',
      contactInfo: localStorage.getItem('contactInfo') || 'No contact info provided'
    };
  }

  formatRole(role: string): string {
    if (!role) return '';
    return role.replace(/([A-Z])/g, ' $1').trim();
  }

  getInitials(): string {
    return this.userData.name !== 'User Profile' ? this.userData.name.charAt(0).toUpperCase() : 'U';
  }

  // 👇 3. Add the goBack method
  goBack(): void {
    this.location.back();
  }
}