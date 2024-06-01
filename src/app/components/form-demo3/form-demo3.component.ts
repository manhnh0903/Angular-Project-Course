import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-demo3',
  templateUrl: './form-demo3.component.html',
  styleUrls: ['./form-demo3.component.css'],
})
export class FormDemo3Component implements OnInit {
  registerForm: any;

  constructor() {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl('sachin', [
          Validators.required,
          Validators.minLength(5),
        ]),
        lastName: new FormControl('t', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        address: new FormGroup({
          city: new FormControl(''),
          state: new FormControl(''),
          pin: new FormControl(''),
        }),
      },
      { updateOn: 'blur' }
    );
  }
}
