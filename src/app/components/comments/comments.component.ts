import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  allComments: any[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // this.getCommentsUsingFetch();
    this.getCommentsUsingHttpClient();
  }
  getCommentsUsingHttpClient() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/comments')
      .subscribe((response: any) => {
        this.allComments = response;
      });
  }

  getCommentsUsingFetch() {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((json) => (this.allComments = json));
  }
}
