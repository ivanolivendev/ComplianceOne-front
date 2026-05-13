import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'relative flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg font-medium ' + getVariantClasses()"
    >
      <span [class.opacity-0]="loading">
        <ng-content></ng-content>
      </span>
      
      @if (loading) {
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  getVariantClasses(): string {
    const sizes = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5',
      lg: 'px-8 py-3.5 text-lg'
    };

    const variants = {
      primary: 'bg-navy text-white hover:bg-opacity-90 shadow-lg shadow-navy/20',
      secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200',
      outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
    };

    return `${sizes[this.size]} ${variants[this.variant]}`;
  }
}
