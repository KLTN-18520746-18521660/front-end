import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-btn-menu',
  templateUrl: './btn-menu.component.html',
  styleUrls: ['./btn-menu.component.scss']
})
export class BtnMenuComponent implements OnInit {
  @Input() items: MenuItem[] = [
    {
      label: 'Save',
      icon: 'pi pi-bookmark-fill',
      command: (event) => {
        console.log(event);
      }
    }
  ]

  @Input() icon = 'pi pi-cog';

  @ViewChild('menu', { static: false }) menu: Menu;

  constructor() { }

  ngOnInit() {
  }

  onClickMenu(event) {
    this.menu.toggle(event);
  }
}
