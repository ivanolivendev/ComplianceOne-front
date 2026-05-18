import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { AnexoService } from '../../core/services/anexo.service';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { OcorrenciaResponse, StatusOcorrencia, AnexoResponse, AuditoriaResponse } from '../../core/models/compliance.model';
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
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <app-button variant="outline" size="sm" routerLink="/admin/ocorrencias">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </app-button>
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Gerenciar Ocorrência</h1>
            <p class="text-sm font-mono text-slate-400 font-bold" *ngIf="item">{{ item.protocolo }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <app-badge *ngIf="item" [status]="item.status" class="scale-110"></app-badge>
        </div>
      </header>

      <!-- Error Message -->
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium">{{ errorMsg }}</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="space-y-8">
        <div class="card-premium p-8"><app-skeleton height="200px"></app-skeleton></div>
        <div class="card-premium p-8"><app-skeleton height="150px"></app-skeleton></div>
      </div>

      <!-- Main Content -->
      <div *ngIf="item && !loading" class="space-y-8">
        
        <!-- Tabs Navigation -->
        <nav class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            *ngFor="let tab of tabs" 
            (click)="activeTab = tab.id"
            [class]="'px-6 py-2 rounded-lg text-sm font-bold transition-all ' + 
            (activeTab === tab.id ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-700')"
          >
            {{ tab.label }}
          </button>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT COLUMN: Tab Content -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Tab: Details -->
            <div *ngIf="activeTab === 'details'" class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
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

            <!-- Tab: Evidence -->
            <div *ngIf="activeTab === 'evidence'" class="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div *ngIf="anexos.length === 0" class="card-premium p-12 text-center text-slate-400 italic">
                Nenhum anexo enviado para esta ocorrência.
              </div>
              
              <div *ngFor="let anexo of anexos" class="card-premium p-6 flex items-center justify-between group hover:ring-2 hover:ring-navy/5 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                    <img *ngIf="isImage(anexo)" [src]="getPreview(anexo)" class="w-full h-full object-cover rounded-lg" alt="Preview">
                    <svg *ngIf="!isImage(anexo)" class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ anexo.nomeOriginal || anexo.nomeArquivo }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs text-slate-500 font-medium">{{ (anexo.tamanho / 1024).toFixed(1) }} KB</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-xs text-slate-500 font-medium uppercase">{{ (anexo.tipoArquivo || 'bin').split('/')[1] || (anexo.tipoArquivo || 'bin') }}</span>
                      <span class="text-slate-300">•</span>
                      <div class="flex items-center gap-1 text-xs text-green-600 font-bold" [title]="'SHA-256: ' + anexo.hashArquivo">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                        Verificado
                      </div>
                    </div>
                  </div>
                </div>
                <app-button variant="outline" size="sm" (click)="downloadAnexo(anexo)">
                  Download
                </app-button>
              </div>
            </div>

            <!-- Tab: Timeline -->
            <div *ngIf="activeTab === 'timeline'" class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div class="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                <div *ngFor="let event of historico" class="relative">
                  <div class="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white bg-navy shadow-sm ring-4 ring-navy/10"></div>
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 class="text-sm font-bold text-slate-900 uppercase tracking-tight">{{ event.tipo.replace('_', ' ') }}</h4>
                    <span class="text-[10px] font-bold text-slate-400">{{ formatFullDate(event.dataEvento) }}</span>
                  </div>
                  <div class="card-premium p-5 text-sm bg-white border-slate-100 shadow-sm">
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 pb-4 border-b border-slate-50">
                      <div class="flex items-center gap-2 text-slate-600">
                        <div class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <span class="text-xs font-bold" [title]="event.usuario">{{ event.emailUsuario || event.usuario || 'Sistema' }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-slate-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <span class="text-[10px] font-medium">{{ event.ip }} ({{ event.origem }})</span>
                      </div>
                    </div>

                    <!-- Direct Description if plain text -->
                    <div *ngIf="!isJson(event.descricao)" class="text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                      <div *ngIf="event.tipo === 'ALTERACAO_STATUS' && event.statusNovo" class="mb-2 pb-2 border-b border-slate-200/50 not-italic flex items-center gap-2">
                        <span class="text-xs font-bold text-navy uppercase tracking-tight">Status alterado:</span>
                        <app-badge [status]="event.statusNovo" size="sm"></app-badge>
                      </div>
                      "{{ event.descricao }}"
                    </div>

                    <!-- Button if complex JSON -->
                    <app-button *ngIf="isJson(event.descricao)" variant="outline" size="sm" (click)="viewSnapshot(event)">
                      Ver Snapshot dos Dados
                    </app-button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Actions & Status -->
          <div class="space-y-8">
            <div class="card-premium p-8 bg-white ring-2 ring-navy/5 sticky top-8">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Fluxo de Trabalho</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-2">Novo Status</label>
                  <select [(ngModel)]="newStatus" class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm font-medium bg-slate-50">
                    <option *ngFor="let s of statusOptions" [value]="s">{{ s.replace('_', ' ') }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-2">Observação / Justificativa</label>
                  <textarea 
                    [(ngModel)]="newObservation"
                    rows="4"
                    placeholder="Explique a alteração para fins de compliance..."
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none text-sm resize-none"
                  ></textarea>
                </div>

                <app-button 
                  class="w-full" 
                  [loading]="updating" 
                  [disabled]="!newStatus"
                  (click)="onSave()"
                >
                  Confirmar Alteração
                </app-button>
              </div>

              <div *ngIf="item.observacao" class="mt-6 pt-6 border-t border-slate-100">
                <h3 class="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">Nota da última alteração</h3>
                <p class="text-xs text-slate-600 leading-relaxed italic">"{{ item.observacao }}"</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal for Snapshot -->
    <div *ngIf="selectedSnapshot" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">Snapshot da Denúncia</h3>
          <button (click)="selectedSnapshot = null" class="text-slate-400 hover:text-slate-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-6 overflow-auto bg-slate-50">
          <!-- Render as Key-Value List if Object -->
          <div *ngIf="isObject(selectedSnapshot)" class="space-y-3">
            <div *ngFor="let entry of getObjectEntries(selectedSnapshot)" class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ getLabel(entry.key) }}</span>
              <span class="text-sm font-semibold text-slate-700">
                <ng-container [ngSwitch]="entry.key">
                  <app-badge *ngSwitchCase="'status'" [status]="entry.value" size="sm"></app-badge>
                  <span *ngSwitchCase="'anonima'">{{ entry.value ? 'Sim' : 'Não' }}</span>
                  <span *ngSwitchDefault>{{ entry.value === null ? '—' : entry.value }}</span>
                </ng-container>
              </span>
            </div>
          </div>
          
          <!-- Render as Plain Text if String -->
          <div *ngIf="!isObject(selectedSnapshot)" class="text-sm text-slate-800 bg-white p-6 rounded-lg border border-slate-200 shadow-inner leading-relaxed">
            {{ selectedSnapshot }}
          </div>
        </div>
        <div class="p-4 border-t border-slate-100 text-right">
          <app-button (click)="selectedSnapshot = null">Fechar</app-button>
        </div>
      </div>
    </div>
  `
})
export class OccurrenceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly occurrenceService = inject(OcorrenciaService);
  private readonly anexoService = inject(AnexoService);
  private readonly auditoriaService = inject(AuditoriaService);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  updating = false;
  errorMsg = '';
  item: OcorrenciaResponse | null = null;
  anexos: AnexoResponse[] = [];
  historico: AuditoriaResponse[] = [];
  
  formattedTipo = '';
  formattedDate = '';

  activeTab = 'details';
  tabs = [
    { id: 'details', label: 'Detalhes' },
    { id: 'evidence', label: 'Evidências' },
    { id: 'timeline', label: 'Linha do Tempo' }
  ];

  newStatus: StatusOcorrencia | '' = '';
  newObservation = '';
  statusOptions = Object.values(StatusOcorrencia);
  selectedSnapshot: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(id);
      this.loadAnexos(id);
      this.loadHistorico(id);
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

  loadAnexos(id: string): void {
    this.anexoService.listByOcorrencia(id).subscribe({
      next: (res) => {
        this.anexos = res;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistorico(id: string): void {
    this.auditoriaService.getHistory(id).subscribe({
      next: (res) => {
        this.historico = res;
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
        this.loadHistorico(this.item.id); // Reload history after update
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.updating = false;
        if (err.error && err.error.message) {
          this.errorMsg = `Erro no servidor: ${err.error.message}`;
        } else {
          this.errorMsg = 'Falha ao atualizar o status.';
        }
        this.notify.error('Erro ao atualizar ocorrência.');
        this.cdr.detectChanges();
      }
    });
  }

  isImage(anexo: AnexoResponse): boolean {
    return anexo.tipoArquivo.startsWith('image/');
  }

  getPreview(anexo: AnexoResponse): string {
    return this.anexoService.getPreviewUrl(anexo.id);
  }

  downloadAnexo(anexo: AnexoResponse): void {
    this.anexoService.download(anexo.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = anexo.nomeArquivo;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  viewSnapshot(event: AuditoriaResponse): void {
    if (!event.descricao) {
      this.selectedSnapshot = 'Sem detalhes adicionais.';
      return;
    }
    try {
      this.selectedSnapshot = JSON.parse(event.descricao);
    } catch {
      this.selectedSnapshot = event.descricao;
    }
  }

  isJson(str: string): boolean {
    if (!str) return false;
    return str.trim().startsWith('{') || str.trim().startsWith('[');
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  getObjectEntries(obj: any): { key: string, value: any }[] {
    if (!obj) return [];
    return Object.keys(obj)
      .filter(key => !['id', 'ativo'].includes(key)) // Hide technical IDs
      .map(key => ({ key, value: obj[key] }));
  }

  getLabel(key: string): string {
    const labels: { [key: string]: string } = {
      'protocolo': 'Protocolo',
      'status': 'Status',
      'relato': 'Relato',
      'tipo': 'Tipo',
      'setorRelacionado': 'Setor',
      'observacao': 'Observação / Justificativa',
      'anonima': 'Denúncia Anônima',
      'dataOcorrencia': 'Data do Ocorrido',
      'dataCriacao': 'Data de Registro'
    };
    return labels[key] || key;
  }

  formatFullDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR');
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
