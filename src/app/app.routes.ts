import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';

import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AuthenticateEmailComponent } from './auth/components/authenticate-email/authenticate-email.component';
import { HomeComponent } from './home/components/home/home.component';
import { authGuard } from './auth/guards/auth.guard';
import { PrivacyPolicyComponent } from './legal/components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
  { path: 'activate/:uid/:token', component: AuthenticateEmailComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
];
