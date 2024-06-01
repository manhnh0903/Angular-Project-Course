import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDo } from '../models/todo-model';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  url = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private httpClient: HttpClient) {}

  getAllToDos(): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url);
  }
}
