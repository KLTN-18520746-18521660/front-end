import { UserService } from 'services/user.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'models/appconfig.model';
import { ConfigService } from 'services/app.config.service';
import { MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { BREAKPOINT } from 'utils/appConstant';
import User from 'models/user.model';

@Component({
  selector: 'app-ProfilePage',
  templateUrl: './ProfilePage.component.html',
  styleUrls: ['./ProfilePage.component.scss']
})
export class ProfilePageComponent implements OnInit {

  menu: MenuItem[] = [
    {
      id: 'dashboard',
      label: this.translate.instant('profile.menu.dashboard.title'),
      items: [
        {
          id: 'dashboard',
          label: this.translate.instant('profile.menu.dashboard.items.dashboard'),
          icon: 'pi pi-fw pi-home',
          routerLink: ['./dashboard'],
        }
      ]
    },
    {
      id: 'account',
      label: this.translate.instant('profile.menu.account.title'),
      items: [
        {
          id: 'user-info',
          label: this.translate.instant('profile.menu.account.items.profile'),
          icon: 'pi pi-fw pi-user',
          routerLink: ['./user-info'],
        },
        {
          id: 'edit-info',
          label: this.translate.instant('profile.menu.account.items.edit'),
          icon: 'pi pi-fw pi-user-edit',
          routerLink: ['./edit-info'],
        },
        {
          id: 'change-password',
          label: this.translate.instant('profile.menu.account.items.changePassword'),
          icon: 'pi pi-fw pi-key',
          routerLink: ['./change-password'],
        },
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
          routerLink: ['./manage-post'],
        },
        {
          id: 'saved-post',
          label: this.translate.instant('profile.menu.managePost.items.savedPost'),
          icon: 'pi pi-bookmark',
          routerLink: ['./saved-post'],
        },
        {
          id: 'following',
          label: this.translate.instant('profile.menu.managePost.items.following'),
          icon: 'pi pi-user-plus',
          badge: null,
          badgeStyleClass: 'warning',
          routerLink: ['./following'],
        },
        {
          id: 'followers',
          label: this.translate.instant('profile.menu.managePost.items.followers'),
          icon: 'pi pi-users',
          badge: null,
          badgeStyleClass: 'warning',
          routerLink: ['./followers'],
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
          badgeStyleClass: 'danger',
          routerLink: ['./notifications'],
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
          routerLink: ['./settings'],
        },
        {
          id: 'help',
          label: this.translate.instant('profile.menu.others.items.help'),
          icon: 'pi pi-question',
          routerLink: ['./help'],
        }
      ]
    }
  ];

  isShowMenu = false;

  isLoading = false;

  activeLink: string;

  labelHeader: string;

  config: AppConfig;

  configSubscription: Subscription;

  subscription: Subscription;

  userStatisticSubscription: Subscription;

  interval: any;

  @ViewChild('layoutProfile') layoutProfile: ElementRef;

  constructor(
    private translate: TranslateService,
    private configService: ConfigService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    // if (!this.userService.getSessionId()) {
    //   this.router.navigate(['/auth/login']);
    // }

    this.activeLink = window.location.pathname.split('/')[2] || '';
    this.labelHeader = this.findItemById(this.menu, this.activeLink)?.label || '';
    this.config = this.configService.config;
    this.configSubscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    if (window.innerWidth > BREAKPOINT.lg) {
      this.isShowMenu = true;
    }
    else {
      this.isShowMenu = false;
    }

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeLink = e.url.split('/')[2] || '';
        this.labelHeader = this.findItemById(this.menu, this.activeLink)?.label || '';
      });

    this.userService.updateUserStatistic();

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

  // Find MenuItem (only find child) by Id
  findItemById(arr, id) {
    for (const cm of arr) {
      const result = cm.items.find(o => o.id === id)
      if (result) {
        return result
      }
    }
  }

  @HostListener("document:click")
  clickedOut() {
    this.onClickOutSide(event);
  }

  onClickShowMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  onClickMenu(item) {
    if (window.innerWidth < BREAKPOINT.lg) {
      this.isShowMenu = false;
    }
  }

  onKeydown(event: KeyboardEvent) {
    // Press ESC to close the menu
    if (event.code === 'Escape') {
      this.isShowMenu = false;
      event.preventDefault();
    }
    // Press S to toggle the menu
    if (event.code === 'KeyS') {
      this.isShowMenu = !this.isShowMenu;
      event.preventDefault();
    }
  }

  onClickOutSide(event) {
    if (this.layoutProfile.nativeElement.contains(event.target) && window.innerWidth < BREAKPOINT.lg) {
      this.isShowMenu = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    clearInterval(this.interval);

    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }

    if (this.userStatisticSubscription) {
      this.userStatisticSubscription.unsubscribe();
    }
  }
}
