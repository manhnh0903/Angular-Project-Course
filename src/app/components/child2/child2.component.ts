import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.css'],
  inputs: ['a'],
  outputs: ['eventObj1'],
})
export class Child2Component implements OnInit {
  a: number = 0;
  @Input() f1: any;
  name: string = 'Sachin Tendulkar';

  eventObj1 = new EventEmitter();
  sendData() {
    this.eventObj1.emit(this.name);
  }

  constructor() {}
  ngOnInit(): void {}
}
