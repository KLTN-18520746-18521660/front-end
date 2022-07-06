import { Subscription } from 'rxjs';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Post from 'models/post.model';
import { MenuItem, MessageService } from 'primeng/api';
import { convertDateTime, mapActionWithPost, getDiffDay } from 'utils/commonFunction';
import { Clipboard } from '@angular/cdk/clipboard';
import { ReportType, ReportSendModel } from 'models/report.model';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { PostsService } from 'services/posts.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  providers: [MessageService]
})
export class PostCardComponent implements OnInit {

  @Input() loading: boolean = false;

  @Input() showAction: boolean = true;

  @Input() isGrid = false;

  @Input() post: Post;

  @Input() hasAnimation: boolean = true;

  @Input() showThumbnail: boolean = true;

  actionSubcription: Subscription;

  postValuesSubcription: Subscription;

  menuitem: MenuItem[] = [];

  constructor(
    private translate: TranslateService,
    private clipboard: Clipboard,
    private messageService: MessageService,
    private appUser: AppUserComponent,
    private userService: UserService,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    if (this.loading) {
      return;
    }

    this.post = {
      ...this.post,
      fromNow: {
        created: this.post.created_timestamp ? convertDateTime(this.post?.created_timestamp, this.translate.currentLang, true, false) : '',
        approved: this.post.approved_timestamp ? convertDateTime(this.post?.approved_timestamp, this.translate.currentLang, true, false) : '',
      },
      new: getDiffDay(this.post.approved_timestamp) < 3,
    };

    this.post.mapAction = mapActionWithPost(this.post.actions || []);

    this.generateMenu();
  }

  generateMenu() {
    this.menuitem = [
      {
        id: 'save',
        label: this.post.mapAction.saved ? this.translate.instant('action.unsave') : this.translate.instant('action.save'),
        icon: this.post.mapAction.saved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark',
        command: () => {
          if (this.post.mapAction.saved) {
            this.actionWithPost('unsave');
          }
          else {
            this.actionWithPost('save');
          }
        }
      },
      {
        id: 'follow',
        label: this.post.mapAction.follow ? this.translate.instant('action.unfollow') : this.translate.instant('action.follow'),
        icon: this.post.mapAction.follow ? 'pi pi-minus' : 'pi pi-plus',
        command: (event) => {
          if (this.post.mapAction.follow) {
            this.actionWithPost('unfollow');
          }
          else {
            this.actionWithPost('follow');
          }
        }
      },
      {
        id: 'copy',
        label: this.translate.instant('card.action.copy'),
        icon: 'pi pi-copy',
        command: () => {
          this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.copied') });
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug));
        }
      },
      {
        id: 'share',
        label: this.translate.instant('card.action.share'),
        icon: 'pi pi-share-alt',
        command: (event) => {
          console.log(event);
        }
      },
      ...(!this.post.mapAction.report ? [{
        id: 'report',
        label: this.translate.instant('card.action.report'),
        icon: 'pi pi-flag-fill',
        command: (event) => {
          this.onClickReport();
        }
      }] : [])
    ]
  }

  onClickReport(type: ReportType = 'post') {
    const text = this.translate.instant('report');
    const data: ReportSendModel = {
      post_slug: this.post.slug,
      report_type: type,
    };
    this.appUser.openReportPopup(data, text.title,  ' ');
  }

  actionWithPost(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.postsService.sendActionWithPost(this.post.slug, action).subscribe(
        () => {
          if (action === 'save' || action === 'unsave') {
            this.post.mapAction.saved = !this.post.mapAction.saved;
            this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('status.success').toString() });
          }
          else if (action === 'follow' || action === 'unfollow') {
            this.post.mapAction.follow = !this.post.mapAction.follow;
            this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('status.success').toString() });
          }
          this.getPostValueWhenAction();
          this.generateMenu();
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: err.error, detail: this.translate.instant(`messageCode.${err.message_code}`) });
        }
      );
    }
    else {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Please login to countinue!' });
      this.appUser.openLoginPopup();
      return;
    }
  }


  getPostValueWhenAction() {
    if (this.postValuesSubcription) {
      this.postValuesSubcription.unsubscribe();
    }
    this.postValuesSubcription = this.postsService.getPostValuesBySlug(this.post.slug).subscribe(
      (res) => {
        this.post = { ...this.post, ...res.data.post };
        this.post.mapAction = mapActionWithPost(res.data.post.actions || []);
      }
    );
  }

}
