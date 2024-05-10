import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { MainComponent } from './main/main.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', component: MainComponent },
];
