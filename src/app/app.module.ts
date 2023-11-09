import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';
import { LoginComponent } from './components/login/login.component';
/* import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; */
// import { environment } from 'src/environments/environment';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileDialogComponent,
    DialogEditProfileComponent,
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /*     provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) */
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
