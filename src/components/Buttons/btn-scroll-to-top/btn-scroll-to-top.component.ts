import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-scroll-to-top',
  templateUrl: './btn-scroll-to-top.component.html',
  styleUrls: ['./btn-scroll-to-top.component.scss']
})
export class BtnScrollToTopComponent implements OnInit {
  
  windowScrolled: boolean;

  constructor(@Inject(DOCUMENT) private document: Document, private scroll: ViewportScroller) { }

  @HostListener("window:scroll", [])

  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 100) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  ngOnInit() { }

}
