import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { StudentsComponent } from './Components/students/students.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { AdminComponent } from './Components/admin/admin.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoadPaymentComponent } from './Components/load-payment/load-payment.component';
import { LoadstudentsComponent } from './Components/loadstudents/loadstudents.component';


const routes: Routes = [
      { path: 'home', component: HomeComponent },
   { path: 'profile', component: ProfileComponent },
   { path: 'login', component: LoginComponent },
   { path: 'dashboard', component: DashboardComponent },
   { path: 'students', component: StudentsComponent },
   { path: 'payment', component: PaymentComponent },
   { path: 'loadpayment', component: LoadPaymentComponent },
   { path: 'loadstudents', component: LoadstudentsComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
