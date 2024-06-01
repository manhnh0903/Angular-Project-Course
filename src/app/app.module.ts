import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/home-components/header/header.component';
import { ProfileDialogComponent } from './components/overlay-components/profile-dialog/profile-dialog.component';
import { DialogEditProfileComponent } from './components/overlay-components/dialog-edit-profile/dialog-edit-profile.component';
import { LoginComponent } from './components/auth-componentes/login/login.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { SignUpComponent } from './components/auth-componentes/sign-up/sign-up.component';
import { AvatarSelectionComponent } from './components/auth-componentes/avatar-selection/avatar-selection.component';
import { HomeComponent } from './components/home-components/home/home.component';
import { ForgotPasswordComponent } from './components/auth-componentes/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth-componentes/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/home-components/side-menu/side-menu.component';
import { CreateChannelComponent } from './components/chat-components/channel-components/create-channel/create-channel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PeopleToChannelComponent } from './components/chat-components/channel-components/people-to-channel/people-to-channel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ChannelsChatComponent } from './components/chat-components/channel-components/channels-chat/channels-chat.component';
import { MatInputModule } from '@angular/material/input';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ReactionsComponent } from './components/message-components/reactions/reactions.component';
import { TreadComponent } from './components/chat-components/tread/tread.component';
import { PmChatComponent } from './components/chat-components/pm-chat/pm-chat.component';
import { MessageComponent } from './components/message-components/message/message.component';
import { EditChannelComponent } from './components/chat-components/channel-components/edit-channel/edit-channel.component';
import { PmRecipientOverviewComponent } from './components/overlay-components/pm-recipient-overview/pm-recipient-overview.component';
import { FooterInputComponent } from './components/chat-components/channel-components/footer-input/footer-input.component';
import { MentionModule } from 'angular-mentions';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ImprintComponent } from './components/legal-components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/legal-components/privacy-policy/privacy-policy.component';

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
    PmRecipientOverviewComponent,
    FooterInputComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    LayoutModule,
    HttpClientModule,
    MentionModule,
    PickerComponent,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  isMobile;
}
