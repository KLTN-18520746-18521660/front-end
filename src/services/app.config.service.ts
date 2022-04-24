import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from 'models/appconfig';
import { THEMES } from 'utils/themeConstant';
import { UserConfigService } from 'services/user-config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: AppConfig;

  private configUpdate = new Subject<AppConfig>();

  constructor() {
    let temp = localStorage.getItem('CONFIGS') ? JSON.parse(localStorage.getItem('CONFIGS')) : {};
    const themName = temp['theme'] || THEMES[0];

    this.config = THEMES.filter((item) => item.theme === themName)[0] || THEMES[0];
  }

  configUpdate$ = this.configUpdate.asObservable();

  updateConfig(config: AppConfig) {
    this.config = config;
    this.configUpdate.next(config);
  }

  getConfig() {
    return this.config;
  }
}