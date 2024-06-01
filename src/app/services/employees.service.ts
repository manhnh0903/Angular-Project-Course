import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  url = 'http://localhost:3000/employees';

  constructor(private httpClient: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.url, { observe: 'body' }).pipe(
      map((response: Employee[]) => {
        return response.map((emp: Employee) => {
          return new Employee(emp.id, emp.firstName, emp.lastName, emp.sal);
        });
      })
    );
  }
  addEmployee(emp: any) {
    return this.httpClient.post(this.url, emp);
  }
  deleteEmployee(id: any) {
    // return this.httpClient.delete(`${this.url}/${id}`);
    return this.httpClient.delete(this.url + '/' + id);
  }
}
