import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';


const routes: Routes = [
  { path: 'profile', component: ProfileDialogComponent },
  { path: 'edit_user', component: DialogEditProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
