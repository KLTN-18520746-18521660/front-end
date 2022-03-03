import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'pages/Admin/service/app.config.service';
import { AppConfig } from 'models/appconfig';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.scss']
})
export class LoginPageComponent implements OnInit {

  valCheck: string[] = ['remember'];

  password: string;

  config: AppConfig;

  subscription: Subscription;

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
