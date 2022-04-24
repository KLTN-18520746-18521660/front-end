import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import Notification from 'models/notification.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {

  size: number = 0;

  totalSize: number;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listNotifications: Notification[];

  error: boolean = false;

  subscription: Subscription;

  viewRead: boolean = false;

  constructor(
    private postService: PostsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getListNotifications();
  }

  getListNotifications(loadMore = false) {
    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params = {
      start: this.size,
      size: this.size + 24
    }

    this.subscription = this.postService.getNotification(params, this.userService.getSessionId()).subscribe(
      (res) => {
        this.listNotifications = res.data.notifications;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      (err) => {
        console.log(err);
        this.error = true;
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    );
  }

  onScroll() {
    if (this.listNotifications?.length < this.totalSize) {
      this.getListNotifications(true);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleChangeViewRead(event) {

  }

}
