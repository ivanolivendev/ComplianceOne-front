import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { AnexoService } from '../../core/services/anexo.service';
import { TipoOcorrencia } from '../../core/models/compliance.model';
import { NotificationService } from '../../core/services/notification.service';
import { catchError, of, concatMap, from, map } from 'rxjs';

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
            <!-- Step 1: Type, Details & Attachments -->
            <div *ngIf="currentStep === 0" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">Tipo de Ocorrência</label>
                <select 
                  formControlName="tipo"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none appearance-none bg-white font-medium"
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
                  placeholder="Descreva o ocorrido com o máximo de detalhes possível..."
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none resize-none bg-white"
                ></textarea>
                <div class="flex justify-between mt-1 text-[10px] uppercase font-bold tracking-wider">
                  <span [class]="reportForm.get('relato')?.invalid && reportForm.get('relato')?.touched ? 'text-red-500' : 'text-slate-400'">
                    Mínimo 10 caracteres
                  </span>
                  <span class="text-slate-400">Máximo 5000</span>
                </div>
              </div>

              <div class="pt-4">
                <label class="block text-sm font-semibold text-slate-700 mb-3 ml-1">Anexar Evidências (Opcional)</label>
                <div 
                  (click)="fileInput.click()"
                  class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-navy hover:bg-navy/5 transition-all cursor-pointer group bg-slate-50/50"
                >
                  <input #fileInput type="file" (change)="onFileSelected($event)" multiple class="hidden">
                  <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-slate-400 group-hover:text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p class="text-sm text-slate-900 font-semibold">Clique para selecionar arquivos</p>
                  <p class="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Imagens, PDF ou Documentos (Máx 10MB)</p>
                </div>

                <div *ngIf="selectedFiles.length > 0" class="mt-4 space-y-2">
                  <div *ngFor="let file of selectedFiles; let i = index" class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-3 overflow-hidden">
                      <div class="w-8 h-8 bg-slate-50 rounded flex items-center justify-center shrink-0">
                         <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-900 truncate">{{ file.name }}</p>
                        <p class="text-[10px] text-slate-500 uppercase">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                    </div>
                    <button (click)="removeFile(i)" type="button" class="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Extra Context -->
            <div *ngIf="currentStep === 1" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  Ao marcar esta opção, seus dados de conexão não serão registrados.
                </label>
              </div>
            </div>

            <!-- Step 3: Review -->
            <div *ngIf="currentStep === 2" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                <div>
                  <span class="text-xs font-bold text-slate-400 uppercase">Tipo</span>
                  <p class="font-medium">{{ (reportForm.value.tipo || '').replace('_', ' ') }}</p>
                </div>
                <div>
                  <span class="text-xs font-bold text-slate-400 uppercase">Relato</span>
                  <p class="text-sm text-slate-600">{{ reportForm.value.relato }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-xs font-bold text-slate-400 uppercase">Setor</span>
                    <p class="text-sm font-medium">{{ reportForm.value.setorRelacionado || 'Não informado' }}</p>
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-400 uppercase">Anônima</span>
                    <p class="text-sm font-medium">{{ reportForm.value.anonima ? 'Sim' : 'Não' }}</p>
                  </div>
                </div>
                <div *ngIf="selectedFiles.length > 0">
                  <span class="text-xs font-bold text-slate-400 uppercase">Anexos ({{ selectedFiles.length }})</span>
                  <p class="text-sm font-medium text-navy">{{ selectedFiles.length }} arquivo(s) selecionado(s)</p>
                </div>
              </div>

              <!-- Upload Progress -->
              <div *ngIf="loading && selectedFiles.length > 0" class="space-y-4 pt-4 border-t border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase">Enviando arquivos...</p>
                <div *ngFor="let file of selectedFiles" class="space-y-1">
                  <div class="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>{{ file.name }}</span>
                    <span>{{ uploadProgress[file.name] || 0 }}%</span>
                  </div>
                  <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-navy transition-all duration-300" 
                      [style.width.%]="uploadProgress[file.name] || 0"
                    ></div>
                  </div>
                </div>
              </div>

              <p class="text-sm text-slate-500 italic">Ao clicar em enviar, sua denúncia será processada pelo comitê de compliance de forma segura.</p>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-12 pt-6 border-t border-slate-100">
              <app-button 
                variant="secondary" 
                type="button" 
                [disabled]="currentStep === 0 || loading"
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
  private readonly anexoService = inject(AnexoService);
  private readonly notify = inject(NotificationService);

  loading = false;
  currentStep = 0;
  tipos = Object.values(TipoOcorrencia);
  selectedFiles: File[] = [];
  uploadProgress: { [key: string]: number } = {};

  steps = [
    { title: 'O que aconteceu?', description: 'Relate os fatos e anexe evidências que ajudem na análise.' },
    { title: 'Detalhes adicionais', description: 'Informações extras que podem ajudar na triagem.' },
    { title: 'Revisão final', description: 'Confira as informações antes de enviar.' }
  ];

  reportForm = this.fb.group({
    tipo: ['', Validators.required],
    relato: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    setorRelacionado: [''],
    dataOcorrencia: [''],
    anonima: [true]
  });

  // Re-map field 'relate' to 'relato' for backend compatibility if needed, 
  // but looking at previous file it was 'relato'. Let's keep it 'relato'.
  // Fix: The template used 'relato' in formControlName, but the fb.group had 'relato' too.
  // Wait, I saw 'relate' in my new ReplacementContent. Let me fix it back to 'relato'.

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

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          this.notify.error(`Arquivo ${file.name} é muito grande (Máx 10MB)`);
          continue;
        }
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.prepareData();

    this.occurrenceService.create(formValue).subscribe({
      next: (res) => {
        if (this.selectedFiles.length > 0) {
          this.uploadFiles(res.id, res.protocolo);
        } else {
          this.finalize(res.protocolo);
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.status === 429 
          ? 'Limite de denúncias atingido. Tente novamente em 1 hora.' 
          : 'Falha na conexão com o servidor. Verifique sua internet.';
        this.notify.error(msg);
      }
    });
  }

  private prepareData(): any {
    const raw = { ...this.reportForm.value };
    if (raw.dataOcorrencia) {
      raw.dataOcorrencia = `${raw.dataOcorrencia}T00:00:00`;
    } else {
      delete raw.dataOcorrencia;
    }
    return raw;
  }

  private uploadFiles(occurrenceId: string, protocolo: string): void {
    // Reset progress tracking
    this.selectedFiles.forEach(f => this.uploadProgress[f.name] = 0);

    from(this.selectedFiles).pipe(
      concatMap(file => this.anexoService.upload(occurrenceId, file).pipe(
        catchError(err => {
          const errorMsg = err.error?.message || err.message || 'Erro no upload';
          console.error(`Erro no arquivo ${file.name}:`, err);
          this.notify.error(`Falha ao enviar ${file.name}: ${errorMsg}`);
          return of(null); // Continue with next file
        }),
        map(res => {
          if (typeof res === 'number') {
            this.uploadProgress[file.name] = res;
          }
          return res;
        })
      ))
    ).subscribe({
      complete: () => {
        this.loading = false;
        this.finalize(protocolo);
      }
    });
  }

  private finalize(protocolo: string): void {
    this.notify.success('Sua denúncia foi registrada com sucesso!');
    this.router.navigate(['/sucesso'], { state: { protocolo } });
  }
}
