import { MenuItem, MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Notification from 'models/notification.model';
import User from 'models/user.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { convertDateTime } from 'utils/commonFunction';

export interface NotificationInfo {
  date?: string;
  notification?: Notification;
  content?: string;
  user?: User;
  icon?: string;
  badgeClass?: string;
  read?: boolean;
  command?: Function;
}

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification: Notification;

  @Output() delete = new EventEmitter<Notification>();

  @Input() loading: boolean = false;

  @Input() showButtonMenu: boolean = true;

  subscription: Subscription;
  deleteSubscription: Subscription;

  info: NotificationInfo;

  items: MenuItem[] = [];

  constructor(
    private translate: TranslateService,
    private postService: PostsService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.loading) {
      return;
    }

    if (this.notification) {
      this.notification = {
        ...this.notification,
        fromNow: {
          created: convertDateTime(this.notification.created_timestamp, this.translate.currentLang, false)
        }
      };
      // random true/ false
      this.notification.read = this.notification.status === 'Read' || false;
      // this.notification.read = Math.random() > 0.5;
      this.info = this.mapNotification(this.notification);
    }
  }

  handleDelete() {
    this.loading = true;
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }

    this.deleteSubscription = this.postService.deleteNotification(this.notification.id).subscribe(
      () => {
        this.messageService.add({
          key: 'notification-card' + this.notification.id,
          severity: 'success',
          summary: '',
          detail: this.translate.instant('notification.deleteSuccess')
        });
        this.loading = false;
        this.delete.emit(this.notification);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  mapNotification(notification: Notification): NotificationInfo {
    let result: NotificationInfo = {
      date: notification.fromNow.created,
      notification: notification,
      read: notification.read,
    };

    if (this.notification.read) {
      this.items = [
        {
          label: this.translate.instant('notification.markUnread'),
          icon: 'pi pi-check',
          command: () => {
            this.postService.unReadNotification(this.notification.id).subscribe(
              () => {
                this.notification.read = false;
                this.info = this.mapNotification(this.notification);
                this.userService.userStatistic.next({
                  ...this.userService.user,
                  unread_notifications: this.userService.user?.unread_notifications + 1 || 0
                });
                this.messageService.add({
                  key: 'notification-card' + this.notification.id,
                  severity: 'success',
                  summary: '',
                  detail: this.translate.instant('notification.markReadSuccess')
                });
              },
              (err) => { }
            );
          }
        },
        {
          label: this.translate.instant('notification.delete'),
          icon: 'pi pi-trash',
          command: () => {
            this.handleDelete();
          },
        }
      ];
    }
    else {
      this.items = [
        {
          label: this.translate.instant('notification.markRead'),
          icon: 'pi pi-check',
          command: () => {
            this.postService.readNotification(this.notification.id).subscribe(
              (res) => {
                this.notification.read = true;
                this.info = this.mapNotification(this.notification);
                this.userService.userStatistic.next({
                  ...this.userService.user,
                  unread_notifications: this.userService.user?.unread_notifications - 1 || 0
                });
                this.messageService.add({
                  key: 'notification-card' + this.notification.id,
                  severity: 'success',
                  summary: '',
                  detail: this.translate.instant('notification.markReadSuccess')
                });
              },
              (err) => { }
            );
          }
        },
        {
          label: this.translate.instant('notification.delete'),
          icon: 'pi pi-trash',
          command: () => {
            this.handleDelete();
          },
        }
      ];
    }

    if (!this.notification.user_action) {
      this.notification.user_action = {
        display_name: "ADMIN"
      };
    }
    switch (notification.type) {
      case 'like-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.likePost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-thumbs-up',
        badgeClass: 'bg-blue-500 text-50',
        user: new User({
          ...notification.user_action,
        }),

        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'new-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.newPost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-book',
        badgeClass: 'bg-orange-400 text-50',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'approve-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.approvePost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-check',
        badgeClass: 'bg-green-500 text-50',
        user: new User({
          ...notification.user_action,
        }),
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'approve-modify-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.approveModifyPost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-pencil',
        badgeClass: 'bg-green-500 text-50',
        user: new User({
          ...notification.user_action,
        }),
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'reject-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.rejectPost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title || ''
          }
        ),
        icon: 'pi pi-ban',
        badgeClass: 'bg-orange-500 text-50',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'reject-modify-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.rejectModifyPost',
          {
            user: notification.user_action.display_name,
            content: notification.content.post_detail.title || ''
          }
        ),
        icon: 'pi pi-pencil',
        badgeClass: 'bg-orange-500 text-50',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'new-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.addComment',
          {
            user: notification.user_action.display_name,
            content: notification.content?.comment_content
          }
        ),
        icon: 'pi pi-comments',
        badgeClass: 'bg-blue-500 text-50',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(
            ['/post', notification.content?.post_detail.slug],
            {
              queryParams: {
                comment_id: notification.content?.comment_id
              }
            }
          );
        }
      }
      case 'reply-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.replyComment',
          {
            user: notification.user_action.display_name,
            content: notification.content?.comment_content || ''
          }
        ),
        icon: 'pi pi-comments',
        badgeClass: 'bg-bluegray-500 text-50',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(
            ['/post', notification.content?.post_detail.slug],
            {
              queryParams: {
                comment_id: notification.content?.comment_id
              }
            }
          );
        }
      }
      case 'like-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.likeComment',
          {
            user: notification.user_action.display_name,
            content: notification.content?.comment_content || ''
          }
        ),
        icon: 'pi pi-comments',
        badgeClass: 'bg-blue-500 text-50',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(
            ['/post', notification.content?.post_detail.slug],
            {
              queryParams: {
                comment_id: notification.content?.comment_id
              }
            }
          );
        }
      }
      case 'follow-user': return {
        ...result,
        content: this.translate.instant(
          'notification.type.follow',
          {
            user: notification.user_action.display_name,
            content: ''
          }
        ),
        icon: 'pi pi-user-plus',
        badgeClass: 'bg-indigo-500 text-50',
        user: new User({
          ...notification.user_action,
        }),
        command: () => {
          this.router.navigate(['/user', notification.user_action.user_name]);
        }
      }
      default: return {
        ...result,
        content: this.translate.instant(
          'notification.type.default',
        ),
        icon: 'pi pi-bell',
        badgeClass: 'bg-indigo-500 text-50',
        user: new User({
          ...notification.user_action,
        }),
        command: () => {
          console.log("Error!")
        }
      }
    }
  }

  onClickNotification() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.notification.read) {
      this.info.command();
    }
    else {
      this.subscription = this.postService.readNotification(this.notification.id).subscribe(
        () => {
          this.userService.userStatistic.next({
            ...this.userService.user,
            unread_notifications: this.userService.user?.unread_notifications - 1 || 0
          });
          this.notification.read = true;
          this.info = this.mapNotification(this.notification);
          this.info.command();
          this.subscription.unsubscribe();
        },
        () => {
          this.subscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
