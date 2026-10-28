import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../core/models/compliance.model';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Usuários</h1>
        <p class="text-slate-500 font-medium">Cadastrar novos administradores do sistema</p>
      </header>

      @if (canManage()) {
        <div class="card-premium p-8 md:p-10 bg-white">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-input 
                label="Nome Completo" 
                formControlName="name"
                placeholder="Ex: João Silva"
              ></app-input>

              <app-input 
                label="E-mail" 
                type="email" 
                formControlName="email"
                placeholder="joao@empresa.com"
              ></app-input>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-input 
                label="Senha Temporária" 
                type="password" 
                formControlName="password"
                placeholder="Mínimo 8 caracteres"
              ></app-input>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Função (Role)</label>
                <select 
                  formControlName="role"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none appearance-none bg-white"
                >
                  <option value="" disabled>Selecione a permissão...</option>
                  <option *ngFor="let role of roles" [value]="role">{{ roleLabel(role) }}</option>
                </select>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <app-button 
                type="submit" 
                [loading]="loading"
                [disabled]="userForm.invalid"
              >
                Criar Usuário
              </app-button>
            </div>
          </form>
        </div>
      } @else {
        <div class="card-premium p-12 text-center bg-red-50 border-red-100">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-900 mb-2">Acesso Restrito</h3>
          <p class="text-red-700">Apenas usuários com perfil de ADMIN ou DIRETORIA podem gerenciar usuários.</p>
        </div>
      }

      <section *ngIf="canManage()" class="card-premium overflow-hidden bg-white">
        <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h2 class="text-xl font-bold text-slate-900">Usuários cadastrados</h2><p class="text-sm text-slate-500">Gerencie o acesso ao painel.</p></div>
          <input [(ngModel)]="search" type="search" placeholder="Buscar usuário..." aria-label="Buscar usuário" class="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-4 focus:ring-navy/10">
        </div>
        <div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-slate-50"><tr><th class="px-6 py-3 text-xs uppercase text-slate-400">Nome</th><th class="px-6 py-3 text-xs uppercase text-slate-400">E-mail</th><th class="px-6 py-3 text-xs uppercase text-slate-400">Função</th><th class="px-6 py-3 text-xs uppercase text-slate-400">Status</th><th class="px-6 py-3"></th></tr></thead><tbody class="divide-y divide-slate-100"><tr *ngFor="let user of filteredUsers"><td class="px-6 py-4 font-semibold">{{ user.name }}</td><td class="px-6 py-4 text-sm text-slate-500">{{ user.email }}</td><td class="px-6 py-4 text-sm">{{ roleLabel(user.role) }}</td><td class="px-6 py-4"><span class="px-2 py-1 rounded-full text-xs font-bold" [class]="user.active ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'">{{ user.active ? 'Ativo' : 'Inativo' }}</span></td><td class="px-6 py-4 text-right"><button type="button" class="text-sm font-bold text-navy hover:underline" (click)="toggleActive(user)">{{ user.active ? 'Desativar' : 'Ativar' }}</button></td></tr></tbody></table><p *ngIf="!loadingUsers && filteredUsers.length === 0" class="p-8 text-center text-slate-400">Nenhum usuário encontrado.</p></div>
      </section>
    </div>
  `
})
export class UserManagementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly notify = inject(NotificationService);
  private readonly auth = inject(AuthService);

  loading = false;
  loadingUsers = false;
  search = '';
  users: any[] = [];
  roles = Object.values(Role);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', Validators.required]
  });

  canManage(): boolean {
    const currentRole = this.auth.getCurrentRole();
    return currentRole === Role.ADMIN || currentRole === Role.DIRETORIA;
  }

  roleLabel(role: string): string {
    return role.toLowerCase().replace(/_/g, ' ').replace(/\b\S/g, letter => letter.toUpperCase());
  }

  get filteredUsers(): any[] {
    const q = this.search.toLowerCase().trim();
    return this.users.filter(user => !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q));
  }

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    if (!this.canManage()) return;
    this.loadingUsers = true;
    this.http.get<any[]>('/api/v1/users').subscribe({ next: users => { this.users = users; this.loadingUsers = false; }, error: () => { this.loadingUsers = false; this.notify.error('Não foi possível carregar os usuários.'); } });
  }

  toggleActive(user: any): void {
    if (!window.confirm(`${user.active ? 'Desativar' : 'Ativar'} o usuário ${user.name}?`)) return;
    this.http.patch<any>(`/api/v1/users/${user.id}/active?active=${!user.active}`, null).subscribe({ next: updated => { user.active = updated.active; this.notify.success(`Usuário ${updated.active ? 'ativado' : 'desativado'} com sucesso.`); }, error: () => this.notify.error('Não foi possível alterar o status do usuário.') });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.http.post('/api/v1/users', this.userForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Usuário criado com sucesso!');
        this.userForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.message || '';
        this.notify.error(message.toLowerCase().includes('email') ? 'Este e-mail já está cadastrado.' : 'Erro ao criar usuário. Verifique as permissões.');
      }
    });
  }
}
