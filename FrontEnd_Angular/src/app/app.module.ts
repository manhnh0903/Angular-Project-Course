import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminComponent } from './Components/admin/admin.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './Components/home/home.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { StudentsComponent } from './Components/students/students.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { LoadPaymentComponent } from './Components/load-payment/load-payment.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { LoadstudentsComponent } from './Components/loadstudents/loadstudents.component';
import { MatInput } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    ProfileComponent,
    StudentsComponent,
    PaymentComponent,
    LoginComponent,
    DashboardComponent,
    LoadstudentsComponent,
    LoadPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDrawer,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatDividerModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
    MatCardActions,
    FormsModule,
    ReactiveFormsModule,
    
   
  
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
