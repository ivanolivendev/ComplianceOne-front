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

      <!-- Error State -->
      <div *ngIf="errorMsg" class="card-premium p-8 text-center bg-red-50 border-red-100">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 font-medium">{{ errorMsg }}</p>
        <app-button variant="secondary" class="mt-4" (click)="loadItem(itemId!)">Tentar Novamente</app-button>
      </div>

      <div *ngIf="loading && !errorMsg" class="space-y-8">
        <div class="card-premium p-8"><app-skeleton height="200px"></app-skeleton></div>
        <div class="card-premium p-8"><app-skeleton height="150px"></app-skeleton></div>
      </div>

      <div *ngIf="item && !loading" class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Main Info -->
        <div class="md:col-span-2 space-y-8">
          <div class="card-premium p-8 shadow-xl">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Relato do Denunciante</h3>
            <p class="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg">{{ item.relato }}</p>
          </div>

          <div class="card-premium p-8 shadow-lg">
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

        <!-- Update Status Sidebar -->
        <div class="space-y-8">
          <div class="card-premium p-8 bg-white ring-2 ring-navy/5 shadow-2xl">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Atualizar Status</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">Novo Status</label>
                <select [(ngModel)]="newStatus" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm font-medium transition-all">
                  <option *ngFor="let s of statusOptions" [value]="s">{{ s }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 mb-2">Observação / Justificativa</label>
                <textarea 
                  [(ngModel)]="newObservation"
                  rows="4"
                  placeholder="Explique a alteração de status..."
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm resize-none transition-all"
                ></textarea>
              </div>

              <app-button 
                class="w-full" 
                [loading]="updating" 
                [disabled]="!newStatus || !newObservation"
                (click)="onUpdateStatus()"
              >
                Atualizar
              </app-button>
            </div>
          </div>

          <div *ngIf="item.observacao" class="card-premium p-6 bg-navy/5 border border-navy/10 shadow-sm">
            <h3 class="text-xs font-bold text-navy uppercase tracking-widest mb-3">Observação Atual</h3>
            <p class="text-sm text-slate-700 italic leading-relaxed">{{ item.observacao }}</p>
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

  itemId: string | null = null;
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
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: string): void {
    this.loading = true;
    this.errorMsg = '';
    this.item = null;

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
        console.error('Error loading detail:', err);
        this.loading = false;
        if (err.status === 403) {
          this.errorMsg = 'Você não tem permissão para visualizar os detalhes desta ocorrência.';
        } else {
          this.errorMsg = 'Ocorreu um erro ao carregar os dados. Verifique a conexão com o backend.';
        }
        this.cdr.detectChanges();
      }
    });
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

  onUpdateStatus(): void {
    if (!this.item || !this.newStatus || !this.newObservation) return;

    this.updating = true;
    this.occurrenceService.updateStatus(this.item.id, this.newStatus as StatusOcorrencia, this.newObservation).subscribe({
      next: (res) => {
        this.item = res;
        this.formattedTipo = (res.tipo || '').replace(/_/g, ' ');
        this.formattedDate = this.formatDate(res.dataCriacao);
        this.updating = false;
        this.notify.success('Status atualizado com sucesso!');
        this.cdr.detectChanges();
      },
      error: () => {
        this.updating = false;
        this.notify.error('Erro ao atualizar status.');
        this.cdr.detectChanges();
      }
    });
  }
}
