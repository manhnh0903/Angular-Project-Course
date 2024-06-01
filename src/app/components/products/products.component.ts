import { Component, OnInit } from '@angular/core';
import * as data from './products.json';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  p: any;
  products = (data as any).default;

  searchText: string = '';

  constructor() {}

  ngOnInit(): void {}
}
