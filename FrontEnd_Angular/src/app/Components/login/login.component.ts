import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{


  constructor( private fb : FormBuilder , private AuthService : AuthenticationService , private router : Router) { }

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

    let auth = this.AuthService.login(username, password);

    if (auth) {
      this.router.navigate(['/admin']);


    }
  }
    
}
