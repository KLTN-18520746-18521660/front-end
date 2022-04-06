import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import User from 'models/user.model';
import { usersMockData } from 'shared/mockData/usersMockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: User;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.user = usersMockData[0];
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.user = {
      ...this.user,
      fromNow: {
        created: dayjs(this.user.created_timestamp).fromNow(),
        updated: dayjs(this.user.last_access_timestamp).fromNow()
      }
    };
  }

}
