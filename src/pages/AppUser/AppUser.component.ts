import { PublicConfig } from 'models/appconfig.model';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserIdleService } from 'angular-user-idle';
import { ReportPopupComponent } from 'components/Popups/report-popup/report-popup.component';
import { ReportSendModel } from 'models/report.model';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, fromEvent, map, merge, Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { CookieService } from 'services/cookie.service';
import { UserConfigService } from 'services/user-config.service';
import { UserService } from 'services/user.service';
import { APPCONSTANT, STORAGE_KEY } from 'utils/appConstant';
import { Message } from 'primeng/api/message';

@Component({
  selector: 'app-AppUser',
  templateUrl: './AppUser.component.html',
  styleUrls: ['./AppUser.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class AppUserComponent implements OnInit {

  isLoading: boolean = false;

  isLoadingConfig: boolean = false;

  isError: boolean = false;

  authSubscription: Subscription;

  subscription: Subscription;

  pingSubscription: Subscription;

  timeOutSubscription: Subscription;

  timeStartSubscription: Subscription;

  idleChangeSubscription: Subscription;

  isVisible: boolean = false;

  popupSubscription: Subscription;

  popupReportSubscription: Subscription;

  currentURL: string;

  previousURL: string;

  ref: DynamicDialogRef;

  refReport: DynamicDialogRef;

  publicAPIConfig: PublicConfig;

  timeOutSession: number;

  textTranslate: any;
  isWatching: boolean;
  lastExtend: Date;

  /** Session is save ??? */
  remember: boolean = false;

  constructor(
    private userConfigService: UserConfigService,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService,
    private userIdleService: UserIdleService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private translate: TranslateService
  ) {
    this.userConfigService.getConfigs();
    this.currentURL = this.router.url;
  }

  ngOnInit() {
    if (this.userService.getSessionId()) {
      this.isLoading = true;
    }
    else {
      this.isLoading = false;
    }

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

    this.translate.get('label.session').subscribe(res => {
      this.textTranslate = res;
    })

    this.userService.addHistory(window.location.pathname);

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        this.userService.addHistory(this.router.routerState.snapshot.url);

        // remove ref dialog
        if (this.userService.ref) {
          this.userService.ref.forEach(ref => {
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

  async getPublishConfig() {
    this.isLoadingConfig = true;
    const { data } = await this.authService.getPublicConfig().toPromise();

    this.isLoadingConfig = false;

    this.authService.setConfig(data.configs);
    this.userService.config = data.configs;
    this.userIdleService.setConfigValues({
      idle: data.configs?.SessionSocialUserConfig?.expiry_time * 60 || data.configs?.SocialUserIdle?.idle || APPCONSTANT.USER_IDLE.IDLE,
      timeout: data.configs?.SocialUserIdle?.timeout || APPCONSTANT.USER_IDLE.TIMEOUT,
      ping: data.configs?.SocialUserIdle?.ping || APPCONSTANT.USER_IDLE.PING
    });

    // console.log(this.userIdleService.getConfigValue());

    if (this.userService.isAuthenticated && !this.isWatching) {
      this.isLoading = false;
      this.onStartWatching();
    }

    // User Idle
    this.subscription = this.userService.authUpdate$.subscribe(res => {
      this.isLoading = false;
      this.isError = res.error || false;
      this.remember = res.remember || false;

      if (res.isAuthenticated) {
        if (!this.isWatching) {
          this.onStartWatching();
        }
      }
      else {
        this.onStopWatching();
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
    });

    this.timeOutSubscription = this.userIdleService.onTimeout().subscribe(() => {
      // console.log("Time out");
      this.addMessage({
        key: 'app-message',
        severity: 'warn',
        summary: this.translate.instant('message.needRefresh'),
        sticky: true
      })
      this.onStopWatching();
      // window.location.reload();
    });
  }

  onStartWatching() {
    this.userIdleService.startWatching();
    this.isWatching = true;
    // console.log("Start watching");

    this.pingSubscription = this.userIdleService.ping$.subscribe(() => {
      this.updateAuthenciated();
    });
  }

  updateAuthenciated() {
    if (this.cookieService.check(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
      if (this.userService.isAuthenticated && !this.isVisible) {
        if (!this.remember) {
          // console.log("Extend token");
          this.extendSession();
        }
        // console.log("Get Statistic");
        this.userService.updateUserStatistic();
      }
      else if (!this.userService.isAuthenticated) {
        this.userService.updateAuth(this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN));
      }
    }
    else {
      // console.log("Ping no token")
      if (this.userService.alreadyLogin) {
        this.userService.updateAuth(null);
        this.openLoginPopup(this.textTranslate.expired.message);
      }
      else {
        this.userService.updateAuth(null);
      }
      this.onStopWatching();
    }
  }

  onStopWatching() {
    // console.log("Stop watching")
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
  }

  extendSession() {
    this.authService.extendSessionUser().subscribe(
      () => {
        // console.log("Extend Session Success");
        this.lastExtend = new Date();
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: err.error, detail: this.translate.instant(`messageCode.${err.message_code}`) });
      }
    )
  }

  public addMessage(message: Message) {
    this.messageService.add(message);
  }

  public openLoginPopup(message = ' ', type = 'error', header = ' ', footer = ' ') {
    if (message.trim()) {
      this.userService.messages = [{
        severity: type,
        detail: '',
        summary: message,
      }];
    }
    else {
      this.userService.messages = [{
        severity: 'warn',
        detail: '',
        summary: this.translate.instant('message.needlogin'),
      }];
    }
    this.ref = this.dialogService.open(LoginPageComponent, {
      header,
      footer,
      dismissableMask: true,
      styleClass: 'login-popup w-12 md:w-6 lg:w-5 xl:w-4'
    });
    this.userService.ref.push(this.ref);
    this.popupSubscription = this.ref.onClose.subscribe(() => {
      this.ref = null;
      this.userService.ref.filter(ref => ref !== this.ref);
    });
  }

  public openReportPopup(data: ReportSendModel = {}, header = ' ', footer = ' ') {
    if (!this.authService.getSessionId()) {
      this.openLoginPopup( ' ', 'warn', ' ', ' ');
      return;
    }
    this.refReport = this.dialogService.open(ReportPopupComponent, {
      data,
      header,
      footer: null,
      dismissableMask: false,
      closeOnEscape: false,
      closable: false,
      styleClass: 'report-popup w-12 md:w-6 lg:w-5 xl:w-5'
    });
    this.userService.ref.push(this.refReport);
    this.popupReportSubscription = this.refReport.onClose.subscribe(() => {
      this.refReport = null;
      this.userService.ref.filter(ref => ref !== this.refReport);
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
    if (this.popupReportSubscription) {
      this.popupReportSubscription.unsubscribe();
    }
    if (this.ref) {
      this.ref.close();
    }
    if (this.refReport) {
      this.refReport.close();
    }
    this.userIdleService.stopWatching();
  }

}
