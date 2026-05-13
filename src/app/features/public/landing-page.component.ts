import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span class="text-xl font-bold text-navy tracking-tight">ComplianceOne</span>
        </div>
        <app-button variant="outline" size="sm" (click)="goToLogin()">Painel Admin</app-button>
      </header>

      <!-- Hero Section -->
      <main class="flex-grow flex flex-col">
        <section class="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-slate-50 text-center">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Sua voz é fundamental para um <span class="text-navy">ambiente íntegro</span>.
            </h1>
            <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              O ComplianceOne é o canal oficial para denúncias anônimas e seguras, em conformidade com a NR-01. Garantimos total sigilo e proteção ao denunciante.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <app-button size="lg" (click)="goToReport()">Fazer uma Denúncia</app-button>
              <app-button variant="secondary" size="lg" (click)="goToStatus()">Consultar Protocolo</app-button>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="py-20 px-6 md:px-12 bg-white">
          <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div class="card-premium p-8">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">100% Anônimo</h3>
              <p class="text-slate-600">Sua identidade nunca será revelada sem o seu consentimento explícito. Não rastreamos IPs.</p>
            </div>

            <div class="card-premium p-8">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Conformidade Legal</h3>
              <p class="text-slate-600">Sistema desenvolvido rigorosamente dentro das diretrizes da NR-01 e boas práticas de compliance.</p>
            </div>

            <div class="card-premium p-8">
              <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Transparência</h3>
              <p class="text-slate-600">Acompanhe o status da sua denúncia em tempo real através do seu código de protocolo.</p>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-400 py-12 px-6 md:px-12 text-center text-sm">
        <p>&copy; 2026 ComplianceOne. Todos os direitos reservados. Em conformidade com a NR-01.</p>
      </footer>
    </div>
  `
})
export class LandingPageComponent {
  private readonly router = inject(Router);

  goToReport(): void { this.router.navigate(['/denunciar']); }
  goToStatus(): void { this.router.navigate(['/protocolo']); }
  goToLogin(): void { this.router.navigate(['/login']); }
}
