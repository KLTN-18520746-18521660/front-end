import { ThemeName } from './../../../models/appconfig.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from 'models/appconfig.model';
import { AppConfigService } from 'services/app.config.service';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserConfigService } from 'services/user-config.service';
import { THEMES } from 'utils/themeConstant';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class MyAppConfigComponent implements OnInit, OnDestroy {
  config: AppConfig;
  subscription: Subscription;

  constructor(
    public configService: AppConfigService,
    public primengConfig: PrimeNGConfig,
    private userConfig: UserConfigService
  ) { }

  ngOnInit() {
    this.config = this.configService.config;
    this.changeTheme(this.config.theme, this.config.dark);

    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  changeTheme(theme: ThemeName, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    this.userConfig.addConfig('theme', theme);
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
