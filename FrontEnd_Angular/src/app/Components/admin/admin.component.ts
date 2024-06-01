import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{


  constructor(public authservice : AuthenticationService) { }

  ngOnInit(): void {
  }

  logout() {
    
    this.authservice.logout();
   


    }
    

}
