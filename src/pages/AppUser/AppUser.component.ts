import { Component, OnInit } from '@angular/core';
import { UserConfigService } from 'services/user-config.service';

@Component({
  selector: 'app-AppUser',
  templateUrl: './AppUser.component.html',
  styleUrls: ['./AppUser.component.scss'],
})
export class AppUserComponent implements OnInit {
  constructor(private userConfigService: UserConfigService) {
    this.userConfigService.getConfigs();
  }

  ngOnInit() {
  }

}
