import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capital'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value[0].toUpperCase() + value.slice(1);
  }

}
