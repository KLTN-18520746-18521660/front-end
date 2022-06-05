import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { DomHandler } from 'primeng/dom';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnChanges {

  @Input() type: '2square' | 'planet' | '4square' = '4square';

  @Input() loading: boolean = false;

  @Input() text: string = 'Loading...';

  options: AnimationOptions = {
    path: '/assets/jsons/loading-4-square.json',
  };

  constructor() { }

  ngOnChanges() {
    if (this.loading) {
      DomHandler.addClass(document.body, 'p-overflow-hidden');
    }
    else {
      DomHandler.removeClass(document.body, 'p-overflow-hidden');
    }
  }

}
