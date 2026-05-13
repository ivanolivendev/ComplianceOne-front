import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="mb-4">
      @if (label) {
        <label [for]="id" class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {{ label }}
        </label>
      }
      
      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          (input)="onInput($event)"
          (blur)="onBlur()"
          [class]="'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 outline-none focus:ring-4 ' + getStatusClasses()"
        />
        
        @if (error) {
          <p class="mt-1.5 text-xs text-red-500 font-medium ml-1 flex items-center">
            <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ error }}
          </p>
        }
      </div>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() error = '';

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  getStatusClasses(): string {
    if (this.error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30';
    }
    return 'border-slate-200 focus:border-navy focus:ring-navy/10 bg-white';
  }

  onInput(event: any): void {
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
