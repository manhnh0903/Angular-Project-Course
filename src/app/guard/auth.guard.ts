import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  const isAuthenticated = await authService.checkAuth();

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
