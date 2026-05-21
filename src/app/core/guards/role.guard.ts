import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as Array<string>;
  
  // 👉 Make sure this matches exactly what you set in login.ts!
  const rawRole = localStorage.getItem('user_role') || 'MISSING';
  const userRole = rawRole.toUpperCase().replace(/[^A-Z]/g, ''); 

  console.log(`🛡️ RoleGuard Check -> Found Role in Storage: "${rawRole}" (Sanitized to: "${userRole}"). Route Requires:`, expectedRoles);

  if (!expectedRoles || expectedRoles.includes(userRole)) {
    console.log('✅ RoleGuard passed!');
    return true;
  }

  console.error(`❌ RoleGuard failed: You have role "${userRole}", but need ${expectedRoles}. Redirecting to home.`);
  router.navigate(['/home']);
  return false;
};