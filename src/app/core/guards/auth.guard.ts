import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 👉 Make sure this matches exactly what you set in login.ts!
  const token = localStorage.getItem('jwt_token'); 

  if (token) {
    console.log('✅ AuthGuard passed: Found a token!');
    return true; 
  }

  console.error('❌ AuthGuard failed: No token found under the key "jwt_token". Redirecting to login.');
  router.navigate(['/login']);
  return false;
};