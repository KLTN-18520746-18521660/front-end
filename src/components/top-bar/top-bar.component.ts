import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import User from 'models/user.model';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { TopBarMenuItem } from './menu-item';
import { categoriesMockData } from 'shared/mockData/categoriesMockData';
import Category from 'models/category.model';
import { convertArrayToNested } from 'utils/commonFunction';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router } from '@angular/router';
import { DomHandler } from 'primeng/dom';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  category: Category[] = categoriesMockData;

  items: MenuItem[];

  menuUser?: MenuItem[] = [
    {
      id: 'dashboard',
      label: '',
      icon: 'pi pi-home',
      routerLink: ['/profile']
    },
    {
      id: 'profile',
      label: '',
      icon: 'pi pi-user',
      routerLink: ['/profile/user-info']
    },
    {
      id: 'edit-info',
      label: '',
      icon: 'pi pi-user-edit',
      routerLink: ['/profile/edit-info']
    },
    {
      id: 'setting',
      label: '',
      icon: 'pi pi-cog',
      routerLink: ['/setting']
    },
    {
      id: 'help',
      label: '',
      icon: 'pi pi-question-circle',
      routerLink: ['/help']
    },
    { separator: true },
    {
      id: 'logout',
      label: '',
      icon: 'pi pi-power-off',
      command: () => {
        this.logout();
      }
    }
  ];

  subscription: Subscription;

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
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.activeLink = this.getActiveLink(window.location.pathname);
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeLink = this.getActiveLink(e.url);
      });
    this.items = TopBarMenuItem;

    this.subscription = this.userService.authUpdate$.subscribe(res => {
      this.user = res.user;
      this.session_id = res.session_id;
      this.isLoggedin = res.isAuthenticated;
    });

    this.translate.get('topbar.user').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuUser.map((item, index) => {
        item.label = result[index]
      });
    });
    this.translate.get('dialog.logout').subscribe((res) => {
      this.textTranslation = res;
    });
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

  logout() {
    this.confirmationService.confirm({
      key: 'logout',
      header: this.textTranslation.header,
      message: this.textTranslation.title,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.textTranslation.yes,
      rejectLabel: this.textTranslation.no,
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.authService.logout(this.userService.getSessionId()).subscribe((res) => {
          this.userService.logOut();
          this.router.navigate(['/']);
        });
      }
    });
  }

  onOpenSidebar() {
    this.showSidebar = true;
    DomHandler.addClass(document.body, 'p-overflow-hidden');
  }

  onHideSidebar() {
    DomHandler.removeClass(document.body, 'p-overflow-hidden');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
