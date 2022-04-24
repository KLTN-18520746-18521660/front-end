import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActionType } from './../../../utils/apiConstant';
import { UserService } from 'services/user.service';
import User from 'models/user.model';
import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    if (!this.loading) {
      this.user.mapAction = mapActionWithUser(this.user.actions || []);
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
    if (this.subscription) {
      return;
    }
    this.subscription = this.userService.sendActionWithUser(this.user.user_name, action, this.userService.getSessionId()).subscribe(
      (res) => {
        this.user.actions = res.data.action;
        this.user.mapAction = mapActionWithUser(this.user.actions || []);
        this.subscription.unsubscribe();
      },
      (err) => {
        console.log(err);
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
