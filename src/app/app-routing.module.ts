import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AvatarSelectionComponent } from './components/avatar-selection/avatar-selection.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'select-avatar', component: AvatarSelectionComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'profile', component: ProfileDialogComponent },
  { path: 'edit_user', component: DialogEditProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
