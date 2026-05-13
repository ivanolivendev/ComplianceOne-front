import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-72 bg-navy text-white flex flex-col shadow-2xl">
        <!-- Logo -->
        <div class="p-8 flex items-center gap-3">
          <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight">ComplianceOne</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-grow px-4 space-y-1">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </a>
          
          <a routerLink="/admin/ocorrencias" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ocorrências
          </a>

          <a *ngIf="isAdmin()" routerLink="/admin/usuarios" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Usuários
          </a>
        </nav>

        <!-- User Info -->
        <div class="p-6 border-t border-white/10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-lg">
              {{ userName.charAt(0) }}
            </div>
            <div class="overflow-hidden">
              <p class="text-sm font-bold truncate">{{ userName }}</p>
              <p class="text-xs text-slate-400 font-medium">{{ userRole }}</p>
            </div>
          </div>
          <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-semibold transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-end">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Status do Servidor:</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">ONLINE</span>
        </header>
        <div class="flex-grow overflow-auto p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  userName = this.tokenService.decodeToken()?.sub || 'Usuário';
  userRole = this.tokenService.getRole();

  isAdmin(): boolean {
    return ['ADMIN', 'DIRETORIA'].includes(this.userRole);
  }

  logout(): void {
    this.authService.logout();
  }
}
