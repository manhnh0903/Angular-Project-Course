import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private authService: FirebaseAuthService) { }
  showMenu = true

  
  /*   ngOnInit() {
      // this.authService.checkAuth(); //cecks if user is loged in
    } */


  hideMenu() {
    if(this.showMenu==true){
      this.showMenu=false
    }else{
      this.showMenu=true
    }
  }
}
