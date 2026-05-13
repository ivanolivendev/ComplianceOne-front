import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { TipoOcorrencia } from '../../core/models/compliance.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-report-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="py-12 px-6">
      <div class="max-w-2xl mx-auto">
        <!-- Progress Stepper -->
        <div class="flex items-center justify-between mb-12 px-4">
          <div *ngFor="let step of steps; let i = index" class="flex items-center flex-1 last:flex-none">
            <div 
              [class]="'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ' + 
              (currentStep > i ? 'bg-navy text-white' : currentStep === i ? 'bg-navy text-white ring-4 ring-navy/20' : 'bg-white text-slate-400 border border-slate-200')"
            >
              <svg *ngIf="currentStep > i" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span *ngIf="currentStep <= i">{{ i + 1 }}</span>
            </div>
            <div *ngIf="i < steps.length - 1" 
              [class]="'h-1 flex-grow mx-4 rounded transition-colors duration-300 ' + (currentStep > i ? 'bg-navy' : 'bg-slate-200')"
            ></div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="card-premium p-8 md:p-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-2">{{ steps[currentStep].title }}</h2>
          <p class="text-slate-600 mb-8">{{ steps[currentStep].description }}</p>

          <form [formGroup]="reportForm" (ngSubmit)="onSubmit()">
            <!-- Step 1: Type and Details -->
            <div *ngIf="currentStep === 0" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">Tipo de Ocorrência</label>
                <select 
                  formControlName="tipo"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none appearance-none bg-white"
                >
                  <option value="" disabled>Selecione uma categoria...</option>
                  <option *ngFor="let tipo of tipos" [value]="tipo">{{ tipo.replace('_', ' ') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">Relato Detalhado</label>
                <textarea 
                  formControlName="relato"
                  rows="6"
                  placeholder="Descreva o ocorrido com o máximo de detalhes possível. Sua identidade será protegida."
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none resize-none bg-white"
                ></textarea>
                <div class="flex justify-between mt-1 text-[10px] uppercase font-bold tracking-wider">
                  <span [class]="reportForm.get('relato')?.invalid && reportForm.get('relato')?.touched ? 'text-red-500' : 'text-slate-400'">
                    Mínimo 10 caracteres
                  </span>
                  <span class="text-slate-400">Máximo 5000</span>
                </div>
              </div>
            </div>

            <!-- Step 2: Extra Context -->
            <div *ngIf="currentStep === 1" class="space-y-6">
              <app-input 
                label="Setor Relacionado (Opcional)" 
                formControlName="setorRelacionado"
                placeholder="Ex: Comercial, RH, Logística..."
              ></app-input>

              <app-input 
                label="Data do Ocorrido (Opcional)" 
                type="date"
                formControlName="dataOcorrencia"
              ></app-input>

              <div class="p-4 bg-navy/5 rounded-lg border border-navy/10 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="anonima" 
                  formControlName="anonima"
                  class="mt-1 w-4 h-4 text-navy border-slate-300 rounded focus:ring-navy"
                />
                <label for="anonima" class="text-sm text-slate-700 leading-snug">
                  <strong class="text-navy block mb-1">Manter denúncia anônima</strong>
                  Ao marcar esta opção, seus dados de conexão não serão registrados e sua identidade permanecerá protegida.
                </label>
              </div>
            </div>

            <!-- Step 3: Review -->
            <div *ngIf="currentStep === 2" class="space-y-6">
              <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                <div>
                  <span class="text-xs font-bold text-slate-400 uppercase">Tipo</span>
                  <p class="font-medium">{{ reportForm.value.tipo }}</p>
                </div>
                <div>
                  <span class="text-xs font-bold text-slate-400 uppercase">Relato</span>
                  <p class="text-sm text-slate-600 line-clamp-3">{{ reportForm.value.relato }}</p>
                </div>
                <div class="flex gap-8">
                  <div>
                    <span class="text-xs font-bold text-slate-400 uppercase">Setor</span>
                    <p class="text-sm">{{ reportForm.value.setorRelacionado || 'Não informado' }}</p>
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-400 uppercase">Anônima</span>
                    <p class="text-sm">{{ reportForm.value.anonima ? 'Sim' : 'Não' }}</p>
                  </div>
                </div>
              </div>
              <p class="text-sm text-slate-500 italic">Ao clicar em enviar, sua denúncia será processada pelo comitê de compliance.</p>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-12 pt-6 border-t border-slate-100">
              <app-button 
                variant="secondary" 
                type="button" 
                [disabled]="currentStep === 0"
                (click)="prevStep()"
              >
                Voltar
              </app-button>

              <app-button 
                *ngIf="currentStep < steps.length - 1"
                type="button" 
                [disabled]="!isStepValid()"
                (click)="nextStep()"
              >
                Próximo
              </app-button>

              <app-button 
                *ngIf="currentStep === steps.length - 1"
                type="submit" 
                [loading]="loading"
                [disabled]="reportForm.invalid"
              >
                Enviar Denúncia
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ReportWizardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly occurrenceService = inject(OcorrenciaService);
  private readonly notify = inject(NotificationService);

  loading = false;
  currentStep = 0;
  tipos = Object.values(TipoOcorrencia);

  steps = [
    { title: 'O que aconteceu?', description: 'Selecione o tipo de ocorrência e relate os fatos.' },
    { title: 'Detalhes adicionais', description: 'Informações extras que podem ajudar na análise.' },
    { title: 'Revisão final', description: 'Confira as informações antes de enviar.' }
  ];

  reportForm = this.fb.group({
    tipo: ['', Validators.required],
    relato: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    setorRelacionado: [''],
    dataOcorrencia: [''],
    anonima: [true]
  });

  isStepValid(): boolean {
    if (this.currentStep === 0) {
      return !!(this.reportForm.get('tipo')?.valid && this.reportForm.get('relato')?.valid);
    }
    return true;
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  onSubmit(): void {
    if (this.reportForm.invalid) return;

    this.loading = true;
    
    const formValue = { ...this.reportForm.value };
    
    // Formata a data para LocalDateTime se estiver presente
    if (formValue.dataOcorrencia) {
      formValue.dataOcorrencia = `${formValue.dataOcorrencia}T00:00:00`;
    } else {
      delete formValue.dataOcorrencia;
    }

    this.occurrenceService.create(formValue as any).subscribe({
      next: (res) => {
        this.notify.success('Denúncia enviada com sucesso!');
        this.router.navigate(['/sucesso'], { state: { protocolo: res.protocolo } });
      },
      error: () => {
        this.loading = false;
        this.notify.error('Erro ao enviar denúncia. Tente novamente.');
      }
    });
  }
}
