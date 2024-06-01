import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  transform(input: number): unknown {
    console.log('ordinal pipe...')
    switch (input % 10) {
      case 1:
        return input + 'st';
      case 2:
        return input + 'nd';
      case 3:
        return input + 'rd';
      default:
        return input + 'th';
    }
  }
}
