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
import { AuthGuard } from './Guards/auth.guard';
import { AuthorizationGuard } from './Guards/authorization.guard';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent , 

  canActivate: [AuthGuard],
  
  children : [
   { path: 'home', component: HomeComponent },
   { path: 'profile', component: ProfileComponent },
   { path: 'dashboard', component: DashboardComponent },
   { path: 'students', component: StudentsComponent },
   { path: 'payment', component: PaymentComponent },
   { path: 'loadpayment', component: LoadPaymentComponent , 
   canActivate: [AuthorizationGuard] , data : {roles : ['ADMIN']}},
   { path: 'loadstudents', component: LoadstudentsComponent ,
    canActivate: [AuthorizationGuard] , data : {roles : ['ADMIN']}},
  
  ]},
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
