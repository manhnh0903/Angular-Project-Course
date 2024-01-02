import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth-componentes/login/login.component';
import { SignUpComponent } from './components/auth-componentes/sign-up/sign-up.component';
import { AvatarSelectionComponent } from './components/auth-componentes/avatar-selection/avatar-selection.component';
import { HomeComponent } from './components/home-components/home/home.component';
import { ForgotPasswordComponent } from './components/auth-componentes/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth-componentes/reset-password/reset-password.component';
import { authGuard } from './guard/auth.guard';
import { ImprintComponent } from './components/legal-components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/legal-components/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'select-avatar', component: AvatarSelectionComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
