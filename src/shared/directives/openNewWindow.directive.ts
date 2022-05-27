import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[internalLink]'
})
export class OpenNewWindowDirective {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.target = '_blank';
    this.el.nativeElement.title = 'Open in new window';
  }

}
