import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nA'
})
export class NAPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      return value;
    }
    return 'N/A';
  }

}
