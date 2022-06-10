import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-NoAccessPage',
  templateUrl: './NoAccessPage.component.html',
  styleUrls: ['./NoAccessPage.component.scss']
})
export class NoAccessPageComponent implements OnInit {

  @Input() visible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
