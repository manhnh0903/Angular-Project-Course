import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

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
  @Input() type: string = 'text';
  @Input() errorSet: string = '';
  @Input() httpError: boolean = false;

  @Input() control: AbstractControl | null = null;

  value: string | null = null;
  touched: boolean = false;
  onChange = (_: any) => {};
  onTouched = () => {};

  ngDoCheck() {
    if (this.touched !== this.control?.touched) {
      this.touched = this.control?.touched ?? false;
      this.onTouched();
    }
  }

  writeValue(value: string): void {
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

  onBlur() {
    this.onTouched();
  }
}
