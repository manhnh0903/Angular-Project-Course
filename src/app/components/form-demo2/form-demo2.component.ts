import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-demo2',
  templateUrl: './form-demo2.component.html',
  styleUrls: ['./form-demo2.component.css'],
})
export class FormDemo2Component implements OnInit {
  user: any = {
    fName: '',
    lName: 'tendulkar',
    email: '',
    add: { city: '', state: '', pin: 123 },
  };

  constructor() {}

  ngOnInit(): void {}

  submitMyForm(myForm: any) {
    console.log(myForm);
  }
}
