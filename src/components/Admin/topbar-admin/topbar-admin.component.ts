import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar-admin',
  templateUrl: './topbar-admin.component.html',
  styleUrls: ['./topbar-admin.component.scss'],
})
export class TopbarAdminComponent implements OnInit {

  items: MenuItem[];

  constructor(public appMain: AppMainComponent) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user'
      },
      {
        label: 'Setting',
        icon: 'pi pi-fw pi-cog'
      },
      {
        label: 'Account',
        icon: 'pi pi-fw pi-lock'
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out'
      }
    ];
  }

}