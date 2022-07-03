import { Component, Input, OnInit } from '@angular/core';
import User from 'models/user.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { mapActionWithUser } from 'utils/commonFunction';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() loading: boolean = false;

  @Input() user: User;

  subscription: Subscription;

  isLoading: boolean = false;

  showButton: boolean = true;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    if (!this.loading) {
      this.user.mapAction = mapActionWithUser(this.user.actions || []);
    }

    if (this.userService.isAuthenticated && this.user?.user_name === this.userService.user.user_name) {
      this.showButton = false;
    }
  }

  onClick() {
    if (this.user.mapAction.follow) {
      this.actionUser('unfollow');
    }
    else {
      this.actionUser('follow');
    }
  }

  actionUser(action: ActionType) {
    if (!this.userService.getSessionId()) {
      this.appUser.openLoginPopup();
      return;
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isLoading = true;
    this.subscription = this.userService.sendActionWithUser(this.user.user_name, action).subscribe(
      () => {
        this.user.mapAction.follow = !this.user.mapAction.follow;
        this.isLoading = false;
        this.subscription.unsubscribe();
      },
      (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: '', detail: err.message })
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
