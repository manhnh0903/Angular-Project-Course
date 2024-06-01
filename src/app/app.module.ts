import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CenterComponent } from './components/center/center.component';
import { LoginModule } from 'src/login/login.module';
import { DatabindingComponent } from './components/databinding/databinding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabindingChildComponent } from './components/databinding-child/databinding-child.component';
import { DirectivesComponent } from './components/directives/directives.component';
import { ProductsComponent } from './components/products/products.component';
import { NumberonlyDirective } from './directives/numberonly.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { CountDirective } from './directives/count.directive';
import { ModalComponent } from './components/modal/modal.component';
import { PipesComponent } from './components/pipes/pipes.component';
import { RemainingPipe } from './custom_pipes/remaining.pipe';
import { OrdinalPipe } from './custom_pipes/ordinal.pipe';
import { MySortPipe } from './custom_pipes/my-sort.pipe';
import { ParentComponent } from './components/parent/parent.component';
import { Child1Component } from './components/child1/child1.component';
import { Child2Component } from './components/child2/child2.component';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './services/users.service';
import { Emp1Component } from './components/emp1/emp1.component';
import { Emp2Component } from './components/emp2/emp2.component';
import { Emp3Component } from './components/emp3/emp3.component';
import { CommentsComponent } from './components/comments/comments.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { TodosComponent } from './components/todos/todos.component';
import { MyInterceptor1 } from './interceptor1.service';
import { RetryService } from './retry.service';
import { ObservableDemo1Component } from './observable-demo1/observable-demo1.component';
import { ObservableDemo2Component } from './observable-demo2/observable-demo2.component';
import { ForkJoinDemoComponent } from './components/fork-join-demo/fork-join-demo.component';
import { MergemapDemoComponent } from './components/mergemap-demo/mergemap-demo.component';
import { ObservableDemo3Component } from './components/observable-demo3/observable-demo3.component';
import { SubjectsDemoComponent } from './components/subjects-demo/subjects-demo.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageAddComponent } from './components/message-add/message-add.component';
import { FormDemo1Component } from './components/form-demo1/form-demo1.component';
import { FormDemo2Component } from './components/form-demo2/form-demo2.component';
import { FormDemo3Component } from './components/form-demo3/form-demo3.component';
import { FormDemo4Component } from './components/form-demo4/form-demo4.component';
import { FormDemo5Component } from './components/form-demo5/form-demo5.component';

@NgModule({
  // components , directives , pipes
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
    CenterComponent,
    DatabindingComponent,
    DatabindingChildComponent,
    DirectivesComponent,
    ProductsComponent,
    NumberonlyDirective,
    HighlightDirective,
    CountDirective,
    ModalComponent,
    PipesComponent,
    RemainingPipe,
    OrdinalPipe,
    MySortPipe,
    ParentComponent,
    Child1Component,
    Child2Component,
    UsersComponent,
    Emp1Component,
    Emp2Component,
    Emp3Component,
    CommentsComponent,
    EmployeesComponent,
    TodosComponent,
    ObservableDemo1Component,
    ObservableDemo2Component,
    ForkJoinDemoComponent,
    MergemapDemoComponent,
    ObservableDemo3Component,
    SubjectsDemoComponent,
    MessageListComponent,
    MessageAddComponent,
    FormDemo1Component,
    FormDemo2Component,
    FormDemo3Component,
    FormDemo4Component,
    FormDemo5Component,
  ],
  // dependent modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  // services / injectables
  providers: [
    UsersService,
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor1, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RetryService, multi: true },
  ],
  bootstrap: [AppComponent], // Which Comp To Load = AppComponent
})
export class AppModule {}
