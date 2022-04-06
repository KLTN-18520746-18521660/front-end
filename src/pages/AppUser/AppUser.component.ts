import { Component, OnInit } from '@angular/core';
import { UserConfigService } from 'services/user-config.service';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-AppUser',
  templateUrl: './AppUser.component.html',
  styleUrls: ['./AppUser.component.scss'],
})
export class AppUserComponent implements OnInit {
  constructor(
    private userConfigService: UserConfigService,
    private userService: UserService
  ) {
    this.userConfigService.getConfigs();
    this.userService.getUser();
  }

  ngOnInit() {
  }

}
