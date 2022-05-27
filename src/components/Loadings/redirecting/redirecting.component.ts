import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-redirecting',
  templateUrl: './redirecting.component.html',
  styleUrls: ['./redirecting.component.scss']
})
export class RedirectingComponent implements OnInit {

  options: AnimationOptions = {
    path: '/assets/jsons/plane-loading.json',
  };

  constructor() { }

  ngOnInit() {
  }

}
