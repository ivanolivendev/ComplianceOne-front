import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, Role } from '../models/compliance.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly apiUrl = '/api/v1/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.tokenService.getToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.tokenService.saveToken(response.accessToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  hasRole(expectedRoles: Role[]): boolean {
    const userRole = this.tokenService.getRole() as Role;
    return expectedRoles.includes(userRole);
  }

  getCurrentRole(): Role | null {
    return this.tokenService.getRole() as Role || null;
  }
}
