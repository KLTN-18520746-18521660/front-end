import { Title } from '@angular/platform-browser';
import { UserService } from 'services/user.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'models/appconfig.model';
import { AppConfigService } from 'services/app.config.service';
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

  isShowMenu = false;

  isLoading = false;

  labelHeader: string;

  config: AppConfig;

  configSubscription: Subscription;

  subscription: Subscription;

  userStatisticSubscription: Subscription;

  interval: any;

  @ViewChild('layoutProfile') layoutProfile: ElementRef;

  constructor(
    private translate: TranslateService,
    private configService: AppConfigService,
    private userService: UserService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    // if (!this.userService.getSessionId()) {
    //   this.router.navigate(['/auth/login']);
    // }

    this.labelHeader = this.title.getTitle();
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
        this.labelHeader = this.title.getTitle();
      });

    this.userService.updateUserStatistic();
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
