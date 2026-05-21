import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin/admin'; 

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adduserform.html'
})
export class AddUserFormComponent implements OnInit {

  userForm!: FormGroup;
  isSubmitting = false;
  showSuccessPopup = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1. Initialize the form with strict validators matching your backend
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''], // Phone is optional in your backend snippet
      role: ['', Validators.required],
      status: ['ACTIVE', Validators.required] // Defaulting to ACTIVE
    });
  }

  // Helper method for easy access to form fields in HTML
  get f() { return this.userForm.controls; }

  onSubmit(): void {
    // Stop if the form is invalid
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // 2. Send the data to your backend
    this.adminService.createUser(this.userForm.value).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.showSuccessPopup = true; // Trigger the beautiful popup

        this.cdr.detectChanges();

        // 3. Wait 2 seconds, then navigate back to the previous page
        setTimeout(() => {
          this.location.back();
        }, 2000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error creating user:', err);
        // Extract backend error message if available
        this.errorMessage = err.error?.message || 'Failed to create user. Email might already exist.';
      }
    });
  }

  cancel(): void {
    this.location.back();
  }
}