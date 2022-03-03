import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from 'models/appconfig';
import { ConfigService } from 'pages/Admin/service/app.config.service';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class MyAppConfigComponent implements OnInit, OnDestroy {
  config: AppConfig;
  subscription: Subscription;

  constructor(public configService: ConfigService, public primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  changeTheme(theme: string, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
