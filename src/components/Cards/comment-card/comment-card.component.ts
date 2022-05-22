import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommentInputComponent } from 'components/Input/comment-input/comment-input.component';
import Comment, { CommentInput } from 'models/comment.model';
import { ReportSendModel } from 'models/report.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommentService } from 'services/comment.service';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { convertDateTime, mapActionWithComment } from 'utils/commonFunction';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  sizeComment = 2;

  @Input() loading: boolean = false;

  @Input() comment: Comment;

  @ViewChild('replyForm') replyForm: CommentInputComponent;

  @Output() submit = new EventEmitter<CommentInput>();

  @Output() delete = new EventEmitter<Comment>();

  menuitem: MenuItem[];

  isShowReply = false;

  postCommentSubcription: Subscription;

  getCommentSubcription: Subscription;

  actionSubcription: Subscription;

  deleteCommentSubcription: Subscription;

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
    if (this.loading) {
      return;
    }

    this.isLoadingComment = true;

    this.comment = {
      ...this.comment,
      fromNow: {
        created: convertDateTime(this.comment.created_timestamp, this.translate.currentLang, true, true),
        updated: convertDateTime(this.comment.last_modified_timestamp, this.translate.currentLang, true, true) || null
      }
    };

    this.comment.mapAction = mapActionWithComment(this.comment.actions || []);

    this.menuitem = [
      {
        id: 'like',
        label: this.translate.instant('postDetail.commentMenu.like'),
        disabled: false,
        icon: 'pi pi-thumbs-up',
        command: () => {
          this.actionWithComment('like');
        }
      },
      {
        id: 'unlike',
        label: this.translate.instant('postDetail.commentMenu.unlike'),
        disabled: false,
        icon: 'pi pi-thumbs-down',
        command: () => {
          this.actionWithComment('unlike');
        }
      },
      ...(this.comment.reply_comments ? [{
        id: 'reply',
        label: this.translate.instant('postDetail.commentMenu.reply'),
        disabled: false,
        icon: 'pi pi-reply',
        command: () => {
          this.onClickReply();
        }
      }] : []),
      // {
      //   id: 'edit',
      //   label: '',
      //   disabled: false,
      //   icon: 'pi pi-pencil',
      //   command: (event) => {
      //     console.log(event);
      //   }
      // },
      ...(this.comment.owner.user_name === this.userService.user.user_name ? [{
        id: 'delete',
        label: this.translate.instant('postDetail.commentMenu.delete'),
        disabled: false,
        icon: 'pi pi-trash',
        command: () => {
          this.handleDeleteComment(this.comment);
        }
      }] : []),
      ...(!this.comment.mapAction.report ? [{
        id: 'report',
        label: this.translate.instant('postDetail.commentMenu.report'),
        disabled: false,
        icon: 'pi pi-flag-fill',
        command: () => {
          this.onClickReport();
        }
      }] : [])
    ];

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

    this.getCommentSubcription = this.commentService.getCommentByPostSlug(this.commentService.current_Slug, params).subscribe(
      (res) => {
        this.comment.reply_comments.comments = res.data.comments;
        this.comment.mapAction = mapActionWithComment(res.data?.post?.actions || []);

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
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
      this.postCommentSubcription = this.commentService.postComment(this.commentService.current_Slug, this.comment.id, value).subscribe(
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

  onDeleteComment(comment: Comment) {
    if (this.deleteCommentSubcription) {
      this.deleteCommentSubcription.unsubscribe();
    }
    this.deleteCommentSubcription = this.commentService.deleteComment(comment.id).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: '', detail: 'Comment successfully deleted' });
        this.comment.replies--;
        this.comment.reply_comments.total_size--;
        this.comment.reply_comments.comments = this.comment.reply_comments.comments.filter(item => item.id !== comment.id);
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: '', detail: err.message });
        console.log(err);
      }
    );
  }

  handleDeleteComment(comment: Comment) {
    this.delete.emit(comment);
  }

  actionWithComment(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.commentService.sendActionWithComment(this.comment.id, action).subscribe(
        () => {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success' });
          if (action === 'like') {
            this.comment.mapAction.like = true;
            this.comment.likes++;
          }
          else if (action === 'unlike') {
            this.comment.mapAction.like = false;
            this.comment.likes--;
          }
          else if (action === 'dislike') {
            this.comment.mapAction.dislike = true;
            this.comment.dislikes++;
          }
          else if (action === 'undislike') {
            this.comment.mapAction.dislike = false;
            this.comment.dislikes--;
          }
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
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
    this.appUser.openReportPopup(data, text.title, ' ');
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
