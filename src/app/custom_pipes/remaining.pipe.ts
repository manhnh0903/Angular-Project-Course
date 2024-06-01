import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remaining',
})
export class RemainingPipe implements PipeTransform {
  transform(input: string, arg1: number = 100) {
    console.log('remianing pipe called');
    return arg1 - input.length;
  }
}
