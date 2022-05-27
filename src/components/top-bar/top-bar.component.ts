import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Category from 'models/category.model';
import User from 'models/user.model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { categoriesMockData } from 'shared/mockData/categoriesMockData';
import { SearchInputComponent } from '../Input/search-input/search-input.component';
import { TopBarMenuItem } from './menu-item';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  providers: [DialogService]
})
export class TopBarComponent implements OnInit {

  category: Category[] = categoriesMockData;

  items: MenuItem[];
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

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private appUser: AppUserComponent,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
    this.activeLink = this.getActiveLink(window.location.pathname);
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showSidebar = false;
        this.activeLink = this.getActiveLink(e.url);
      });
    this.items = TopBarMenuItem;

    this.user = this.userService.user;
    this.session_id = this.userService.session_id;
    this.isLoggedin = this.userService.isAuthenticated;

    this.subscription = this.userService.authUpdate$.subscribe(res => {
      this.user = res.user;
      this.session_id = res.session_id;
      this.isLoggedin = res.isAuthenticated;
    });

    this.translate.get('topbar.user').subscribe(res => {
      this.menuUser = [
        {
          id: 'dashboard',
          label: res.dashboard,
          icon: 'pi pi-home',
          routerLink: ['/profile']
        },
        {
          id: 'profile',
          label: res.profile,
          icon: 'pi pi-user',
          routerLink: ['/profile/user-info']
        },
        {
          id: 'edit-info',
          label: res.edit,
          icon: 'pi pi-user-edit',
          routerLink: ['/profile/edit-info']
        },
        {
          id: 'setting',
          label: res.setting,
          icon: 'pi pi-cog',
          routerLink: ['/setting']
        },
        {
          id: 'help',
          label: res.help,
          icon: 'pi pi-question-circle',
          routerLink: ['/help']
        },
        { separator: true },
        {
          id: 'logout',
          label: res.logout,
          icon: 'pi pi-power-off',
          command: () => {
            this.onClickLogout();
          }
        }
      ];
    })

    this.translate.get('dialog.logout').subscribe((res) => {
      this.textTranslation = res;
    });

    this.userStatisticSubscription = this.userService.userStatistic$.subscribe(user => {
      this.user = { ...this.user, ...user };
    })
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (window.pageYOffset > 0) {
      this.isScrolling = true;
    }
    else {
      this.isScrolling = false;
    }
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
          clearInterval(this.appUser.interval);
          this.router.navigate(['/']);
        });
      }
    });
  }

  onClickCopy() {
    this.clipboard.copy(decodeURI(window.location.origin + '/user/' + this.user.user_name + `?utm_source=${window.location.hostname}&utm_medium=user`))
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
  }
}
