import { Component, OnInit } from '@angular/core';
import { EmpService } from 'src/app/services/emp.service';

@Component({
  selector: 'app-emp1',
  templateUrl: './emp1.component.html',
  styleUrls: ['./emp1.component.css'],
  // providers: [EmpService],
})
export class Emp1Component implements OnInit {
  employees: any[] = [];

  constructor(private empService: EmpService) {
    
  }

  ngOnInit(): void {
    this.employees = this.empService.getAllEmployees();
  }
}
