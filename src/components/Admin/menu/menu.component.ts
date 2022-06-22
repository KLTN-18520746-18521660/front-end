import { Component, OnInit, Input } from '@angular/core';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';

@Component({
  selector: 'admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  model: any[];

  constructor(public appMain: AppMainComponent) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/admin']
          }
        ]
      },
      {
        label: 'Posts Management',
        items: [
          {
            label: 'List Posts',
            icon: 'pi pi-fw pi-list',
            routerLink: ['./manage-post']
          },
          {
            label: 'Statistic Posts',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['./statistic-post']
          },
        ]
      },
      {
        label: 'Category & Tag Management',
        items: [
          {
            label: 'List Category',
            icon: 'pi pi-fw pi-folder',
            routerLink: ['./manage-category']
          },
          {
            label: 'List Tag',
            icon: 'pi pi-fw pi-tags',
            routerLink: ['./manage-tag']
          },
        ]
      },
      {
        label: 'User Management',
        items: [
          {
            label: 'List Users',
            icon: 'pi pi-fw pi-list',
            routerLink: ['./manage-user']
          },
          // {
          //   label: 'Verify User',
          //   icon: 'pi pi-fw pi-plus-circle',
          //   routerLink: ['./verify-user']
          // },
          // {
          //   label: 'Unlock User',
          //   icon: 'pi pi-fw pi-unlock',
          //   routerLink: ['./unlock-user']
          // },
        ]
      },
      {
        label: 'Admin Management',
        items: [
          {
            label: 'List Admin',
            icon: 'pi pi-fw pi-list',
            routerLink: ['./manage-admin']
          }
        ]
      },
      {
        label: 'Role & Right Management',
        items: [
          {
            label: 'Role Admin',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['./role-admin']
          },
          {
            label: 'Right Admin',
            icon: 'pi pi-fw pi-bolt',
            routerLink: ['./right-admin']
          },
          {
            label: 'Role User',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['./role-user']
          },
          {
            label: 'Right User',
            icon: 'pi pi-fw pi-bolt',
            routerLink: ['./right-user']
          }
        ]
      },
      {
        label: 'Config',
        items: [
          {
            label: 'Manage Config',
            icon: 'pi pi-fw pi-list',
            routerLink: ['./manage-config']
          },
        ]
      },
      // {
      //   label: 'Report',
      //   items: [
      //     {
      //       label: 'Report from user',
      //       icon: 'pi pi-fw pi-flag',
      //       routerLink: ['./documentation']
      //     }
      //   ]
      // },
      {
        label: 'Acount',
        items: [
          {
            label: 'Change Password',
            icon: 'pi pi-fw pi-lock-open',
            routerLink: ['./change-password']
          },
          {
            label: 'Security account',
            icon: 'pi pi-fw pi-lock',
            routerLink: ['./security-account']
          }
        ]
      },
      {
        label: 'File',
        items: [
          {
            label: 'Upload Image',
            icon: 'pi pi-fw pi-cloud-upload',
            routerLink: ['./manage-file']
          }
        ]
      }
    ];
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = (<HTMLDivElement>event.target);
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }
}