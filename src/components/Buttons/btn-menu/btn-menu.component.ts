import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-btn-menu',
  templateUrl: './btn-menu.component.html',
  styleUrls: ['./btn-menu.component.scss']
})
export class BtnMenuComponent implements OnInit {
  @Input() items: MenuItem[] = [];

  @Input() icon = 'pi pi-cog';

  @Input() menuClass = '';

  @Input() btnClass = 'p-button-rounded p-button-primary p-button-text';

  @ViewChild('menu') menu: Menu;

  @Input() appendTo: any;

  @ViewChild('container') containerViewChild: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onClickMenu(event) {
    this.menu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.appendTo == null });
  }
}
