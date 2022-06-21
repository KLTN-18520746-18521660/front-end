import { mapActionWithUser } from 'utils/commonFunction';
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

  @Input() user: User;

  @Input() user_name: string;

  @Input() onlyShowButton: boolean = false;

  subcription: Subscription;

  actionUserSubcription: Subscription;

  isLoading: boolean = false;

  showButtonFollow: boolean = false;

  constructor(
    private userService: UserService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    if (this.onlyShowButton) {
      return;
    }
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
    this.subcription = this.userService.getUserInfoByUserName(this.user_name).subscribe(
      (res) => {
        this.user = res.data.user;

        this.user.mapAction = mapActionWithUser(res.data.user.actions || []);

        if (this.userService.user && this.userService.user.user_name !== this.user_name) {
          this.showButtonFollow = true;
        }
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  actionWithUser(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    this.isLoading = true;
    if (this.actionUserSubcription) {
      this.actionUserSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionUserSubcription = this.userService.sendActionWithUser(this.user_name, action).subscribe(
        () => {
          this.isLoading = false;
          if (action === 'follow') {
            this.user.followers++;
            this.user.mapAction.follow = true;
          }
          else if (action === 'unfollow') {
            this.user.followers--;
            this.user.mapAction.follow = false;
          }
        },
        () => {
          this.isLoading = false;
        }
      );
    }
    else {
      this.appUser.openLoginPopup();
      this.isLoading = false;
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
