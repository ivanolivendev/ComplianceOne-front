import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/compliance.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentRole()) {
    // Check for specific roles if defined in route data
    const expectedRoles = route.data['roles'] as Role[];
    if (expectedRoles && !authService.hasRole(expectedRoles)) {
      router.navigate(['/']); // Or access denied page
      return false;
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentRole()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }
  return true;
};
