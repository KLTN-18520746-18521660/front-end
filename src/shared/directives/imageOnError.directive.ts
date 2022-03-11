import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppConstant } from 'utils/appConstant';

@Directive({
  selector: 'img[imageOnError]'
})
export class ImageOnErrorDirective {
  constructor(private el: ElementRef) { }

  @HostListener("error") onError() {
    this.el.nativeElement.src = AppConstant.PLACEHOLDER_IMAGE;
  }
}
