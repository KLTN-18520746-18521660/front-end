import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomHandler } from 'primeng/dom';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnChanges {
  @Input() loading: boolean = false;

  @Input() text: string = 'Loading...';

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
