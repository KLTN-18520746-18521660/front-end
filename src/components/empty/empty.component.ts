import { Component, Input, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

  @Input() visible: boolean = true;

  options: AnimationOptions = {
    path: '/assets/jsons/empty-box.json',
  };

  constructor() { }

  ngOnInit() {
  }

}
