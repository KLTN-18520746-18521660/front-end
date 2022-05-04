import { AdminService } from 'services/admin.service';
import { Subscription } from 'rxjs';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Admin } from 'models/admin.model';

@Component({
  selector: 'app-topbar-admin',
  templateUrl: './topbar-admin.component.html',
  styleUrls: ['./topbar-admin.component.scss'],
})
export class TopbarAdminComponent implements OnInit {

  admin: Admin;

  session_id: string;

  items: MenuItem[];

  isLoggedin: boolean = false;

  subscription: Subscription

  constructor(
    public appMain: AppMainComponent,
    private adminService: AdminService
  ) { }

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
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.onClickLogout();
        }
      }
    ];

    this.isLoggedin = this.adminService.isAuthenticated;

    this.admin = this.adminService.admin;

    this.session_id = this.adminService.session_id;

    this.subscription = this.adminService.authAdminUpdate$.subscribe(res => {
      this.admin = res.user;
      this.session_id = res.session_id;
      this.isLoggedin = res.isAuthenticated;
    });
  }

  onClickLogout() {
    this.adminService.logout(this.session_id).subscribe(res => {
      this.adminService.admin = null;
      this.adminService.session_id = null;
      this.adminService.isAuthenticated = false;
      this.adminService.authAdminUpdate.next({
        user: null,
        session_id: null,
        isAuthenticated: false
      });
      this.adminService.logOut();
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}