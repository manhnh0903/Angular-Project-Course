import { Component, OnInit } from '@angular/core';
import { EmpService } from 'src/app/services/emp.service';

@Component({
  selector: 'app-emp3',
  templateUrl: './emp3.component.html',
  styleUrls: ['./emp3.component.css'],
})
export class Emp3Component implements OnInit {
  employees: any[] = [];

  constructor(private empService: EmpService) {
    // this.empService = new EmpService();
  }

  ngOnInit(): void {
    this.employees = this.empService.getAllEmployees();
  }
}
