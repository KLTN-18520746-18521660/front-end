import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from 'services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'heovi';
  menuMode = 'static';

  constructor(
    private primengConfig: PrimeNGConfig,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'vi', 'zh']);
    translate.setDefaultLang('en');
    this.translate.use('en');

  //   if (JSON.parse(localStorage.getItem('config'))?.language) {
  //     translate.use(JSON.parse(localStorage.getItem('config')).language);
  //   }
  //   else {
  //     const browserLang = this.translate.getBrowserLang();
  //     this.translate.use(browserLang.match(/vi|en/) ? browserLang : 'vi');
  //     this.translate.use('vi');

  //     const config = JSON.parse(localStorage.getItem('config')) || {};
  //     config.language = this.translate.currentLang;
  //     localStorage.setItem('config', JSON.stringify(config));
  //   }
  // 
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
  }

  changeTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }
}
