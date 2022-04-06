import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from 'services/theme.service';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { UserConfigService } from 'services/user-config.service';
import { UserService } from 'services/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class AppComponent {
  menuMode = 'static';

  constructor(
    private primengConfig: PrimeNGConfig,
    private themeService: ThemeService,
    private translate: TranslateService,
    private primeConfig: PrimeNGConfig,
    private title: Title,
    private router: Router,
    private config: UserConfigService,
    private userService: UserService,
    private dialog: DialogService,
    private dialogRef: DynamicDialogRef,
  ) {
    translate.addLangs(['en', 'vi', 'jp']);

    if (this.config.getConfigByKey('language')) {
      const lang = this.config.getConfigByKey('language').match(/vi|en|jp/) ? this.config.getConfigByKey('language') : 'en';
      translate.use(lang);
      this.config.addConfig('language', this.translate.currentLang);
    }
    else {
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/vi|en|jp/) ? browserLang : 'en');
      this.config.addConfig('language', this.translate.currentLang);
    }
  }

  ngOnInit() {
    this.setupTitleListener();
    this.translate.get('primeng').subscribe(res => this.primeConfig.setTranslation(res));
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '13px';
  }

  changeTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }

  private setupTitleListener() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let key;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route?.snapshot?.data) {
            key = route?.snapshot?.data['key'];
          }
          this.userService.addHistory(this.router.routerState.snapshot.url);

          // remove ref dialog
          if (this.userService.ref) {
            this.userService.ref.forEach(ref => {
              ref.close();
            })
          }
          return key;
        })
      )
      .subscribe((key: any) => {
        if (key) {
          // Get title page when router changes
          this.translate.get(`titlePage.${key}`).subscribe((title) =>
            this.title.setTitle(title)
          );
        }
      });
  }
}