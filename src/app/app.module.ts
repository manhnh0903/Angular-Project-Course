import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileDialogComponent,
    DialogEditProfileComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
