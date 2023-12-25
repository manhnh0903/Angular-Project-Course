import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
// import { DialogEditProfileComponent } from './components/dialog-edit-profile/dialog-edit-profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AvatarSelectionComponent } from './components/avatar-selection/avatar-selection.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent /*canActivate: [authGuard]*/ },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'select-avatar', component: AvatarSelectionComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'profile', component: ProfileDialogComponent },
  // { path: 'edit_user', component: DialogEditProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
