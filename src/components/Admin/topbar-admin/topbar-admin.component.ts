import { AdminService } from 'services/admin.service';
import { Subscription } from 'rxjs';
import { AppMainComponent } from 'pages/Admin/AppMain/AppMain.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem, ConfirmationService } from 'primeng/api';
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
    private adminService: AdminService,
    private confirmationService: ConfirmationService
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
    this.confirmationService.confirm({
      key: 'logout',
      header: "Log out?",
      message: "Do you sure to log out?",
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Yes, log out",
      rejectLabel: "No, cancel",
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.adminService.logout().subscribe(res => {
          this.adminService.logOut();
          this.adminService.messages = [];
        })
      }
    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}