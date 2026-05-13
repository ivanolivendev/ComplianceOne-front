import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../shared/components/badge.component';
import { OcorrenciaResponse } from '../../core/models/compliance.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-protocol-view',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  template: `
    <div class="min-h-screen bg-slate-50 py-20 px-6">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl font-extrabold text-slate-900 mb-8 text-center">Consultar Status</h1>
        
        <!-- Search Card -->
        <div class="card-premium p-8 mb-8">
          <p class="text-slate-600 mb-6">Insira o código do protocolo que você recebeu ao finalizar sua denúncia.</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-grow">
              <input
                type="text"
                placeholder="Ex: NR1-XXXXXXXX"
                [(ngModel)]="searchProtocol"
                (keyup.enter)="onSearch()"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none bg-white transition-all duration-200"
              />
            </div>
            <button
              type="button"
              [disabled]="loading"
              (click)="onSearch()"
              class="px-6 py-2.5 bg-navy text-white rounded-lg font-medium hover:bg-opacity-90 shadow-lg shadow-navy/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 min-w-[120px]"
            >
              <svg *ngIf="loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>
        </div>

        <!-- Result Card -->
        <div *ngIf="result" class="card-premium p-8">
          <div class="flex justify-between items-start mb-8">
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Status Atual</span>
              <app-badge [status]="result.status"></app-badge>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Data de Envio</span>
              <p class="text-sm font-medium text-slate-700">{{ formattedDate }}</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="p-4 bg-slate-50 rounded-lg">
              <span class="text-xs font-bold text-slate-400 uppercase block mb-2">Tipo de Ocorrência</span>
              <p class="text-slate-900 font-medium">{{ formattedTipo }}</p>
            </div>

            <div *ngIf="result.observacao" class="p-4 bg-navy/5 border border-navy/10 rounded-lg">
              <span class="text-xs font-bold text-navy uppercase block mb-2">Resposta da Equipe de Compliance</span>
              <p class="text-slate-800 italic">{{ result.observacao }}</p>
            </div>

            <div *ngIf="!result.observacao" class="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-blue-700">Sua denúncia está sendo analisada. Assim que houver uma atualização, ela aparecerá aqui.</p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="card-premium p-8 text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-slate-600">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  `
})
export class ProtocolViewComponent {
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  searchProtocol = '';
  loading = false;
  result: OcorrenciaResponse | null = null;
  errorMessage = '';

  // Valores pré-computados para evitar chamadas de método no template
  formattedTipo = '';
  formattedDate = '';

  async onSearch(): Promise<void> {
    const protocol = this.searchProtocol.trim();
    if (!protocol || this.loading) return;

    this.loading = true;
    this.result = null;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const response = await fetch(`/api/v1/ocorrencias/protocolo/${encodeURIComponent(protocol)}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: OcorrenciaResponse = await response.json();
      this.result = data;
      this.formattedTipo = (data.tipo || '').replace(/_/g, ' ');
      this.formattedDate = this.formatDate(data.dataCriacao);
    } catch (err: any) {
      console.error('Erro ao buscar protocolo:', err);
      this.errorMessage = 'Protocolo não encontrado ou código inválido.';
      this.notify.error('Protocolo não encontrado ou código inválido.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return 'Não disponível';
    try {
      // Trunca microssegundos para milissegundos para compatibilidade com Date()
      const normalized = dateStr.replace(/(\.\d{3})\d+/, '$1');
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return dateStr;

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }
}
