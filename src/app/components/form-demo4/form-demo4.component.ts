import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-demo4',
  templateUrl: './form-demo4.component.html',
  styleUrls: ['./form-demo4.component.css'],
})
export class FormDemo4Component implements OnInit {
  registerForm: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['a', Validators.required],
      lastName: ['b', Validators.required],
      email: ['c', Validators.required],
    });
  }
}
