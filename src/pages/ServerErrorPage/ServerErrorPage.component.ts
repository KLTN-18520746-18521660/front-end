import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ServerErrorPage',
  templateUrl: './ServerErrorPage.component.html',
  styleUrls: ['./ServerErrorPage.component.scss']
})
export class ServerErrorPageComponent implements OnInit {

  @Input() visible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
