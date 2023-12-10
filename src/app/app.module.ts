import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './components/dialog-edit-profile/dialog-edit-profile.component';
import { LoginComponent } from './components/login/login.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AvatarSelectionComponent } from './components/avatar-selection/avatar-selection.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CreateChannelComponent } from './components/create-channel/create-channel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PeopleToChannelComponent } from './components/people-to-channel/people-to-channel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ChannelsChatComponent } from './components/channels-chat/channels-chat.component';
import { MatInputModule } from '@angular/material/input';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { TreadComponent } from './components/tread/tread.component';
import { PmChatComponent } from './components/pm-chat/pm-chat.component';
import { MessageComponent } from './components/message/message.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileDialogComponent,
    DialogEditProfileComponent,
    LoginComponent,
    SignUpComponent,
    AvatarSelectionComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SideMenuComponent,
    CreateChannelComponent,
    PeopleToChannelComponent,
    ChannelsChatComponent,
    ReactionsComponent,
    TreadComponent,
    PmChatComponent,
    MessageComponent,
    EditChannelComponent,
  ],
  imports: [
    
    PickerComponent,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
