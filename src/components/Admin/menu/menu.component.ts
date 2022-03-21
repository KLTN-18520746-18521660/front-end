import { Component, OnInit, Input } from '@angular/core';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  model: any[];

  constructor(public appMain: AppMainComponent) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
          }
        ]
      },
      {
        label: 'User Management',
        items: [
          {
            label: 'List Users',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/pages/crud']
          },
          {
            label: 'Verify User',
            icon: 'pi pi-fw pi-plus-circle',
            routerLink: ['pages/landing']
          },
          {
            label: 'Unlock User',
            icon: 'pi pi-fw pi-unlock',
            routerLink: ['/pages/timeline']
          },
          {
            label: 'Role',
            icon: 'pi pi-fw pi-plus-circle',
            routerLink: ['pages/login']
          }
        ]
      },
      {
        label: 'Posts Management',
        items: [
          {
            label: 'List Posts',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/documentation']
          },
          {
            label: 'Create post',
            icon: 'pi pi-fw pi-plus-circle',
            url: ['https://github.com/primefaces/sakai-ng'],
            target: '_blank'
          },
          {
            label: 'Deleted post',
            icon: 'pi pi-fw pi-trash',
          }
        ]
      },
      {
        label: 'Notification',
        items: [
          {
            label: 'List',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/documentation']
          },
          {
            label: 'Create',
            icon: 'pi pi-fw pi-plus-circle',
            url: ['https://github.com/primefaces/sakai-ng'],
            target: '_blank'
          },
          {
            label: 'Deleted',
            icon: 'pi pi-fw pi-trash',
          }
        ]
      },
      {
        label: 'Report',
        items: [
          {
            label: 'Report from user',
            icon: 'pi pi-fw pi-flag',
            routerLink: ['/documentation']
          },
          {
            label: 'User Action',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/documentation']
          },
          {
            label: 'Trending',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/documentation']
          },
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