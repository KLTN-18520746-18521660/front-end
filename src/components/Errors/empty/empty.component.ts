import { Component, Input, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

  @Input() visible: boolean = true;

  @Input() title: string;

  @Input() showTitle: boolean = true;

  @Input() subTitle: string;

  @Input() showSubTitle: boolean = false;

  options: AnimationOptions = {
    path: '/assets/jsons/empty-box.json',
  };

  constructor() { }

  ngOnInit() {
  }

}
