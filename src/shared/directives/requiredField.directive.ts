import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[requiredField]'
})
export class RequiredFieldDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.el.nativeElement, 'required-field-label');
  }

}
