import { Component, OnInit } from '@angular/core';
import { filter, from, interval, map, Observable, range, take } from 'rxjs';

@Component({
  selector: 'app-observable-demo2',
  templateUrl: './observable-demo2.component.html',
  styleUrls: ['./observable-demo2.component.css'],
})
export class ObservableDemo2Component implements OnInit {
  publisher1: any;
  subscriber1: any;
  publisher2: any;
  subscriber2: any;
  publisher2_5: any;

  constructor() {}

  ngOnInit(): void {
    this.publisher1 = new Observable(function (observer) {
      observer.next('AAAAAAAAAAA');
      observer.next('BBBBBBBBBBBB');
      observer.next('CCCCCCCCCCCC');
      observer.next('DDDDDDDDDD');
      observer.complete();
    });

    this.subscriber1 = this.publisher1.subscribe(
      (res: any) => console.log(res),
      (err: any) => console.log(err),
      () => console.log('all the data received')
    );

    this.rxJsOperators();
  }
  rxJsOperators() {
    let cars = ['tata', 'honda', 'maruti', 'hundai'];
    let carsPublisher = from(cars);
    let carsSubscriber = carsPublisher.subscribe(
      (res: any) => console.log(res),
      (err: any) => console.log(err),
      () => console.log('all the cars received')
    );

    // this.publisher2 = interval(1000);
    // this.subscriber2 = this.publisher2.subscribe((res: any) => console.log(res));
    // this.publisher2_5 = this.publisher2.pipe(take(5))

    let publisher3 = range(1, 10);
    let publisher3_even = publisher3.pipe(filter((ele) => ele % 2 == 0));
    let publisher3_square = publisher3.pipe(map((ele) => ele * ele));

    let subscriber3 = publisher3.subscribe((res: any) => console.log(res));
    let subscriber3_even = publisher3_even.subscribe((res: any) =>
      console.log(res)
    );
    let subscriber3_square = publisher3_square.subscribe((res: any) =>
      console.log(res)
    );
  }
}
