import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div 
        *ngFor="let toast of toasts$ | async" 
        [class]="'pointer-events-auto px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 ' + getClasses(toast.type)"
      >
        <div class="flex-grow font-semibold text-sm">
          {{ toast.message }}
        </div>
        <button (click)="remove(toast.id)" class="text-current opacity-50 hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);
  toasts$ = this.notificationService.toasts$;

  getClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-emerald-500 text-white border-emerald-400';
      case 'error': return 'bg-red-500 text-white border-red-400';
      case 'warning': return 'bg-amber-500 text-white border-amber-400';
      default: return 'bg-navy text-white border-navy/50';
    }
  }

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}
