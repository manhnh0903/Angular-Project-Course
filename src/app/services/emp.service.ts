import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmpService {
  constructor() {}

  employees = [
    { eId: 101, name: 'sanjay', sal: 5000, gender: 'male' },
    { eId: 104, name: 'geeta', sal: 8000, gender: 'female' },
    { eId: 103, name: 'ranjan', sal: 7000, gender: 'female' },
    { eId: 102, name: 'sita', sal: 9000, gender: 'male' },
  ];
  getAllEmployees() {
    return this.employees;
  }
  addNewEmployee(empObj: any) {
    this.employees.push(empObj);
  }
}
