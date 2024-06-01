import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmp: any = {};
  isLoading: boolean = false;

  constructor(private employeesService: EmployeesService) {}

  ngOnInit(): void {}

  getAllEmployees() {
    this.isLoading = true;
    this.employeesService.getEmployees().subscribe((response: Employee[]) => {
      console.log(response);
      this.employees = response;
      this.isLoading = false;
    });
  }
  addEmp(a: any, b: any, c: any) {
    const newEmp = { first_name: a, last_name: b, email: c };
    this.employeesService.addEmployee(newEmp).subscribe((response) => {
      Swal.fire('ADDED', 'Employee Added Successfully', 'success');
      this.getAllEmployees();
    });
  }
  deleteEmp(id: any) {
    this.employeesService.deleteEmployee(id).subscribe((response) => {
      Swal.fire('DELETED', 'Employee Deleted Successfully', 'success');
      this.getAllEmployees();
    });
  }
  editEmp(emp: any) {
    this.selectedEmp = emp;
  }
}
