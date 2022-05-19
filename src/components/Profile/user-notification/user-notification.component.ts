import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import Notification from 'models/notification.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { APPCONSTANT } from 'utils/appConstant';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import User from 'models/user.model';

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

  start: number = 0;

  sizeUnread: number = 0;

  totalSize: number;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listNotifications: Notification[];

  error: boolean = false;

  subscription: Subscription;

  userStatisticSubscription: Subscription;

  viewOnlyUnRead: boolean = false;

  constructor(
    private postService: PostsService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.viewOnlyUnRead = this.activatedRoute.snapshot.queryParams?.view === 'read';

    this.sizeUnread = this.userService.user.unread_notifications;

    this.userStatisticSubscription = this.userService.userStatistic$.subscribe(
      (user) => {
        this.sizeUnread = user.unread_notifications;
      }
    );

    this.getListNotifications();
  }

  getListNotifications(loadMore = false) {
    if (loadMore) {
      this.isLoadingMore = true;
    }
    else {
      this.isLoading = true;
    }

    const params = this.viewOnlyUnRead ? {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE,
      status: 'Sent'
    } : {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE
    }

    this.subscription = this.postService.getNotification(params).subscribe(
      (res) => {
        this.listNotifications = this.listNotifications ? [...this.listNotifications, ...res.data.notifications] : res.data.notifications;
        this.start += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
        this.totalSize = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      () => {
        this.listNotifications = this.listNotifications ? this.listNotifications : [];
        this.error = true;
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    );
  }

  onClickMarkAllAsRead() {
    this.postService.readAllNotification().subscribe(
      () => {
        this.messageService.add({
          key: 'notification',
          severity: 'success',
          summary: '',
          detail: this.translate.instant('notification.markAllReadSuccess')
        });
        this.listNotifications = this.listNotifications.filter(item => item.status === 'Sent');
      }
    );
  }

  handleChangeViewRead(event) {
    if (event.checked) {
      this.router.navigate([], { queryParams: { view: 'unread' } });
    }
    else {
      this.router.navigate([], { queryParams: null });
    }
    this.start = 0;
    this.listNotifications = [];
    this.getListNotifications();
  }

  handleDelete(notification: Notification) {
    this.postService.deleteNotification(notification.id).subscribe(
      () => {
        this.messageService.add({
          key: 'notification',
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
    if (this.userStatisticSubscription) {
      this.userStatisticSubscription.unsubscribe();
    }
  }

}
