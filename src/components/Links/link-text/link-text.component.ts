import { Component, Input, OnInit } from '@angular/core';
import { LinkItem } from 'models/app.model';

@Component({
  selector: 'app-link-text',
  templateUrl: './link-text.component.html',
  styleUrls: ['./link-text.component.scss']
})
export class LinkTextComponent implements OnInit {

  @Input() item: LinkItem;

  constructor() { }

  ngOnInit() {
  }

}
