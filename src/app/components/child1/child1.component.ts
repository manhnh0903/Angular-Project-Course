import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.css'],
  inputs: ['aChild', 'name', 'arr'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Child1Component implements OnInit {
  // @Input() aChild:number | undefined;
  aChild: number = 0;
  name: any;
  age: number = 30;
  arr: any;
  @ViewChild('div1') div1: any;
  @ViewChildren('myAge') myAge: any;

  constructor(public changeDetectorObj: ChangeDetectorRef) {
    console.log('Child constructor');
    const div1 = document.getElementById('div1');
    console.log(div1);
  }
  ngOnInit(): void {
    console.log('Child ngOnInit');
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('Child ngOnChanges');
    console.log(changes);
  }
  ngDoCheck() {
    console.log('Child ngDoCheck');
    // this.changeDetectorObj.markForCheck();
  }
  ngAfterViewInit() {
    console.log(this.div1);
    this.div1.nativeElement.style.color = 'red';

    this.myAge._results?.forEach((ele: any) => {
      ele.nativeElement.style.border = '3px solid green';
    });
  }
}
