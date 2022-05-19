import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return null;
  }

}
