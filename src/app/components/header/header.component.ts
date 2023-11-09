import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent {
  menuOpen = false

  openMenu() { this.menuOpen = true }

  closeMenu() { this.menuOpen = false }
}
