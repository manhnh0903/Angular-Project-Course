import { Component, OnInit } from '@angular/core';
import { Observable, publish, Subject } from 'rxjs';

@Component({
  selector: 'app-observable-demo3',
  templateUrl: './observable-demo3.component.html',
  styleUrls: ['./observable-demo3.component.css'],
})
export class ObservableDemo3Component implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.observableDemo();
    this.subjectDemo();
  }
  observableDemo() {
    // Cold
    let publisher1 = new Observable(function (publisher) {
      publisher.next('AAAAAA');
      publisher.next('BBBBBB');
      publisher.next('CCCCCC');
      publisher.complete();
    });
    let subscriber1 = publisher1.subscribe((data) => console.log(data));
  }
  subjectDemo() {
    // hot
    let mySubject = new Subject();
    mySubject.next('xxx');
    mySubject.next('yyy');
    mySubject.subscribe((data) => console.log(data));
    mySubject.next('zzz');
  }
}
