import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-databinding',
  templateUrl: './databinding.component.html',
  styles: ['img{border:5px solid blue;}'],
  styleUrls: ['./databinding.component.css', './databinding2.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  // accept-incoming css from index.html & my css should be applied to others
})
export class DatabindingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  name: string = 'Sachin Tendulkar';
  img_url =
    'https://m.cricbuzz.com/a/img/v1/192x192/i1/c171004/sachin-tendulkar.jpg';

  flag: boolean = true;
  f1() {
    alert('I am f1');
  }
  addResult: any;
  addition(num1: any, num2: any) {
    this.addResult = +num1 + +num2;
  }
}
