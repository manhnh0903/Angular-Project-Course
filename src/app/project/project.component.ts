import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() headline!: string;
  @Input() technologies!: string;
  @Input() description!: string;
  @Input() projectLink!: string;
  @Input() githubLink!: string;
  @Input() img!: string;
  @Input() index!: Number;

  reverse: boolean = false;
  scrolledBy: boolean = false;

  ngOnInit() {
    this.checkIfReverse();
  }

  checkIfReverse() {
    if (this.isEven(this.index)) this.reverse = false;
    else this.reverse = true;
  }

  isEven(n: any) {
    return n % 2 == 0;
  }

  inVision() {
    this.scrolledBy = true;
  }
}
