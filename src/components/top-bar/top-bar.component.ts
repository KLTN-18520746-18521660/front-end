import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TopBarMenuItem } from './menu-item';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = TopBarMenuItem;
  }

}
