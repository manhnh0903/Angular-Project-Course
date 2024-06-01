import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, exhaustMap, fromEvent, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-mergemap-demo',
  templateUrl: './mergemap-demo.component.html',
  styleUrls: ['./mergemap-demo.component.css'],
})
export class MergemapDemoComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.withoutMergeMap();
    this.withMergeMap();
    this.exhaustMapDemo();
  }
  withoutMergeMap() {
    let usersPublisher = of(1, 2, 3, 4);
    let usersSubscriber = usersPublisher.subscribe((user) => {
      console.log(user);
      const url = `https://jsonplaceholder.typicode.com/users/${user}`;
      this.httpClient.get(url).subscribe((userData) => {
        console.log(userData); // final User Data
      });
    });
  }
  withMergeMap() {
    let usersPublisher = of(1, 2, 3, 4);

    usersPublisher
      .pipe(
        mergeMap((user) => {
          const url = `https://jsonplaceholder.typicode.com/users/${user}`;
          return this.httpClient.get(url); //inner observable
        })
      )
      .subscribe((userData) => {
        console.log(userData);
      });
  }
  exhaustMapDemo() {
    const clicks = fromEvent(document, 'click'); // observables
    const result = clicks.pipe(
      exhaustMap(() => this.httpClient.get('https://fakestoreapi.com/products'))
    );
    result.subscribe((x) => console.log(x));

    // without exhaustMap
    /*  clicks.subscribe(click=>{
      this.httpClient.get('https://fakestoreapi.com/products').subscribe(response=>{
        console.log(response)
      })
    }) */
  }
}
