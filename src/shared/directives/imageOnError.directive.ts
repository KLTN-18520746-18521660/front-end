import { Directive, ElementRef, HostListener } from '@angular/core';
import { APPCONSTANT } from 'utils/appConstant';

@Directive({
  selector: 'img[imageOnError]'
})
export class ImageOnErrorDirective {
  constructor(private el: ElementRef) { }

  @HostListener("error") onError() {
    this.el.nativeElement.src = APPCONSTANT.PLACEHOLDER_IMAGE;
    this.el.nativeElement.alt = "Image on Error!"
  }
}
