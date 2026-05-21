import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => { 
        console.log('✅ Angular received the response:', response);
        
        // 1. Save standard Auth data
        if (response.token) {
          localStorage.setItem('jwt_token', response.token); 
        }
        if (response.userId) {
          localStorage.setItem('user_id', String(response.userId)); 
        }
        if (response.role) {
          localStorage.setItem('user_role', response.role); 
        }

        // 👇 2. NEW: Save the personal profile data!
        if (response.name) {
          localStorage.setItem('name', response.name);
        }
        if (response.email) {
          localStorage.setItem('email', response.email);
        }
        if (response.contactInfo) {
          localStorage.setItem('contactInfo', response.contactInfo);
        }

        // 3. Stop the loading spinner
        this.isLoading = false;

        // 4. Extract the role safely
        const userRole = response.role?.toUpperCase();

        // 5. 🚦 ROLE-BASED ROUTING
        switch (userRole) {
          case 'COMPLIANCEOFFICER':
          case 'ROLE_COMPLIANCEOFFICER': 
            this.router.navigate(['/compliancedashboard']);
            break;
            
          case 'FARMER':
          case 'ROLE_FARMER':
            this.router.navigate(['/farmerdashboard']);
            break;
            
          case 'ADMIN':
          case 'ROLE_ADMIN':
            this.router.navigate(['/admindashboard']);
            break;

          case 'EXTENSIONOFFICER':
          case 'ROLE_EXTENSIONOFFICER':
            this.router.navigate(['/officerdashboard']);
            break;

          case 'PROGRAMMANAGER':
          case 'ROLE_PROGRAMMANAGER':
            this.router.navigate(['/managerdashboard']);
            break;

          case 'AUDITOR':
          case 'ROLE_AUDITOR':
            this.router.navigate(['/auditordashboard']);
            break;
            
          default:
            console.warn('Unknown role received:', userRole, '- redirecting to home.');
            this.router.navigate(['/home']);
            break;
        }
      },
      error: (err: any) => { 
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
        console.error('❌ Login error', err);
      }
    });
  }
}