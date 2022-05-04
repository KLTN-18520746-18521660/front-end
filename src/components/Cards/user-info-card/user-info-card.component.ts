import { mapActionWithUser } from './../../../utils/commonFunction';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { Component, Input, OnInit } from '@angular/core';
import User from 'models/user.model';
import { ActionType } from 'utils/apiConstant';
import { UserService } from 'services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss']
})
export class UserInfoCardComponent implements OnInit {

  @Input() user_name: string;

  user: User;

  subcription: Subscription;

  actionUserSubcription: Subscription;

  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  onClickFollow() {
    if (this.user.mapAction.follow) {
      this.actionWithUser('unfollow');
    }
    else {
      this.actionWithUser('follow');
    }
  }

  getUserInfo() {
    this.isLoading = true;
    this.subcription = this.userService.getUserInfoByUserName(this.user_name, this.userService.getSessionId()).subscribe(
      (res) => {
        this.user = res.data.user;

        this.user.mapAction = mapActionWithUser(res.data.user.actions || []);
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  actionWithUser(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionUserSubcription) {
      this.actionUserSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionUserSubcription = this.userService.sendActionWithUser(this.user_name, action, sessionId).subscribe(
        (res) => {
          console.log(res);
          if (action === 'follow') {
            this.user.followers++;
            this.user.mapAction.follow = true;
          }
          else if (action === 'unfollow') {
            this.user.followers--;
            this.user.mapAction.follow = false;
          }
        },
        (err) => {
          console.log(err)
        }
      );
    }
    else {
      this.appUser.openLoginPopup();
      return;
    }
  }
  ngOnDestroy() {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
    if (this.actionUserSubcription) {
      this.actionUserSubcription.unsubscribe();
    }
  }
}