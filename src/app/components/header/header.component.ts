import { Component, ElementRef } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent {
  menuOpen = false
  constructor(private el: ElementRef) { }
  openMenu() { this.menuOpen = true }

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('menuProfileContainer')) {
        this.closeMenu();
      }
    });
  }
  closeMenu() { this.menuOpen = false }
}
