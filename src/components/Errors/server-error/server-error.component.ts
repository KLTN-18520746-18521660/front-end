import { Component, Input, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  @Input() visible: boolean = true;

  options: AnimationOptions = {
    path: '/assets/jsons/server-error.json',
  };


  constructor() { }

  ngOnInit() {
  }

}
