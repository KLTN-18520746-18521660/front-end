import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  private configs: any;

  constructor() {
    this.getConfigs();
  }

  getConfigs() {
    this.configs = localStorage.getItem('CONFIGS') ? JSON.parse(localStorage.getItem('CONFIGS')) : {};
    localStorage.setItem('CONFIGS', JSON.stringify(this.configs));
    return this.configs;
  };

  saveConfigs(configs: object) {
    this.configs = configs;
    localStorage.setItem('CONFIGS', JSON.stringify(configs));
  }

  getConfigByKey(key: string) {
    return this.configs[key] || null;
  }

  addConfig(key: any, value: any) {
    this.configs[key] = value;
    localStorage.setItem('CONFIGS', JSON.stringify(this.configs));
  }
}
