import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import User from 'models/user.model';
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService,
    private clipboard: Clipboard
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
            updated: dayjs(this.user.last_access_timestamp).fromNow(),
            password: dayjs(this.user.settings.password.last_change_password || this.user.created_timestamp).fromNow(),
          }
        };

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onClickCopy() {
    this.messageService.add({ key: 'userInfo', severity: 'success', summary: '', detail: this.translate.instant('message.copied') });
    this.clipboard.copy(decodeURI(window.location.origin + '/user/' + this.user.user_name + `?utm_source=${window.location.hostname}&utm_medium=user`))
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
