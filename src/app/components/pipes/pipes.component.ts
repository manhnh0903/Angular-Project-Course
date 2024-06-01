import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipes',
  templateUrl: './pipes.component.html',
  styleUrls: ['./pipes.component.css'],
})
export class PipesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  name = 'saChIn tEnDuLkaR';
  mySal = 5000;
  today = new Date();
  // myDOB = new Date('1989-03-03').toISOString().split('T')[0];
  myDOB = '1989-03-03';

  user = { name: 'sanjay', age: 30, add: 'bangalore' };
  cars = ['tata', 'honda', 'maruti', 'hundai', 'toyota'];

  msg = 'hello';
  cardinal: number = 31;

  arr: number[] = [20, 50, 10, 40, 30];
}
