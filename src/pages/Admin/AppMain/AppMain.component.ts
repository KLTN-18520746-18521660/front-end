import { ManageConfigService } from 'services/admin/manage-config.service';
import { MessageService } from 'primeng/api';
import { APPCONSTANT, STORAGE_KEY } from 'utils/appConstant';
import { CookieService } from 'services/cookie.service';
import { NavigationEnd, Router } from '@angular/router';
import { AdminService } from 'services/admin.service';
import { Component, AfterViewInit, OnDestroy, Renderer2, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppComponent } from 'app/app.component';
import { AppConfigService } from 'services/app.config.service';
import { AppConfig, ThemeName } from 'models/appconfig.model';
import { filter, fromEvent, map, merge, Subscription } from 'rxjs';
import { UserIdleService } from 'angular-user-idle';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-main',
  templateUrl: './AppMain.component.html',
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  styleUrls: ['./AppMain.component.scss']
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {

  public menuInactiveDesktop: boolean;

  public menuActiveMobile: boolean;

  public overlayMenuActive: boolean;

  public staticMenuInactive: boolean = false;

  public profileActive: boolean;

  public topMenuActive: boolean;

  public topMenuLeaving: boolean;

  public theme: string;

  documentClickListener: () => void;

  menuClick: boolean;

  topMenuButtonClick: boolean;

  configActive: boolean;

  configClick: boolean;

  config: AppConfig;

  configSubscription: Subscription;

  subscription: Subscription;

  idleChangeSubscription: Subscription;

  timeStartSubscription: Subscription;

  timeOutSubscription: Subscription;

  pingSubscription: Subscription;

  ref: DynamicDialogRef;

  isLoggedIn = false;

  isLoading: boolean = false;

  isLoadingConfig: boolean = false;

  isVisible: boolean;
  textTranslate: any;
  previousURL: string;
  currentURL: string;
  isWatching: boolean;

  /** Session is save ??? */
  remember: boolean = false;
  isError: boolean = false;

  constructor(
    public renderer: Renderer2,
    public app: AppComponent,
    public configService: AppConfigService,
    private adminService: AdminService,
    private manageConfig: ManageConfigService,
    private cookieService: CookieService,
    private router: Router,
    private messageService: MessageService,
    private userIdleService: UserIdleService,
    private translate: TranslateService,
  ) {
    this.currentURL = this.router.url;
    const sessionId = this.adminService.getSessionId();
    if (sessionId) {
      console.log("AdminID: ", sessionId);
      this.isLoading = true;
      this.adminService.getAdminInfor().subscribe(
        (res) => {
          this.isLoading = false;
          this.remember = res.data?.session?.saved || false;
          this.adminService.changeAuth(sessionId, res.data.user, true, this.remember,);
          this.isLoggedIn = true;
        },
        (err) => {
          this.adminService.changeAuth(sessionId, null, false, false, false);
          // this.adminService.logOut();
          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
        }
      );
    }
  }

  ngOnInit() {
    // this.changeTheme("lara-light-blue", false);
    // this.changeTheme("tailwind-light", false);
    document.documentElement.style.fontSize = '13px';
    this.userIdleService.setCustomActivityEvents(
      merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'mouseenter'),
        fromEvent(window, 'resize'),
        fromEvent(document, 'click'),
        fromEvent(document, 'scroll'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'touchend')
      )
    );

    this.getPublishConfig();

    this.config = this.configService.config;
    this.configSubscription = this.configService.configUpdate$.subscribe(config => this.config = config);

    this.translate.get('label.session').subscribe(res => {
      this.textTranslate = res;
    })

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {

        // remove ref dialog
        if (this.adminService.ref) {
          this.adminService.ref.forEach(ref => {
            ref.close();
          })
        };

        return this.router.routerState.snapshot
      })
    ).subscribe((event) => {
      this.previousURL = this.currentURL;
      this.currentURL = event.url;
    });
  }

  changeTheme(theme: ThemeName, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
  }

  async getPublishConfig() {
    this.isLoadingConfig = true;
    const { data } = await this.manageConfig.getPublicConfig().toPromise();

    this.isLoadingConfig = false;

    this.adminService.setConfig(data.configs);
    this.userIdleService.setConfigValues({
      idle: data.configs?.SessionAdminUserConfig?.expiry_time * 60 || data.configs?.AdminUserIdle?.idle || APPCONSTANT.USER_IDLE.IDLE,
      timeout: data.configs?.AdminUserIdle?.timeout || APPCONSTANT.USER_IDLE.TIMEOUT,
      ping: data.configs?.AdminUserIdle?.ping || APPCONSTANT.USER_IDLE.PING
    })

    console.log(this.userIdleService.getConfigValue());

    if (this.adminService.isAuthenticated && !this.isWatching && !this.remember) {
      this.onStartWatching();
    }

    // User Idle
    this.subscription = this.adminService.authAdminUpdate$.subscribe(res => {
      this.isError = res.error || false;
      this.remember = res.remember || false;
      if (res.isAuthenticated) {
        if (!this.isWatching && !this.remember)
          this.onStartWatching();
      }
      else {
        this.onStopWatching();
        this.adminService.messages = [{
          severity: 'error',
          summary: 'You have been logged out!',
          detail: '',
        }]
      }
    });

    this.idleChangeSubscription = this.userIdleService.onIdleStatusChanged().subscribe((res) => {
      // isvisible == false when focus page
      this.isVisible = res;
      // console.log("Visible: ", !res)
    })

    // Start watching when user idle is starting.
    this.timeStartSubscription = this.userIdleService.onTimerStart().subscribe(count => {
      this.isVisible = true;
      // console.log("Timer ", count)
    });

    this.timeOutSubscription = this.userIdleService.onTimeout().subscribe(() => {
      console.log("Time out");
      this.updateAuthenciated();
    });
  }

  updateAuthenciated() {
    if (this.cookieService.check(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)) {
      if (this.adminService.isAuthenticated && !this.isVisible) {
        // console.log("Ping has token");
        if (!this.remember) {
          this.extendSession();
        }
      }
      else if (!this.adminService.isAuthenticated) {
        this.adminService.updateAdminAuth(this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN));
      }
    }
    else {
      // console.log("Ping no token")
      if (this.isWatching)
        this.onStopWatching();
      this.adminService.messages = [{
        severity: 'error',
        summary: 'Session Expired',
        detail: '',
      }];
    }
  }

  onStartWatching() {
    this.userIdleService.startWatching();
    this.isWatching = true;
    console.log("Start watching");

    this.pingSubscription = this.userIdleService.ping$.subscribe(() => {
      this.updateAuthenciated();
    });
  }


  onStopWatching() {
    console.log("Stop watching")
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
    if (this.timeOutSubscription) {
      this.timeOutSubscription.unsubscribe();
    }
    if (this.timeStartSubscription) {
      this.timeStartSubscription.unsubscribe();
    }
    if (this.idleChangeSubscription) {
      this.idleChangeSubscription.unsubscribe();
    }
    this.userIdleService.stopWatching();
    this.isWatching = false;
    this.isLoggedIn = false;
    this.router.navigate(['/admin/login']);
  }

  extendSession() {
    this.adminService.extendSessionAdmin().subscribe(
      (res) => {
        console.log("Extend Session Success");
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
      }
    )
  }

  ngAfterViewInit() {
    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
      if (!this.isDesktop()) {
        if (!this.menuClick) {
          this.menuActiveMobile = false;
        }

        if (!this.topMenuButtonClick) {
          this.hideTopMenu();
        }
      }
      else {
        if (!this.menuClick && this.isOverlay()) {
          this.menuInactiveDesktop = true;
        }
        if (!this.menuClick) {
          this.overlayMenuActive = false;
        }
      }

      if (this.configActive && !this.configClick) {
        this.configActive = false;
      }

      this.configClick = false;
      this.menuClick = false;
      this.topMenuButtonClick = false;
    });
  }

  toggleMenu(event: Event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.app.menuMode === 'overlay') {
        if (this.menuActiveMobile === true) {
          this.overlayMenuActive = true;
        }

        this.overlayMenuActive = !this.overlayMenuActive;
        this.menuActiveMobile = false;
      }
      else if (this.app.menuMode === 'static') {
        this.staticMenuInactive = !this.staticMenuInactive;
      }
    }
    else {
      this.menuActiveMobile = !this.menuActiveMobile;
      this.topMenuActive = false;
    }

    event.preventDefault();
  }

  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) {
      this.hideTopMenu();
    } else {
      this.topMenuActive = true;
    }

    event.preventDefault();
  }

  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 1);
  }

  onMenuClick() {
    this.menuClick = true;
  }

  onConfigClick(event) {
    this.configClick = true;
  }

  isStatic() {
    return this.app.menuMode === 'static';
  }

  isOverlay() {
    return this.app.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 992;
  }

  isMobile() {
    return window.innerWidth < 1024;
  }

  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }

    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
    if (this.timeOutSubscription) {
      this.timeOutSubscription.unsubscribe();
    }
    if (this.timeStartSubscription) {
      this.timeStartSubscription.unsubscribe();
    }
    if (this.idleChangeSubscription) {
      this.idleChangeSubscription.unsubscribe();
    }
  }
}
