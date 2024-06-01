import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map, of, zip } from 'rxjs';

@Component({
  selector: 'app-fork-join-demo',
  templateUrl: './fork-join-demo.component.html',
  styleUrls: ['./fork-join-demo.component.css'],
})
export class ForkJoinDemoComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.zipDemo();
    this.fetchDataFromMultipleAPIs();
  }
  zipDemo() {
    let publisher1 = of(32, 31, 34);
    let publisher2 = of('sanjay', 'ranjan', 'bishnu');
    let publisher3 = of('bang', 'chennai', 'hyderabad');
    let finalPublisher = zip(publisher1, publisher2, publisher3).pipe(
      map(([age, name, add]) => ({ age, name, add }))
    );
    finalPublisher.subscribe((data) => console.log(data));
  }

  

  fetchDataFromMultipleAPIs() {
    let request1 = this.httpClient.get(
      'https://jsonplaceholder.typicode.com/todos'
    );
    let request2 = this.httpClient.get(
      'https://jsonplaceholder.typicode.com/comments'
    );
    let request3 = this.httpClient.get(
      'https://jsonplaceholder.typicode.com/users'
    );

    forkJoin([request1, request2, request3]).subscribe(([res1, res2, res3]) => {
      console.log(res1, res2, res3);
    });
  }
}
