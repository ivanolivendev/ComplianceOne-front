import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button.component';

// Layout global para o portal público
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <!-- Top Navbar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <!-- Logo -->
            <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
              <div class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-navy tracking-tight hidden sm:block">ComplianceOne</span>
            </div>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-8">
              <a routerLink="/" routerLinkActive="text-navy font-bold" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-medium text-slate-500 hover:text-navy transition-colors">Início</a>
              <a routerLink="/denunciar" routerLinkActive="text-navy font-bold" class="text-sm font-medium text-slate-500 hover:text-navy transition-colors">Denunciar</a>
              <a routerLink="/protocolo" routerLinkActive="text-navy font-bold" class="text-sm font-medium text-slate-500 hover:text-navy transition-colors">Consultar</a>
            </nav>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <app-button variant="outline" size="sm" routerLink="/login" class="hidden sm:block">Acesso Admin</app-button>
              <app-button size="sm" routerLink="/denunciar">Nova Denúncia</app-button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-400 py-12 px-6 md:px-12 text-center text-sm">
        <div class="max-w-7xl mx-auto">
          <p class="mb-2">Portal em conformidade com a NR-01 e LGPD.</p>
          <p>&copy; 2026 ComplianceOne. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {
  private readonly router = inject(Router);
}
