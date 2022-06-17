import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { convertMarkdown, convertLinkRedirecting } from 'utils/commonFunction';

@Component({
  selector: 'app-render-content',
  templateUrl: './render-content.component.html',
  styleUrls: ['./render-content.component.scss']
})
export class RenderContentComponent implements OnInit {

  @Input() content: string;
  /**
   * @value 'HTML' | 'Markdown'
   */
  @Input() type: string = 'HTML';

  markdownCompile: string = '';

  imgSrc: string = '';

  viewImage: boolean = false;;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {

    if (this.type.toUpperCase() === 'MARKDOWN') {
      this.markdownCompile = convertMarkdown(this.content);
      this.markdownCompile = convertLinkRedirecting(this.markdownCompile);
    }
    else {
      this.content = convertLinkRedirecting(this.content);
    }
  }

  
  ngAfterViewInit() {
    // add event to image in content
    const images = this.elementRef.nativeElement.querySelectorAll('#post-content img');
    images.forEach(image => {
      image.style.cursor = 'pointer';
      image.addEventListener('click', () => {
        this.imgSrc = image.src;
        this.viewImage = true;
      });
    });
  }

  onHideImage() {
    this.imgSrc = '';
    this.viewImage = false;
  }

  ngOnDestroy() {
    //remove listener
    const images = this.elementRef.nativeElement.querySelectorAll('#post-content img');
    images.forEach(image => {
      this.imgSrc = '';
      this.viewImage = false;
      image.removeEventListener('click', () => { });
    });
  }

}
