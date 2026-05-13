import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { OcorrenciaResponse, StatusOcorrencia } from '../../core/models/compliance.model';
import { BadgeComponent } from '../../shared/components/badge.component';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../shared/components/skeleton.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RouterLink, SkeletonComponent],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p class="text-slate-500 font-medium">Visão geral do sistema de compliance</p>
      </header>

      <!-- Error Message -->
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="font-bold">Erro ao carregar dados</p>
          <p class="text-sm opacity-90">{{ errorMsg }}</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card-premium p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-navy/5 text-navy rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total</p>
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.total }}</h3>
        </div>

        <div class="card-premium p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Recebidas</p>
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.recebidas }}</h3>
        </div>

        <div class="card-premium p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Em Análise</p>
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.analise }}</h3>
        </div>

        <div class="card-premium p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Concluídas</p>
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.concluidas }}</h3>
        </div>
      </div>

      <!-- Recent Table -->
      <div class="card-premium overflow-hidden bg-white">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 class="text-xl font-bold text-slate-900">Últimas Ocorrências</h2>
          <a routerLink="/admin/ocorrencias" class="text-sm font-bold text-navy hover:underline">Ver todas</a>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Protocolo</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let item of recentItems" class="hover:bg-slate-50 transition-colors cursor-pointer" [routerLink]="['/admin/ocorrencias', item.id]">
                <td class="px-6 py-4 font-mono text-sm font-bold text-navy">{{ item.protocolo }}</td>
                <td class="px-6 py-4 text-sm text-slate-600">{{ item.tipo.replace('_', ' ') }}</td>
                <td class="px-6 py-4">
                  <app-badge [status]="item.status"></app-badge>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ item.dataCriacao | date:'dd/MM/yyyy' }}</td>
              </tr>
              
              <!-- Skeleton Loader -->
              <ng-container *ngIf="loading">
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td class="px-6 py-4"><app-skeleton width="100px"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="150px"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="80px" height="1.5rem"></app-skeleton></td>
                  <td class="px-6 py-4"><app-skeleton width="80px"></app-skeleton></td>
                </tr>
              </ng-container>
            </tbody>
          </table>
          
          <div *ngIf="!loading && recentItems.length === 0" class="p-12 text-center text-slate-400">
            Nenhuma ocorrência encontrada.
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly occurrenceService = inject(OcorrenciaService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  errorMsg = '';
  recentItems: OcorrenciaResponse[] = [];
  stats = {
    total: 0,
    recebidas: 0,
    analise: 0,
    concluidas: 0
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMsg = '';
    
    this.occurrenceService.list(0, 100).subscribe({
      next: (res) => {
        const items = res.content || (Array.isArray(res) ? res : []);
        this.recentItems = items.slice(0, 5);
        this.stats.total = res.totalElements || items.length;
        this.stats.recebidas = items.filter((i: any) => i.status === StatusOcorrencia.RECEBIDA).length;
        this.stats.analise = items.filter((i: any) => i.status === StatusOcorrencia.EM_ANALISE).length;
        this.stats.concluidas = items.filter((i: any) => i.status === StatusOcorrencia.CONCLUIDA).length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.loading = false;
        if (err.status === 403) {
          this.errorMsg = 'Você não tem permissão para visualizar os dados deste dashboard. Contate o administrador.';
        } else {
          this.errorMsg = 'Não foi possível carregar as estatísticas do banco de dados.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
