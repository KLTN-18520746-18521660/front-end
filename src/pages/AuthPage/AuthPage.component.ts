import { Subscription } from 'rxjs';
import { AppConfigService } from 'services/app.config.service';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'models/appconfig.model';

@Component({
  selector: 'app-AuthPage',
  templateUrl: './AuthPage.component.html',
  styleUrls: ['./AuthPage.component.scss']
})
export class AuthPageComponent implements OnInit {
  
  config: AppConfig;

  subscription: Subscription;

  constructor(
    private appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    this.config = this.appConfigService.getConfig();
    this.subscription = this.appConfigService.configUpdate$.subscribe(
      (config: AppConfig) => {
        this.config = config;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
