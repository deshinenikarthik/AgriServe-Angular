import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Required for routerLink!
import { HeaderComponent } from '../../features/shared/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent], 
  templateUrl: './home.html'
})
export class Home implements OnInit {
  
  // This variable controls what buttons show up in your HTML!
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Check if the user has a valid token saved in their browser.
    // 🚨 NOTE: Change 'jwt_token' if you saved your token under a different name (like 'token' or 'auth_token')
    const token = localStorage.getItem('jwt_token'); 
    
    if (token) {
      this.isLoggedIn = true; // Hides Login/Register, Shows Dashboard
    } else {
      this.isLoggedIn = false; // Shows Login/Register
    }
  }
}