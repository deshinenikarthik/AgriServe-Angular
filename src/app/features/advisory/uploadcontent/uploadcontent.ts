import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdvisoryService } from '../../../core/services/advisory/advisory';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  selector: 'app-upload-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './uploadcontent.html'
})
export class ContentUploadComponent implements OnInit {
  uploadForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private advisoryService: AdvisoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['Crop Advisory', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      fileUri: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  get f() { return this.uploadForm.controls; }

  onUpload(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.advisoryService.createContent(this.uploadForm.value).subscribe({
      next: () => {
        this.router.navigate(['/officer/advisory/content']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to upload content. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}