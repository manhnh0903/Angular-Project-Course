import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-observable-demo1',
  templateUrl: './observable-demo1.component.html',
  styleUrls: ['./observable-demo1.component.css'],
})
export class ObservableDemo1Component implements OnInit {
  allComments: any;
  constructor(private httpClient:HttpClient) {}

  ngOnInit(): void {
    this.promiseExample();
    this.observableExample();
  }
  promiseExample() {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((json) => (this.allComments = json));
  }
  observableExample() {
    this.httpClient.get('https://jsonplaceholder.typicode.com/users').subscribe(
      (next)=>{console.log(next)},
      err=>{console.log(err)},
      ()=>{console.log('completed')}
    )
  }
}
