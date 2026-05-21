import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SidebarComponent } from '../../../features/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../features/shared/header/header';
import { AdvisoryContent } from '../../../models/advisory.models';
import { AdvisoryService } from '../../../core/services/advisory/advisory'; 

@Component({
  selector: 'app-content-library',
  standalone: true,
  // 👇 Look! No Material modules!
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './contentlibrary.html'
})
export class ContentLibraryComponent implements OnInit, OnDestroy {
  items: AdvisoryContent[] = [];
  filteredItems: AdvisoryContent[] = [];
  
  selectedCategory: string = 'All';
  selectedItem: AdvisoryContent | null = null;
  
  isLoading: boolean = true;
  errorMessage: string = '';

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private advisoryService: AdvisoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLibrary();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadLibrary(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.advisoryService.getAllContent().subscribe({
      next: (data: AdvisoryContent[]) => {
        this.items = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching advisory content:', err);
        this.errorMessage = 'Failed to load content library. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.selectedItem = null;
    this.applyFilters();
  }

  applyFilters(): void {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();

    this.filteredItems = this.items.filter(item => {
      const matchesCategory = this.selectedCategory === 'All' || item.category.includes(this.selectedCategory);
      const matchesSearch = searchTerm === '' || item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    this.cdr.detectChanges();
  }

  viewDetails(item: AdvisoryContent): void { 
    this.selectedItem = item; 
    this.cdr.detectChanges();
  }
  
  closeDetails(): void { 
    this.selectedItem = null; 
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadResource(fileUri: string | undefined): void {
    if (fileUri) {
      // Opens the file link in a new browser tab
      window.open(fileUri, '_blank');
    } else {
      console.warn('No file URI is attached to this resource.');
    }
  }
}