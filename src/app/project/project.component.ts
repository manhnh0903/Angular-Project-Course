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

  /**
   * Checks if 'reverse' should be set to true or false based on the 'index'.
   * If the 'index' is an even number, 'reverse' is set to false; otherwise, it's set to true.
   */
  checkIfReverse() {
    if (this.isEven(this.index)) this.reverse = false;
    else this.reverse = true;
  }

  /**
   * Checks if a given number is even.
   * It returns true if the number 'n' is even (i.e., divisible by 2 with no remainder), and false otherwise.
   *
   * @param {any} n - The number to be checked for evenness.
   * @returns {boolean} - True if 'n' is even, false otherwise.
   */
  isEven(n: any) {
    return n % 2 == 0;
  }

  /**
   * This function signals that the element is in view.
   * It sets the 'scrolledBy' flag to 'true'.
   */
  inVision() {
    this.scrolledBy = true;
  }
}
