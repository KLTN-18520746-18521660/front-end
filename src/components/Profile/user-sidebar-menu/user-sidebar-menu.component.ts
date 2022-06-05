import { UserService } from 'services/user.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import User from 'models/user.model';

@Component({
  selector: 'app-user-sidebar-menu',
  templateUrl: './user-sidebar-menu.component.html',
  styleUrls: ['./user-sidebar-menu.component.scss']
})
export class UserSidebarMenuComponent implements OnInit {

  menu: MenuItem[] = [
    {
      id: 'dashboard',
      label: this.translate.instant('profile.menu.dashboard.title'),
      items: [
        {
          id: 'dashboard',
          label: this.translate.instant('profile.menu.dashboard.items.dashboard'),
          icon: 'pi pi-fw pi-home',
          routerLink: ['/profile/dashboard'],
        }
      ]
    },
    {
      id: 'profile',
      label: this.translate.instant('profile.menu.profile.title'),
      items: [
        {
          id: 'user-info',
          label: this.translate.instant('profile.menu.profile.items.profile'),
          icon: 'pi pi-fw pi-user',
          routerLink: ['/profile/user-info'],
        },
        {
          id: 'edit-info',
          label: this.translate.instant('profile.menu.profile.items.edit'),
          icon: 'pi pi-fw pi-user-edit',
          routerLink: ['/profile/edit-info'],
        },
      ]
    },
    {
      id: 'account',
      label: this.translate.instant('profile.menu.account.title'),
      items: [
        {
          id: 'security',
          label: this.translate.instant('profile.menu.account.items.security'),
          icon: 'pi pi-fw pi-shield',
          routerLink: ['/profile/security'],
        },
        {
          id: 'change-password',
          label: this.translate.instant('profile.menu.account.items.changePassword'),
          icon: 'pi pi-fw pi-key',
          routerLink: ['/profile/change-password'],
        }
      ]
    },
    {
      id: 'post',
      label: this.translate.instant('profile.menu.managePost.title'),
      items: [
        {
          id: 'manage-post',
          label: this.translate.instant('profile.menu.managePost.items.managePost'),
          icon: 'pi pi-list',
          badge: null,
          badgeStyleClass: 'success',
          routerLink: ['/profile/manage-post'],
        },
        {
          id: 'history-activity',
          label: this.translate.instant('profile.menu.managePost.items.savedPost'),
          icon: 'pi pi-bookmark',
          routerLink: ['/profile/history-activity'],
        },
        {
          id: 'following',
          label: this.translate.instant('profile.menu.managePost.items.following'),
          icon: 'pi pi-user-plus',
          badge: null,
          badgeStyleClass: 'warning',
          routerLink: ['/profile/following'],
        },
        {
          id: 'followers',
          label: this.translate.instant('profile.menu.managePost.items.followers'),
          icon: 'pi pi-users',
          badge: null,
          badgeStyleClass: 'warning',
          routerLink: ['/profile/followers'],
        }
      ]
    },
    {
      id: 'notifications',
      label: this.translate.instant('profile.menu.notifications.title'),
      items: [
        {
          id: 'notifications',
          label: this.translate.instant('profile.menu.notifications.items.notifications'),
          icon: 'pi pi-bell',
          badge: null,
          badgeStyleClass: 'primary',
          routerLink: ['/profile/notifications'],
        }
      ]
    },
    {
      id: 'others',
      label: this.translate.instant('profile.menu.others.title'),
      items: [
        {
          id: 'settings',
          label: this.translate.instant('profile.menu.others.items.settings'),
          icon: 'pi pi-cog',
          routerLink: ['/profile/settings'],
        },
        {
          id: 'help',
          label: this.translate.instant('profile.menu.others.items.help'),
          icon: 'pi pi-question',
          routerLink: ['/profile/help'],
        }
      ]
    }
  ];

  userStatisticSubscription: Subscription;

  @Output() clickMenu = new EventEmitter<any>();

  constructor(
    private translate: TranslateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.updateUserStatistic(this.userService.user);
    this.userStatisticSubscription = this.userService.userStatistic$.subscribe(user => {
      this.updateUserStatistic(user);
    })
  }

  updateUserStatistic(user: User) {
    this.menu.find(item => item.id === 'notifications').items[0].badge = `${user.unread_notifications}`;
    this.menu.find(item => item.id === 'post').items[0].badge = `${user.posts}`;
    this.menu.find(item => item.id === 'post').items[2].badge = `${user.following}`;
    this.menu.find(item => item.id === 'post').items[3].badge = `${user.followers}`;
  }

  onClickMenu(item) {
    this.clickMenu.emit(item);
  }

  ngOnDestroy() {
    if (this.userStatisticSubscription) {
      this.userStatisticSubscription.unsubscribe();
    }
  }

}
