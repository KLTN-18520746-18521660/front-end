import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SearchInputComponent } from 'components/Input/search-input/search-input.component';
import Category from 'models/category.model';
import Notification from 'models/notification.model';
import User from 'models/user.model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { categoriesMockData } from 'shared/mockData/categoriesMockData';
import { ApiParams } from 'models/api.model';
import { APPCONSTANT, BREAKPOINT } from 'utils/appConstant';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  providers: [DialogService]
})
export class TopBarComponent implements OnInit {

  category: Category[] = categoriesMockData;

  ref: DynamicDialogRef;
  searchSubscription: Subscription;

  menuUser?: MenuItem[];

  subscription: Subscription;

  userStatisticSubscription: Subscription;

  user: User;

  session_id: string;

  isLoggedin: boolean = false;

  activeLink: string = '';

  showSidebar: boolean = false;

  isScrolling: boolean = false;

  textTranslation: any;

  isHoverNotification: boolean = false;

  listNotifications: Notification[];

  isLoadingNotification: boolean = false;

  getListNotificationSubscription: Subscription;

  isShowNotification: boolean = false;

  totalSizeNotification: number = 0;

  delayShowNotification: number = 300;

  sizeNotification: number = APPCONSTANT.DEFAULT_PAGE_SIZE;

  @ViewChild('overlayNofication') overlayNofication: OverlayPanel;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private clipboard: Clipboard,
    private postService: PostsService,
  ) { }

  ngOnInit() {
    this.activeLink = this.getActiveLink(window.location.pathname);
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showSidebar = false;
        this.onHideNotification(null);
        this.activeLink = this.getActiveLink(e.url);
      });

    this.user = this.userService.user;
    this.session_id = this.userService.session_id;
    this.isLoggedin = this.userService.isAuthenticated;
    this.getMenu();

    this.subscription = this.userService.authUpdate$.subscribe(res => {
      this.user = res.user;
      this.session_id = res.session_id;
      this.isLoggedin = res.isAuthenticated;
      this.getMenu();
    });

    this.userStatisticSubscription = this.userService.userStatistic$.subscribe(user => {
      this.user = { ...this.user, ...user };
    })
  }

  getMenu() {
    this.textTranslation = this.translate.instant('dialog.logout');
    this.menuUser = [
      // {
      //   id: 'dashboard',
      //   label: this.translate.instant('topbar.user.dashboard'),
      //   icon: 'pi pi-home',
      //   routerLink: ['/profile']
      // },
      {
        id: 'profile',
        label: this.translate.instant('topbar.user.profile'),
        icon: 'pi pi-user',
        routerLink: ['/profile/user-info']
      },
      {
        id: 'post',
        label: this.translate.instant('topbar.user.post'),
        icon: 'pi pi-book',
        routerLink: ['/profile/manage-post']
      },
      {
        id: 'notification',
        label: this.translate.instant('topbar.user.notification'),
        icon: 'pi pi-bell',
        routerLink: ['/profile/notifications']
      },
      // {
      //   id: 'setting',
      //   label: this.translate.instant('topbar.user.setting'),
      //   icon: 'pi pi-cog',
      //   routerLink: ['/profile/setting']
      // },
      { separator: true },
      {
        id: 'logout',
        label: this.translate.instant('topbar.user.logout'),
        icon: 'pi pi-power-off',
        command: () => {
          this.onClickLogout();
        }
      }
    ];
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (window.pageYOffset > 0) {
      this.isScrolling = true;
    }
    else {
      this.isScrolling = false;
    }
    if (this.isShowNotification) {
      this.onHideNotification(null);
    }
  }

  onShowNotification(event) {
    if (window.innerWidth < BREAKPOINT.lg || this.activeLink === 'notifications') {
      return;
    }
    this.isHoverNotification = true;
    if (this.isShowNotification) {
      this.onHideNotification(null);
      return;
    }
    setTimeout(() => {
      if (this.isHoverNotification) {
        this.overlayNofication.show(event);
        this.isShowNotification = true;
        this.getListNotifications();
      }
    }, this.delayShowNotification);
  }

  onHideNotification(event) {
    if (window.innerWidth < BREAKPOINT.md || this.activeLink === 'notifications') {
      return;
    }
    this.isHoverNotification = false;
    if (this.isShowNotification) {
      this.overlayNofication.hide();
    }
    this.isShowNotification = false;
    if (this.getListNotificationSubscription) {
      this.getListNotificationSubscription.unsubscribe();
    }
  }

  getListNotifications() {
    this.listNotifications = [];
    this.totalSizeNotification = 0;
    this.isLoadingNotification = true;
    if (this.getListNotificationSubscription) {
      this.getListNotificationSubscription.unsubscribe();
    }

    const params: ApiParams = {
      start: 0,
      size: this.sizeNotification,
    };

    this.getListNotificationSubscription = this.postService.getNotification(params).subscribe(
      (res) => {
        this.listNotifications = res.data.notifications;
        this.user.unread_notifications = res.data?.unread_notifications || this.user?.unread_notifications;
        this.totalSizeNotification = res.data.total_size;
        this.isLoadingNotification = false;
      },
      (err) => {
        this.isLoadingNotification = false;
      }
    );
  }

  handleDeleteNotification(notification: Notification) {
    this.listNotifications = this.listNotifications.filter(item => item.id !== notification.id);
  }

  getActiveLink(link: any) {
    let url = link.split('/');
    if (url.length === 2) {
      return url[1];
    }
    else {
      return url[2];
    }
  }

  onClickLogout() {
    this.confirmationService.confirm({
      key: 'logout',
      header: this.textTranslation.header,
      message: this.textTranslation.title,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.textTranslation.yes,
      rejectLabel: this.textTranslation.no,
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.authService.logout().subscribe((res) => {
          this.userService.logOut();
          this.router.navigate(['/']);
        });
      }
    });
  }

  onClickCopy() {
    this.clipboard.copy(decodeURI(window.location.origin + '/user/' + this.user.user_name));
  }

  onClickSeach() {
    this.ref = this.dialogService.open(SearchInputComponent, {
      header: this.translate.instant('topbar.searchTitle'),
      footer: ' ',
      dismissableMask: true,
      styleClass: 'w-12 md:w-9 lg:w-7 xl:w-6'
    });
    this.userService.ref.push(this.ref);
    this.searchSubscription = this.ref.onClose.subscribe(() => {
      this.ref = null;
      this.userService.ref.filter(ref => ref !== this.ref);
    });
  }

  onOpenSidebar() {
    this.showSidebar = true;
    DomHandler.addClass(document.body, 'p-overflow-hidden');
  }

  onClickSidebarMenu() {
    this.showSidebar = false;
    DomHandler.removeClass(document.body, 'p-overflow-hidden');
  }

  onHideSidebar() {
    DomHandler.removeClass(document.body, 'p-overflow-hidden');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.userStatisticSubscription) {
      this.userStatisticSubscription.unsubscribe();
    }
    if (this.getListNotificationSubscription) {
      this.getListNotificationSubscription.unsubscribe();
    }
  }
}
