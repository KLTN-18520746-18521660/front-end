import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {
  
  breadcrumbItems: MenuItem[];

  home: MenuItem;

  text1: string;

  constructor() { }

  ngOnInit() {
    this.breadcrumbItems = [
      { label: 'Technology', url: 'technology' },
      { label: 'Angular' , url: 'tag/angular' },
      { label: 'Angularrrrrrrrrrrrrrr' }
    ];

    this.home = {icon: 'pi pi-home', routerLink: '/'};
  }

}
