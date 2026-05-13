import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { OcorrenciaResponse, StatusOcorrencia, TipoOcorrencia } from '../../core/models/compliance.model';
import { BadgeComponent } from '../../shared/components/badge.component';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-occurrence-list',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RouterLink, SkeletonComponent, FormsModule, ButtonComponent],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <header class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Ocorrências</h1>
          <p class="text-slate-500 font-medium">Gerenciamento completo de denúncias</p>
        </div>
      </header>

      <!-- Error Message -->
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 mb-6">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="font-bold">Acesso Negado ou Erro de Servidor</p>
          <p class="text-sm opacity-90">{{ errorMsg }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card-premium p-6 bg-white flex flex-wrap gap-4 items-end shadow-sm border border-slate-100">
        <div class="flex-grow min-w-[200px]">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
          <select [(ngModel)]="filterStatus" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none transition-all">
            <option value="">Todos os Status</option>
            <option *ngFor="let s of statusOptions" [value]="s">{{ s }}</option>
          </select>
        </div>

        <div class="flex-grow min-w-[200px]">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tipo</label>
          <select [(ngModel)]="filterTipo" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-4 focus:ring-navy/10 outline-none transition-all">
            <option value="">Todos os Tipos</option>
            <option *ngFor="let t of tipoOptions" [value]="t">{{ t.replace('_', ' ') }}</option>
          </select>
        </div>

        <app-button variant="secondary" (click)="clearFilters()">Limpar</app-button>
      </div>

      <!-- Table Card -->
      <div class="card-premium overflow-hidden bg-white shadow-xl border border-slate-100">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Protocolo</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Setor</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let item of filteredItems" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4 font-mono text-sm font-bold text-navy">{{ item.protocolo }}</td>
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">{{ item.tipo.replace('_', ' ') }}</td>
                <td class="px-6 py-4 text-sm text-slate-500 text-center">{{ item.setorRelacionado || '—' }}</td>
                <td class="px-6 py-4 text-center">
                  <app-badge [status]="item.status"></app-badge>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ item.dataCriacao | date:'dd/MM/yyyy' }}</td>
                <td class="px-6 py-4 text-right">
                  <app-button variant="outline" size="sm" [routerLink]="['/admin/ocorrencias', item.id]">Detalhes</app-button>
                </td>
              </tr>
              
              <ng-container *ngIf="loading">
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td class="px-6 py-4"><app-skeleton width="100px"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="120px"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="80px" className="mx-auto"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="80px" height="1.5rem" className="mx-auto"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="80px"></app-skeleton></td>
                  <td class="px-6 py-4 text-right"><app-skeleton width="60px" height="2rem" className="ml-auto"></app-skeleton></td>
                </tr>
              </ng-container>
            </tbody>
          </table>
          
          <div *ngIf="!loading && filteredItems.length === 0" class="p-16 text-center">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-slate-400 font-medium">Nenhuma ocorrência encontrada.</p>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="items.length > 0" class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase">Página {{ currentPage + 1 }}</span>
          <div class="flex gap-2">
            <app-button variant="secondary" size="sm" [disabled]="currentPage === 0" (click)="loadPage(currentPage - 1)">Anterior</app-button>
            <app-button variant="secondary" size="sm" [disabled]="items.length < pageSize" (click)="loadPage(currentPage + 1)">Próxima</app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OccurrenceListComponent implements OnInit {
  private readonly occurrenceService = inject(OcorrenciaService);
  private readonly cdr = inject(ChangeDetectorRef);

  items: OcorrenciaResponse[] = [];
  loading = true;
  errorMsg = '';
  currentPage = 0;
  pageSize = 20;

  filterStatus = '';
  filterTipo = '';
  statusOptions = Object.values(StatusOcorrencia);
  tipoOptions = Object.values(TipoOcorrencia);

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading = true;
    this.errorMsg = '';
    this.currentPage = page;
    
    this.occurrenceService.list(page, this.pageSize).subscribe({
      next: (res) => {
        this.items = res.content || (Array.isArray(res) ? res : []);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading occurrences:', err);
        this.loading = false;
        if (err.status === 403) {
          this.errorMsg = 'O perfil de DIRETORIA não tem permissão para listar ocorrências no backend.';
        } else {
          this.errorMsg = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  get filteredItems(): OcorrenciaResponse[] {
    return this.items.filter(item => {
      const matchStatus = !this.filterStatus || item.status === this.filterStatus;
      const matchTipo = !this.filterTipo || item.tipo === this.filterTipo;
      return matchStatus && matchTipo;
    });
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterTipo = '';
  }
}
