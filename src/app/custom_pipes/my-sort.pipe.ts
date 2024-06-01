import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mySort',
  pure: false, //impure pipe
})
export class MySortPipe implements PipeTransform {
  transform(arr: any) {
    console.log('sort pipe');
    return arr.sort((ele1: number, ele2: number) => ele1 - ele2);
  }
}
