import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div class="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-4xl font-extrabold text-slate-900 mb-4">Denúncia Enviada!</h1>
      <p class="text-slate-600 mb-12 max-w-md mx-auto">
        Sua ocorrência foi registrada com sucesso. Guarde o número do protocolo abaixo para acompanhar o andamento.
      </p>

      <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 mb-12 w-full max-w-sm relative">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Protocolo
        </span>
        <div class="text-3xl font-mono font-bold text-navy tracking-wider mb-6">
          {{ protocolo }}
        </div>
        <app-button variant="outline" size="sm" (click)="copyProtocol()">Copiar Código</app-button>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <app-button variant="secondary" [routerLink]="['/protocolo']">Consultar Status</app-button>
        <app-button [routerLink]="['/']">Voltar ao Início</app-button>
      </div>
    </div>
  `
})
export class SuccessComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  protocolo = '';

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.protocolo) {
      this.protocolo = state.protocolo;
    } else {
      this.router.navigate(['/']);
    }
  }

  copyProtocol(): void {
    navigator.clipboard.writeText(this.protocolo);
    this.notify.success('Protocolo copiado para a área de transferência!');
  }
}
