import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommentInputComponent } from 'components/Input/comment-input/comment-input.component';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import Comment, { CommentInput } from 'models/comment.model';
import { ReportSendModel } from 'models/report.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommentService } from 'services/comment.service';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { mapActionWithComment } from 'utils/commonFunction';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  sizeComment = 2;

  @Input() comment: Comment;

  @ViewChild('replyForm') replyForm: CommentInputComponent;

  @Output() submit = new EventEmitter<CommentInput>();

  menuitem: MenuItem[] = [
    {
      id: 'like',
      label: '',
      disabled: false,
      icon: 'pi pi-thumbs-up',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'unlike',
      label: '',
      disabled: false,
      icon: 'pi pi-thumbs-down',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'reply',
      label: '',
      disabled: false,
      icon: 'pi pi-reply',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'edit',
      label: '',
      disabled: false,
      icon: 'pi pi-pencil',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'delete',
      label: '',
      disabled: false,
      icon: 'pi pi-trash',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'report',
      label: '',
      disabled: false,
      icon: 'pi pi-flag-fill',
      command: () => {
        this.onClickReport();
      }
    }
  ]

  isShowReply = false;

  postCommentSubcription: Subscription;

  getCommentSubcription: Subscription;

  actionSubcription: Subscription;

  isLoading: boolean;
  isLoadingComment: boolean = false;
  isLoadingMoreComment: boolean = false;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private messageService: MessageService,
    private commentService: CommentService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    this.isLoadingComment = true;
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.comment = {
      ...this.comment,
      fromNow: {
        created: dayjs(this.comment.created_timestamp).fromNow(true),
        updated: dayjs(this.comment.last_modified_timestamp)?.fromNow(true) || null
      }
    };

    this.comment.mapAction = mapActionWithComment(this.comment.actions || []);

    this.translate.get('postDetail.commentMenu').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });
    this.isLoadingComment = false;
  }

  loadReplyComment(size: number) {
    if (this.getCommentSubcription) {
      this.getCommentSubcription.unsubscribe();
    }

    let params = {
      parrent_comment_id: this.comment.id,
      start: 0,
      size: size
    }

    this.getCommentSubcription = this.commentService.getCommentByPostSlug(this.commentService.current_Slug, this.userService.getSessionId(), params).subscribe(
      (res) => {
        this.comment.reply_comments.comments = res.data.comments;
        this.comment.mapAction = mapActionWithComment(res.data?.post?.actions || []);

        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  loadMoreComment() {
    this.isLoadingMoreComment = true;
    this.sizeComment += 5;
    this.loadReplyComment(this.sizeComment);
  }

  onSubmitReply() {
    const value = this.replyForm.form.value.value;
    if (value.trim()) {
      console.log(value);
      if (!this.userService.getSessionId()) {
        this.messageService.add({ severity: 'error', summary: '', detail: 'Please login to countinue!' });
        this.appUser.openLoginPopup();
        return;
      }
      if (this.postCommentSubcription) {
        this.postCommentSubcription.unsubscribe();
      }
      this.postCommentSubcription = this.commentService.postComment(this.commentService.current_Slug, this.comment.id, value, this.userService.getSessionId()).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: '', detail: 'Comment successfully' });
          this.comment.reply_comments.comments.unshift(res.data.comment);
          this.sizeComment++;
          this.isLoading = false;
          this.isShowReply = false;
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: '', detail: err.message });
          console.log(err);
          this.isLoading = false;
        }
      );
    }
  }

  actionWithComment(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.commentService.sendActionWithComment(this.comment.id, action, sessionId).subscribe(
        (res) => {
          // this.getPostValueWhenAction();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success' });
          console.log(res);
          if (action === 'like' || action === 'unlike') {
            this.comment.mapAction.like = !this.comment.mapAction.like;
          }
          else if (action === 'dislike' || action === 'undislike') {
            this.comment.mapAction.dislike = !this.comment.mapAction.dislike;
          }
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
          console.log(err)
        }
      );
    }
    else {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Please login to countinue!' });
      this.appUser.openLoginPopup();
      return;
    }
  }

  onClickReport(type = 'comment') {
    const text = this.translate.instant('report');
    const data = {
      post_id: 1,
      type,
      comment_id: this.comment.id || 1,
      user_id: this.comment.owner.user_name,
    } as ReportSendModel;
    this.appUser.openReportPopup(data, text.title, null);
  }

  onClickLike() {
    if (this.comment.mapAction.like) {
      this.actionWithComment('unlike');
    }
    else {
      this.actionWithComment('like');
    }
  }

  onClickDislike() {
    if (this.comment.mapAction.dislike) {
      this.actionWithComment('undislike');
    }
    else {
      this.actionWithComment('dislike');
    }
  }

  onClickReply() {
    this.isShowReply = !this.isShowReply;
    // if (this.isShowReply && this.commentInput?.textInput?.nativeElement) {
    //   this.commentInput.textInput.nativeElement.focus();
    // }
  }

  ngOnDestroy() {
    if (this.getCommentSubcription) {
      this.getCommentSubcription.unsubscribe();
    }
    if (this.postCommentSubcription) {
      this.postCommentSubcription.unsubscribe();
    }
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
  }
}
