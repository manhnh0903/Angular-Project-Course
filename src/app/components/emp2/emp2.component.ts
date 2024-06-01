import { Component, OnInit } from '@angular/core';
import { EmpService } from 'src/app/services/emp.service';

@Component({
  selector: 'app-emp2',
  templateUrl: './emp2.component.html',
  styleUrls: ['./emp2.component.css'],
})
export class Emp2Component implements OnInit {
  employees: any[] = [];

  constructor(public empService: EmpService) {}

  ngOnInit(): void {
    this.employees = this.empService.getAllEmployees();
  }
}
