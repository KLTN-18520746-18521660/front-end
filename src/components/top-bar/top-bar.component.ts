import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import User from 'models/user.model';
import { MenuItem } from 'primeng/api';
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
      id: 'profile',
      label: '',
      icon: 'pi pi-user',
      routerLink: ['/profile']
    },
    {
      id: 'edit',
      label: '',
      icon: 'pi pi-user-edit',
      routerLink: ['/profile/edit']
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
        this.authService.logout(this.userService.getSessionId()).subscribe((res) => {
          this.userService.logOut();
        });
      }
    }
  ];

  subscription: Subscription;

  user: User;

  session_id: string;

  isLoggedin: boolean = false;

  activeLink: string = '';

  showSidebar: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
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
      this.user = res.data.user;
      this.session_id = res.data.session_id;
      this.isLoggedin = res.isAuthenticated;
    });

    this.translate.get('topbar.user').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuUser.map((item, index) => {
        item.label = result[index]
      });
    });
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
