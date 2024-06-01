import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private obj: UsersService) {
    // Dependency Injection
    // let obj = new UsersService();
  }

  ngOnInit(): void {
    this.users = this.obj.getAllUsers();
  }
}
