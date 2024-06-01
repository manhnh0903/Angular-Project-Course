import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@Component({
  selector: 'app-subjects-demo',
  templateUrl: './subjects-demo.component.html',
  styleUrls: ['./subjects-demo.component.css'],
})
export class SubjectsDemoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // let publisher1 = new Subject();
    // let publisher1 = new BehaviorSubject('Default Value');
    // let publisher1 = new ReplaySubject();
    let publisher1 = new AsyncSubject();

    publisher1.next('AAA');
    publisher1.next('BBB');
    let subscriber1 = publisher1.subscribe((data) =>
      console.log('subscriber-1 ' + data)
    );
    publisher1.next('CCC');
    let subscriber2 = publisher1.subscribe((data) =>
      console.log('subscriber-2 ' + data)
    );
    publisher1.next('DDD');
    publisher1.complete();
  }
}
