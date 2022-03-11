import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from 'services/theme.service';
import { Title } from "@angular/platform-browser";
import { ActivatedRouteSnapshot, ResolveEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { UserConfigService } from 'services/user-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuMode = 'static';

  constructor(
    private primengConfig: PrimeNGConfig,
    private themeService: ThemeService,
    private translate: TranslateService,
    private title: Title,
    private router: Router,
    private config: UserConfigService
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
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
  }

  changeTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }

  private setupTitleListener() {
    this.router.events
      .pipe(filter(e => e instanceof ResolveEnd))
      .subscribe((e: any) => {
        const { data } = getDeepestChildSnapshot(e.state.root);
        if (data?.['key']) {
          // Get title page when router changes
          const keyTranslate = "titlePage." + data['key'];
          this.translate.get(keyTranslate).subscribe((title) =>
            this.title.setTitle(title)
          );
        }
      });
  }
}

function getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
  let deepestChild = snapshot.firstChild;
  while (deepestChild?.firstChild) {
    deepestChild = deepestChild.firstChild
  };
  return deepestChild || snapshot
}