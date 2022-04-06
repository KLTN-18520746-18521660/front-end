import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'models/appconfig';
import { ConfigService } from 'pages/Admin/service/app.config.service';
import { MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { BREAKPOINT } from 'utils/appConstant';

@Component({
  selector: 'app-ProfilePage',
  templateUrl: './ProfilePage.component.html',
  styleUrls: ['./ProfilePage.component.scss']
})
export class ProfilePageComponent implements OnInit {

  menu: MenuItem[] = [
    {
      id: 'dashboard',
      label: '',
      items: [
        {
          id: '',
          label: '',
          icon: 'pi pi-fw pi-home',
          routerLink: ['./'],
        }
      ]
    },
    {
      id: 'account',
      label: '',
      items: [
        {
          id: 'user-info',
          label: '',
          icon: 'pi pi-fw pi-user',
          routerLink: ['./user-info'],
        },
        {
          id: 'edit-info',
          label: '',
          icon: 'pi pi-fw pi-user-edit',
          routerLink: ['./edit-info'],
        },
        {
          id: 'change-password',
          label: '',
          icon: 'pi pi-fw pi-key',
          routerLink: ['./change-password'],
        },
      ]
    },
    {
      id: 'post',
      label: '',
      items: [
        {
          id: 'manage-post',
          label: '',
          icon: 'pi pi-list',
          routerLink: ['./manage-post'],
        },
        {
          id: 'save-post',
          label: '',
          icon: 'pi pi-bookmark',
          routerLink: ['./save-post'],
        },
        {
          id: 'following',
          label: '',
          icon: 'pi pi-user-plus',
          routerLink: ['./following'],
        },
        {
          id: 'followers',
          label: '',
          icon: 'pi pi-users',
          routerLink: ['./followers'],
        }
      ]
    },
    {
      id: 'notifications',
      label: '',
      items: [
        {
          id: 'notifications',
          label: '',
          icon: 'pi pi-bell',
          routerLink: ['./notifications'],
        }
      ]
    },
    {
      id: 'others',
      label: '',
      items: [
        {
          id: 'settings',
          label: '',
          icon: 'pi pi-cog',
          routerLink: ['./settings'],
        },
        {
          id: 'help',
          label: '',
          icon: 'pi pi-question',
          routerLink: ['./help'],
        }
      ]
    }
  ];

  isShowMenu = false;

  activeLink: string;

  labelHeader: string;

  config: AppConfig;

  subscription: Subscription;

  @ViewChild('layoutProfile') layoutProfile: ElementRef;

  constructor(
    private translate: TranslateService,
    private configService: ConfigService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activeLink = window.location.pathname.split('/')[2] || '';
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    if (window.innerWidth > BREAKPOINT.lg) {
      this.isShowMenu = true;
    }
    else {
      this.isShowMenu = false;
    }

    this.translate.get('profile.menu').subscribe((res) => {
      let result = Object.values(res) as any;
      this.menu.map((item, index) => {
        item.label = result[index].title;
        if (result[index].items) {
          let temp = Object.values(result[index].items) as any[];
          item?.items.map((subItem, subIndex) => {
            subItem.label = temp[subIndex];
          });
        }
      });

      this.labelHeader = this.findItemById(this.menu, this.activeLink)?.label || '';
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeLink = e.url.split('/')[2] || '';
        this.labelHeader = this.findItemById(this.menu, this.activeLink)?.label || '';
      });
  }

  // Find MenuItem (only find child) by Id
  findItemById(arr, id) {
    for (const cm of arr) {
      const result = cm.items.find(o => o.id === id)
      if (result)
        return result
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
  }
}
