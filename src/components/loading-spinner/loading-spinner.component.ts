import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  @Input() height: string = 'h-8rem';

  @Input() size: number = 60;

  @Input() strokeWidth = 4;

  style: string = '';

  constructor() { }

  ngOnInit() {
  }

  getStyle() {
    return {
      width: this.size + 'px',
      height: this.size + 'px',
    };
  }
}
