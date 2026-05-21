import { Component, ChangeDetectorRef } from '@angular/core'; // 👈 Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    contactInfo: '',
    password: '',
    role: 'Farmer',
    dob: '',
    gender: '',
    address: '',
    landSize: null as unknown as number, 
    cropType: ''
  };

  isLoading: boolean = false;
  
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  // 👇 Inject ChangeDetectorRef here
  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.toastMessage = ''; 

    this.authService.register(this.registerData).subscribe({
      next: (response: any) => { 
        this.handleSuccess();
      },
      error: (err: any) => { 
        if (err.status === 201 || err.status === 200) {
          this.handleSuccess();
          return; 
        }

        this.isLoading = false;
        let parsedErrorMessage = 'Registration failed. Please try again.';
        
        if (err.error && typeof err.error === 'object') {
            const firstErrorKey = Object.keys(err.error)[0];
            parsedErrorMessage = err.error[firstErrorKey] || parsedErrorMessage;
        } else if (typeof err.error === 'string') {
            parsedErrorMessage = err.error;
        }
        
        this.showToast(parsedErrorMessage, 'error'); 
      }
    });
  }

  private handleSuccess() {
    this.isLoading = false;
    this.showToast('Registration Successful! Redirecting...', 'success');
    
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2500); 
  }

  // 👇 Force the screen to update
  private showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges(); // 👈 FORCES ANGULAR TO RENDER THE POPUP IMMEDIATELY
    
    if (this.toastTimer) clearTimeout(this.toastTimer);
    
    if (type === 'error') {
      this.toastTimer = setTimeout(() => {
        this.toastMessage = '';
        this.cdr.detectChanges(); // 👈 Updates the screen when hiding it
      }, 4000); 
    }
  }
}