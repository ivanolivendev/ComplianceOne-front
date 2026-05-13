import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusOcorrencia } from '../../core/models/compliance.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ' + getStatusClasses()">
      <span class="w-1.5 h-1.5 rounded-full mr-1.5" [class]="getDotClasses()"></span>
      {{ label || formattedLabel }}
    </span>
  `
})
export class BadgeComponent {
  @Input() status: StatusOcorrencia | string = '';
  @Input() label = '';

  get formattedLabel(): string {
    return (this.status as string).replace(/_/g, ' ');
  }

  getStatusClasses(): string {
    switch (this.status) {
      case StatusOcorrencia.RECEBIDA:
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case StatusOcorrencia.EM_TRIAGEM:
      case StatusOcorrencia.EM_INVESTIGACAO:
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case StatusOcorrencia.CONCLUIDA:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case StatusOcorrencia.CANCELADA:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  getDotClasses(): string {
    switch (this.status) {
      case StatusOcorrencia.RECEBIDA: return 'bg-blue-500';
      case StatusOcorrencia.EM_TRIAGEM:
      case StatusOcorrencia.EM_INVESTIGACAO: return 'bg-amber-500';
      case StatusOcorrencia.CONCLUIDA: return 'bg-emerald-500';
      case StatusOcorrencia.CANCELADA: return 'bg-slate-400';
      default: return 'bg-slate-500';
    }
  }
}
