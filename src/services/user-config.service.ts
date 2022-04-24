import { Injectable } from '@angular/core';
import { localStorageFunctions } from 'utils/commonFunction';
@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  private configs: any;

  constructor() {
    this.getConfigs();
  }

  getConfigs() {
    this.configs = localStorageFunctions.getConfigs();
    localStorage.setItem('CONFIGS', JSON.stringify(this.configs));
    return this.configs;
  };

  saveConfigs(configs: object) {
    this.configs = configs;
    localStorage.setItem('CONFIGS', JSON.stringify(configs));
  }

  getConfigByKey(key: string) {
    return localStorageFunctions.getConfigByKey(key);
  }

  addConfig(key: any, value: any) {
    this.configs[key] = value;
    localStorageFunctions.addConfig(key, value);
  }
}
