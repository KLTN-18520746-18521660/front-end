import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import User from 'models/user.model';
import { usersMockData } from 'shared/mockData/usersMockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { mapActionWithUser } from 'utils/commonFunction';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: User;

  subscription: Subscription;
  isLoading: boolean;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.isLoading = true;
    this.subscription = this.userService.getUserInfo(this.userService.getSessionId()).subscribe(
      (res) => {
        this.user = res.data.user;

        this.user.mapAction = mapActionWithUser(res.data.user.actions || []);

        dayjs.extend(relativeTime);
        dayjs.locale(this.translate.currentLang);
        this.user = {
          ...this.user,
          fromNow: {
            created: dayjs(this.user.created_timestamp).fromNow(),
            updated: dayjs(this.user.last_access_timestamp).fromNow()
          }
        };

        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
