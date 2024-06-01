import { Component, OnInit } from '@angular/core';
import { ToDo } from 'src/app/models/todo-model';
import { TodosService } from 'src/app/services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  allTodos: ToDo[] = [];

  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
    this.todosService.getAllToDos().subscribe((response: ToDo[]) => {
      this.allTodos = response;
    });
  }
}
