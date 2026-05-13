import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { OcorrenciaResponse, StatusOcorrencia } from '../../core/models/compliance.model';
import { BadgeComponent } from '../../shared/components/badge.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { SkeletonComponent } from '../../shared/components/skeleton.component';

@Component({
  selector: 'app-occurrence-detail',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent, RouterLink, FormsModule, SkeletonComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <app-button variant="outline" size="sm" routerLink="/admin/ocorrencias">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </app-button>
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Detalhes da Ocorrência</h1>
            <p class="text-sm font-mono text-slate-400 font-bold" *ngIf="item">{{ item.protocolo }}</p>
          </div>
        </div>
        <app-badge *ngIf="item" [status]="item.status" class="scale-110"></app-badge>
      </header>

      <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium">{{ errorMsg }}</p>
      </div>

      <div *ngIf="loading" class="space-y-8">
        <div class="card-premium p-8"><app-skeleton height="200px"></app-skeleton></div>
        <div class="card-premium p-8"><app-skeleton height="150px"></app-skeleton></div>
      </div>

      <div *ngIf="item && !loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
          <div class="card-premium p-8">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Relato do Denunciante</h3>
            <p class="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg">{{ item.relato }}</p>
          </div>

          <div class="card-premium p-8">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Informações Adicionais</h3>
            <div class="grid grid-cols-2 gap-y-6">
              <div>
                <span class="text-xs font-bold text-slate-400 block mb-1">Tipo</span>
                <p class="font-semibold text-slate-900">{{ formattedTipo }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-400 block mb-1">Setor</span>
                <p class="font-semibold text-slate-900">{{ item.setorRelacionado || 'Não informado' }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-400 block mb-1">Anônima</span>
                <p class="font-semibold text-slate-900">{{ item.anonima ? 'Sim' : 'Não' }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-400 block mb-1">Data de Criação</span>
                <p class="font-semibold text-slate-900">{{ formattedDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="card-premium p-8 bg-white ring-2 ring-navy/5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Atualizar Status</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">Novo Status</label>
                <select [(ngModel)]="newStatus" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm font-medium">
                  <option *ngFor="let s of statusOptions" [value]="s">{{ s.replace('_', ' ') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">Observação / Justificativa</label>
                <textarea 
                  [(ngModel)]="newObservation"
                  rows="4"
                  placeholder="Explique a alteração de status..."
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm resize-none"
                ></textarea>
              </div>

              <app-button 
                class="w-full" 
                [loading]="updating" 
                [disabled]="!newStatus"
                (click)="onSave()"
              >
                Salvar
              </app-button>
            </div>
          </div>

          <div *ngIf="item.observacao" class="card-premium p-6 bg-navy/5 border-navy/10">
            <h3 class="text-xs font-bold text-navy uppercase tracking-widest mb-3">Observação Atual</h3>
            <p class="text-sm text-slate-700 italic">{{ item.observacao }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OccurrenceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly occurrenceService = inject(OcorrenciaService);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  updating = false;
  errorMsg = '';
  item: OcorrenciaResponse | null = null;
  
  formattedTipo = '';
  formattedDate = '';

  newStatus: StatusOcorrencia | '' = '';
  newObservation = '';
  statusOptions = Object.values(StatusOcorrencia);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(id);
    }
  }

  loadItem(id: string): void {
    this.loading = true;
    this.errorMsg = '';
    this.occurrenceService.getById(id).subscribe({
      next: (res) => {
        this.item = res;
        this.formattedTipo = (res.tipo || '').replace(/_/g, ' ');
        this.formattedDate = this.formatDate(res.dataCriacao);
        this.newStatus = this.item.status;
        this.newObservation = this.item.observacao || '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading item:', err);
        this.loading = false;
        this.errorMsg = 'Erro ao carregar os dados da ocorrência.';
        this.cdr.detectChanges();
      }
    });
  }

  onSave(): void {
    if (!this.item || !this.newStatus) return;

    this.updating = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.occurrenceService.updateStatus(this.item.id, this.newStatus as StatusOcorrencia, this.newObservation).subscribe({
      next: (res) => {
        this.item = res;
        this.formattedTipo = (res.tipo || '').replace(/_/g, ' ');
        this.formattedDate = this.formatDate(res.dataCriacao);
        this.newStatus = res.status;
        this.newObservation = res.observacao || '';
        this.updating = false;
        this.notify.success('Ocorrência atualizada com sucesso!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.updating = false;
        // Exibe a mensagem de erro amigável baseada no que o backend retornou
        if (err.error && err.error.message) {
          this.errorMsg = `Erro no servidor: ${err.error.message}`;
        } else {
          this.errorMsg = 'Falha ao atualizar o status. Verifique se os dados estão corretos.';
        }
        this.notify.error('Erro ao atualizar ocorrência.');
        this.cdr.detectChanges();
      }
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return 'Não disponível';
    try {
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
