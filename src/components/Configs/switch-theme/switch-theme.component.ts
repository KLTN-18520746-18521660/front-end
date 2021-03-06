import { Component, Input, OnInit } from '@angular/core';
import { AppConfig, ThemeName } from 'models/appconfig.model';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'services/app.config.service';
import { UserConfigService } from 'services/user-config.service';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.scss']
})
export class SwitchThemeComponent implements OnInit {

  @Input() type: 'button' | 'switch' = 'button';

  config: AppConfig;

  subscription: Subscription;

  switchModel: boolean;

  dark: boolean;

  constructor(
    public configService: AppConfigService,
    public primengConfig: PrimeNGConfig,
    private userConfig: UserConfigService
  ) { }

  ngOnInit() {
    this.config = this.configService.config;
    this.dark = this.config.dark;
    this.switchModel = this.config.dark;
    this.changeTheme(this.config.theme, this.config.dark);

    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
      this.dark = config.dark;
      this.switchModel = config.dark;
    });
  }

  changeTheme(theme: ThemeName, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    this.userConfig.addConfig('theme', theme);
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
  }

  switchTheme() {
    let theme: ThemeName;
    if (this.dark) {
      theme = 'lara-light-blue';
    }
    else {
      theme = 'lara-dark-blue';
    }

    this.dark = !this.dark;

    let themeElement = document.getElementById('theme-css');
    this.userConfig.addConfig('theme', theme);
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark: this.dark } });
  }

  onChangeSwitchModel() {
    this.switchTheme();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
