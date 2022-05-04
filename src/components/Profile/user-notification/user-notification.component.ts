import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import Notification from 'models/notification.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { APPCONSTANT } from 'utils/appConstant';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

export interface ListNotification {
  date: string;
  notifications: Notification[];
}

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {

  size: number = 0;

  sizeUnread: number = 0;

  totalSize: number;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listNotifications: Notification[];

  error: boolean = false;

  subscription: Subscription;

  viewOnlyUnRead: boolean = false;

  constructor(
    private postService: PostsService,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.getListNotifications();
  }

  getListNotifications(loadMore = false) {
    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params = this.viewOnlyUnRead ? {
      start: this.size,
      size: this.size + APPCONSTANT.DEFAULT_SIZE_LOADING_MORE,
      status: 'Sent'
    } : {
      start: this.size,
      size: this.size + APPCONSTANT.DEFAULT_SIZE_LOADING_MORE
    }

    this.subscription = this.postService.getNotification(params).subscribe(
      (res) => {
        this.listNotifications = this.listNotifications ? [...this.listNotifications, ...res.data.notifications] : res.data.notifications;
        this.size = this.size + APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
        this.totalSize = res.data.total_size;
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

  handleChangeViewRead(event) {
    this.size = 0;
    this.listNotifications = [];
    this.getListNotifications();
  }

  handleDelete(notification: Notification) {
    this.postService.deleteNotification(notification.id).subscribe(
      (res) => {
        this.messageService.add({
          key: 'appToast',
          severity: 'success',
          summary: '',
          detail: this.translate.instant('notification.deleteSuccess')
        });
        this.listNotifications = this.listNotifications.filter(item => item.id !== notification.id);
      },
      (err) => {
        console.log(err);
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

}
