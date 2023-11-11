import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  showMenu = true

  hideMenu() {
    if (this.showMenu == true) {
      this.showMenu = false
    } else { this.showMenu = true }
    console.log(this.showMenu);
    
  }
}
