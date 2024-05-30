import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{


  constructor( private fb : FormBuilder) { }

  public loginFormGroup! : FormGroup;


  ngOnInit(): void {

    this.loginFormGroup = this.fb.group({

      username : this.fb.control(''),
      password : this.fb.control(''),

    });
    
  }

  login() {
    
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;

    console.log("Username: " + username);

    console.log("Password:" + password);


    }
    


}
