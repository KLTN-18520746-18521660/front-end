import { MenuItem, MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
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

  subscription: Subscription;

  info: NotificationInfo;

  items: MenuItem[] = [];

  constructor(
    private translate: TranslateService,
    private postService: PostsService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.loading) {
      return;
    }

    if (this.notification) {
      this.notification = {
        ...this.notification,
        fromNow: {
          created: convertDateTime(this.notification.content.date_send, this.translate.currentLang, false)
        }
      };
      // random true/ false
      this.notification.read = this.notification.status === 'Read' || false;
      // this.notification.read = Math.random() > 0.5;
      this.info = this.mapNotification(this.notification);

      this.items = [
        {
          label: this.notification.read
            ? this.translate.instant('notification.markRead')
            : this.translate.instant('notification.markUnread'),
          icon: 'pi pi-check',
          command: () => {
            this.postService.readNotification(this.notification.id).subscribe(
              (res) => {
                this.notification.read = true;
                this.messageService.add({
                  key: 'appToast',
                  severity: 'success',
                  summary: '',
                  detail: this.translate.instant('notification.markReadSuccess')
                });
              },
              (err) => {}
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
  }

  handleDelete() {
    this.delete.emit(this.notification);
  }

  mapNotification(notification: Notification): NotificationInfo {
    let result: NotificationInfo = {
      date: notification.fromNow.created,
      notification: notification,
      read: notification.read,
    };
    switch (notification.content.action) {
      case 'like-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.likePost',
          {
            user: notification.content.post_owner.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-thumbs-up',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'new-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.newPost',
          {
            user: notification.content.post_owner.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-thumbs-up',
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
            user: notification.content.post_owner.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-check',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      case 'reject-post': return {
        ...result,
        content: this.translate.instant(
          'notification.type.approvePost',
          {
            user: notification.content.post_owner.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-ban',
        user: notification.content.post_owner,
        command: () => {
          console.log('reject post');
        }
      }
      case 'new-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.addComment',
          {
            user: notification.content?.comment_owner.display_name,
            content: notification.content?.commment_content
          }
        ),
        icon: 'pi pi-comments',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(['/post', notification.content?.post_detail.slug]);
        }
      }
      case 'reply-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.replyComment',
          {
            user: notification.content?.comment_owner.display_name,
            content: notification.content?.commment_content
          }
        ),
        icon: 'pi pi-comments',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(['/post', notification.content?.post_detail.slug]);
        }
      }
      case 'like-comment': return {
        ...result,
        content: this.translate.instant(
          'notification.type.likeComment',
          {
            user: notification.content?.comment_owner.display_name,
            content: notification.content?.commment_content
          }
        ),
        icon: 'pi pi-comments',
        user: notification.content.comment_owner,
        command: () => {
          this.router.navigate(['/post', notification.content?.post_detail.slug]);
        }
      }
      case 'follow-user': return {
        ...result,
        content: this.translate.instant(
          'notification.type.follow',
          {
            user: notification.content.post_owner.display_name,
            content: notification.content.post_detail.title
          }
        ),
        icon: 'pi pi-user-plus',
        user: notification.content.post_owner,
        command: () => {
          this.router.navigate(['/post', notification.content.post_detail.slug]);
        }
      }
      default: return {
        ...result,
        content: this.translate.instant(
          'notification.type.default',
        ),
        icon: 'pi pi-bell',
        user: notification.content?.post_owner,
        command: () => {
          console.log("Error!")
        }
      }
    }
  }

  onClickNotification() {
    if (this.subscription) {
      return;
    }
    this.subscription = this.postService.readNotification(this.notification.id).subscribe(
      (res) => {
        this.notification.read = true;
        this.info.command();
        this.subscription.unsubscribe();
      },
      (err) => {
        console.log(err);
        this.subscription.unsubscribe();
      }
    )
  }

}
