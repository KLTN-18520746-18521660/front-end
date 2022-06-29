import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { convertLinkRedirecting, convertMarkdown } from 'utils/commonFunction';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ImageGallery {
  previewImageSrc?: string;
  thumbnailImageSrc?: string;
  alt?: string;
  title?: string;
};

@Component({
  selector: 'app-render-content',
  templateUrl: './render-content.component.html',
  styleUrls: ['./render-content.component.scss']
})
export class RenderContentComponent implements OnInit {

  @Input() content: string | SafeHtml;
  /**
   * @value 'HTML' | 'Markdown'
   */
  @Input() type: string = 'HTML';

  @Input() viewImage: boolean = false;

  @Output() onClickImage = new EventEmitter<any>();

  imgSrc: string = '';

  markdownCompile: string = '';

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    if (this.type.toUpperCase() === 'MARKDOWN') {
      this.markdownCompile = convertMarkdown(this.content as string);
      this.markdownCompile = convertLinkRedirecting(this.markdownCompile);
    }
    else {
      this.content = convertLinkRedirecting(this.content as string);
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.content as string);
    }
  }

  onHideImage() {
    this.viewImage = false;
    this.onClickImage.emit(false);
  }

  ngAfterViewInit() {
    // add event to image in content
    const images = this.elementRef.nativeElement.querySelectorAll('#post-content img');
    images.forEach(image => {
      image.style.cursor = 'pointer';
      image.addEventListener('click', () => {
        this.imgSrc = image.src;
        this.viewImage = true;
        this.onClickImage.emit(true);
      });
    });
  }

  ngOnDestroy() {
    //remove listener
    const images = this.elementRef.nativeElement.querySelectorAll('#post-content img');
    images.forEach(image => {
      image.removeEventListener('click', () => { });
    });
  }

}
