import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input-with-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input-with-error.component.html',
  styleUrl: './form-input-with-error.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputWithErrorComponent),
      multi: true,
    },
  ],
})
export class FormInputWithErrorComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() error: string | null = null;
  value: string | null = null;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateValue(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
