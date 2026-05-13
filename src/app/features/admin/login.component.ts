import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div class="max-w-md w-full">
        <!-- Logo/Header -->
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-navy/20">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">ComplianceOne</h1>
          <p class="text-slate-500 mt-2 font-medium">Painel Administrativo</p>
        </div>

        <!-- Login Card -->
        <div class="card-premium p-8 md:p-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input 
              label="E-mail" 
              type="email" 
              formControlName="email"
              placeholder="seu@email.com"
              [error]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid ? 'E-mail inválido' : ''"
            ></app-input>

            <app-input 
              label="Senha" 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              [error]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid ? 'Senha é obrigatória' : ''"
            ></app-input>

            <app-button 
              type="submit" 
              class="w-full" 
              [loading]="loading"
              [disabled]="loginForm.invalid"
            >
              Entrar no Sistema
            </app-button>
          </form>

          <div class="mt-8 text-center">
            <a routerLink="/" class="text-sm font-semibold text-navy hover:underline flex items-center justify-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Portal Público
            </a>
          </div>
        </div>

        <!-- Security Badge -->
        <p class="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          Conexão segura e criptografada
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);

  loading = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: () => {
        this.loading = false;
        this.notify.error('E-mail ou senha inválidos.');
      }
    });
  }
}
