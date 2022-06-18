import { PostTimlineComponent } from 'components/Timlines/post-timline/post-timline.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiParams } from 'models/api.model';
import { Comment, CommentInput } from 'models/comment.model';
import Post from 'models/post.model';
import { ReportSendModel, ReportType } from 'models/report.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { MenuItem, MessageService } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CommentService } from 'services/comment.service';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { APPCONSTANT } from 'utils/appConstant';
import { convertDateTime, mapActionWithPost } from 'utils/commonFunction';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

  sizeComment: number = 5;
  totalSizeComments: number = 0;

  breadcrumbItems: MenuItem[] = [];

  home: MenuItem;

  shareItems: MenuItem[] = [];

  markdown = '';

  menuitem: MenuItem[] = [];

  post: Post;

  actionSubcription: Subscription;
  actionUserSubcription: Subscription;

  commentSubcription: Subscription;

  postCommentSubcription: Subscription;

  getRelatedSubscription: Subscription;

  postValuesSubcription: Subscription;

  deleteCommentSubcription: Subscription;

  getOtherSubscription: Subscription;

  routeSubscription: Subscription;

  slug: string;

  contacts: any[];

  listComments: Comment[] = [];

  numberComments: number = 0;

  filterComments: {
    label: string,
    value: string
  }[];

  currentFilter: object;

  isLoading: boolean = false;

  isLoadingComments: boolean = false;
  isLoadingAddComment: boolean = false;

  isLoadingMoreComments: boolean = false;

  isLoadingValue: boolean = false;

  isLoadingRelatedPost: boolean = false;

  isLoadingOtherPost: boolean = false;

  postValues: any[];

  relatedPosts: Post[];

  otherPosts: Post[];

  progressBar: number;

  error: boolean = false;

  popupSubscription: Subscription;

  refPopup: DynamicDialogRef;

  @ViewChild('postContent') postContent: ElementRef;

  @ViewChild('comments') commentBlock: ElementRef;

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private userService: UserService,
    private messageService: MessageService,
    private clipboard: Clipboard,
    private router: Router,
    private appUser: AppUserComponent,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.slug = params.slug;
        // this.slug = decodeURI(this.slug);

        this.commentService.current_Slug = this.slug;

        this.progressBar = 0;

        this.listComments = [];

        this.breadcrumbItems = [];

        this.getPostDetail();

        this.getListRelatedPost();

        this.home = { icon: 'pi pi-home', routerLink: '/' };
      }
    );
  }

  getTranslate() {
    // menu action with post
    this.menuitem = [
      ...(this.userService.isAuthenticated && this.userService.user.user_name === this.post.owner.user_name ? [{
        id: 'edit',
        label: this.translate.instant('postDetail.action.edit'),
        icon: 'pi pi-pencil',
        command: () => {
          if (this.post.id) {
            this.router.navigate(['/edit', this.post.id]);
          }
        }
      },
      {
        id: 'history',
        label: this.translate.instant('postDetail.action.history'),
        icon: 'pi pi-history',
        command: () => {
          const data = {
            postId: this.post?.id,
          }
          this.refPopup = this.dialogService.open(PostTimlineComponent, {
            data,
            header: " ",
            footer: " ",
            dismissableMask: true,
            closeOnEscape: false,
            closable: true,
            styleClass: 'w-12 md:w-8 lg:w-8 xl:w-6'
          });
          this.userService.ref.push(this.refPopup);
          this.popupSubscription = this.refPopup.onClose.subscribe(() => {
            this.refPopup = null;
            this.userService.ref.filter(ref => ref !== this.refPopup);
          });
        }
      }] : []),
      {
        id: 'save',
        label: this.post.mapAction.saved ? this.translate.instant('postDetail.action.unsave') : this.translate.instant('postDetail.action.save'),
        icon: 'pi pi-bookmark-fill',
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
        id: 'copy',
        label: this.translate.instant('postDetail.action.copy'),
        icon: 'pi pi-copy',
        command: () => {
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug));
          this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.copied') });
        }
      },
      {
        id: 'share',
        label: this.translate.instant('postDetail.action.share'),
        icon: 'pi pi-share-alt',
        command: (event) => {
          console.log(event);
        }
      },
      {
        id: 'report',
        label: this.translate.instant('postDetail.action.report'),
        icon: 'pi pi-flag-fill',
        command: (event) => {
          this.onClickReport('post');
        }
      }
    ];

    // share menu with post speedial
    this.shareItems = [
      {
        tooltipOptions: {
          tooltipLabel: this.translate.instant('postDetail.shareAction.facebook'),
        },

        icon: 'pi pi-facebook',
        command: () => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${decodeURI(window.location.href)}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: this.translate.instant('postDetail.shareAction.twitter'),
        },
        icon: 'pi pi-twitter',
        command: () => {
          window.open(`https://twitter.com/intent/tweet?text=${this.post.title}&url=${decodeURI(window.location.href)}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: this.translate.instant('postDetail.shareAction.linkedin'),
        },
        icon: 'pi pi-linkedin',
        command: () => {
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${decodeURI(window.location.href)}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: this.post.mapAction.saved ? this.translate.instant('postDetail.shareAction.unsave') : this.translate.instant('postDetail.shareAction.save'),
        },
        icon: 'pi pi-bookmark-fill',
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
        tooltipOptions: {
          tooltipLabel: this.translate.instant('postDetail.shareAction.copy'),
        },
        icon: 'pi pi-link',
        command: () => {
          this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.copied') });
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug));
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: this.translate.instant('postDetail.shareAction.report'),
        },
        icon: 'pi pi-flag-fill',
        command: () => {
          this.onClickReport('post');
        }
      }
    ];

    // reverse this.shareItems
    this.shareItems.reverse();

    // share button on desktop view
    this.contacts = [
      {
        id: 'facebook',
        name: this.translate.instant('postDetail.shareAction.facebook'),
        icon: 'pi-facebook',
        color: '',
        style: 'p-button-rounded',
        command: () => {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + decodeURI(window.location.href), '_blank');
        }
      },
      {
        id: 'twitter',
        name: this.translate.instant('postDetail.shareAction.twitter'),
        icon: 'pi-twitter',
        color: 'p-button-info',
        style: 'p-button-rounded',
        command: () => {
          window.open('https://twitter.com/intent/tweet?text=' + this.post.title + '&url=' + decodeURI(window.location.href), '_blank');
        }
      },
      {
        id: 'linkedin',
        name: this.translate.instant('postDetail.shareAction.linkedin'),
        icon: 'pi-linkedin',
        color: 'p-button-secondary',
        style: 'p-button-rounded',
        command: () => {
          window.open('sharing/share-offsite/?url=' + decodeURI(window.location.href), '_blank');
        }
      },
      {
        id: 'save',
        name: this.post.mapAction.saved ? this.translate.instant('postDetail.shareAction.unsave') : this.translate.instant('postDetail.shareAction.save'),
        icon: 'pi-bookmark-fill',
        color: 'p-button-success',
        style: 'p-button-rounded',
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
        id: 'copy',
        name: this.translate.instant('postDetail.shareAction.copy'),
        icon: 'pi-link',
        color: 'p-button-help',
        style: 'p-button-rounded',
        command: () => {
          this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.copied') });
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug));
        }
      },
      ...(this.post.mapAction.report ? [{
        id: 'report',
        name: this.translate.instant('postDetail.shareAction.report'),
        icon: 'pi-flag-fill',
        color: 'p-button-warning',
        style: 'p-button-rounded',
        command: () => {
          this.onClickReport('post');
        }
      }] : [])
    ];

    // filter comments
    this.filterComments = [
      {
        label: this.translate.instant('postDetail.commentFilter.dateDesc'),
        value: 'created_timestamp-desc'
      },
      {
        label: this.translate.instant('postDetail.commentFilter.dateAsc'),
        value: 'created_timestamp-asc'
      },
      {
        label: this.translate.instant('postDetail.commentFilter.likesDesc'),
        value: 'likes-desc'
      },
      {
        label: this.translate.instant('postDetail.commentFilter.likesAsc'),
        value: 'likes-asc'
      },
    ];
    this.currentFilter = this.filterComments[0];
  }

  // Percent for progressbar read post content
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (window.pageYOffset == 0) {
      this.progressBar = 0;
      return;
    }
    const percent = (window.pageYOffset + this.postContent?.nativeElement?.offsetTop) / (this.postContent?.nativeElement?.offsetHeight) * 100;
    this.progressBar = percent > 100 ? 100 : percent;
  }

  getPostDetail() {
    if (!this.slug) {
      this.error = true;
      return;
    }
    this.isLoading = true;
    this.isLoadingValue = true;
    this.postsService.getPostBySlug(this.slug).subscribe(
      (res) => {
        // const convert = (str) => {
        //   str = str.replace(/<img /g, '<p-image [preview]="true" ').replace(/>/g, '></p-image>')
        //   return str;
        // }

        const categories = res.data.post.categories;
        if (categories && categories.length > 2) {
          res.data.post.categories.slice(0, 2)
        }
        categories.map((item) => {
          this.breadcrumbItems.push({
            label: item.display_name,
            routerLink: `/category/${item.slug}`
          });
        });
        this.breadcrumbItems.push({
          label: res.data.post.title,
          routerLink: `/post/${res.data.post.slug}`
        });

        this.post = res.data.post;

        // this.post.content = res.data.post.content.replace(/<img[^>]+>/g, convert);
        this.post.mapAction = mapActionWithPost(res.data.post.actions || []);

        this.titleService.setTitle(this.post.title + ' - ' + this.post.owner.display_name);
        this.post.fromNow = {
          created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, true, false),
          approved: convertDateTime(this.post.approved_timestamp, this.translate.currentLang, true, false),
          updated: this.post.last_modified_timestamp ? convertDateTime(this.post.last_modified_timestamp, this.translate.currentLang, true, false) : null
        }
        this.getTranslate();
        this.getPostValue(res.data.post);
        this.getOtherPost();
        this.isLoading = false;
        this.isLoadingValue = false;
      },
      (err) => {
        this.error = true;
        this.isLoadingValue = false;
        this.isLoading = false;
      }
    );
  }

  getListRelatedPost() {
    this.relatedPosts = [];
    this.isLoadingRelatedPost = true;
    if (this.getRelatedSubscription) {
      this.getRelatedSubscription.unsubscribe();
    }
    const params: ApiParams = {
      start: 0,
      size: 5
    }

    this.getRelatedSubscription = this.postsService.getRelatedPostsBySlug(this.slug, params).subscribe(
      (res) => {
        this.isLoadingRelatedPost = false;
        this.relatedPosts = res.data.posts.filter((item) => item.slug !== this.slug);
      },
      () => {
        this.isLoadingRelatedPost = false;
        this.relatedPosts = [];
      }
    );
  }

  getOtherPost() {
    const params: ApiParams = {
      start: 0,
      size: 5,
      sort_by: 'views',
      order: 'desc'
    }

    const user_name = this.post.owner.user_name;

    if (!user_name) {
      this.isLoadingOtherPost = false;
      this.otherPosts = [];
      return;
    }

    this.getOtherSubscription = this.postsService.getPostOfUser(user_name, params).subscribe(
      (res) => {
        this.isLoadingOtherPost = false;
        this.otherPosts = res.data.posts.filter((item) => {
          return item.slug !== this.slug;
        });
      },
      () => {
        this.isLoadingOtherPost = false;
        this.otherPosts = [];
      }
    );
  }

  getPostValue(post: Post) {
    this.postValues = [
      {
        id: 'view',
        name: this.translate.instant('postDetail.values.view'),
        value: post.views || 0,
        icon: 'pi pi-eye',
        color: 'p-button-secondary',
        style: 'p-button-rounded' + (!post.mapAction.visited ? ' p-button-outlined' : ''),
        command: (item) => {
          console.log(item);
        }
      },
      {
        id: 'like',
        name: this.translate.instant('postDetail.values.like'),
        value: post.likes || 0,
        icon: 'pi pi-thumbs-up',
        color: 'p-button-secondary',
        style: 'p-button-rounded' + (!post.mapAction.like ? ' p-button-outlined' : ''),
        command: () => {
          if (post.mapAction.like)
            this.actionWithPost('unlike');
          else
            this.actionWithPost('like');
        }
      },
      {
        id: 'unlike',
        name: this.translate.instant('postDetail.values.unlike'),
        value: post.dislikes || 0,
        icon: 'pi pi-thumbs-down',
        color: 'p-button-secondary',
        style: 'p-button-rounded' + (!post.mapAction.dislike ? ' p-button-outlined' : ''),
        command: () => {
          if (post.mapAction.dislike)
            this.actionWithPost('undislike');
          else
            this.actionWithPost('dislike');
        }
      },
      {
        id: 'comment',
        name: this.translate.instant('postDetail.values.comment'),
        value: post.comments || 0,
        icon: 'pi pi-comments',
        color: 'p-button-secondary',
        style: 'p-button-rounded' + (!post.mapAction.comment ? ' p-button-outlined' : ''),
        command: () => {
          this.commentBlock.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    ]
  }

  getPostValueWhenAction() {
    this.isLoadingValue = true;
    if (this.postValuesSubcription) {
      this.postValuesSubcription.unsubscribe();
    }
    this.postValuesSubcription = this.postsService.getPostValuesBySlug(this.slug).subscribe(
      (res) => {
        this.post = { ...this.post, ...res.data.post };
        this.post.mapAction = mapActionWithPost(res.data.post.actions || []);
        this.getPostValue(this.post);
        this.isLoadingValue = false;
      },
      () => {
        this.isLoadingValue = false;
      }
    );
  }

  actionWithPost(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.postsService.sendActionWithPost(this.slug, action).subscribe(
        (res) => {
          this.getPostValueWhenAction();
          if (action === 'save' || action === 'unsave') {
            this.post.mapAction.saved = !this.post.mapAction.saved;
            this.getTranslate();
            this.messageService.add({ severity: 'success', summary: action.toUpperCase(), detail: this.translate.instant('status.success').toString() });
          }
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: err.error, detail: this.translate.instant(`messageCode.${err.message_code}`) });
        }
      );
    }
    else {
      this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant('message.needlogin') });
      this.appUser.openLoginPopup();
      return;
    }
  }

  getComments(data?: ApiParams) {
    if (this.commentSubcription) {
      this.commentSubcription.unsubscribe();
    }

    let params: ApiParams;

    if (data) {
      params = data;
    }
    else {
      params = {
        start: this.listComments.length,
        size: APPCONSTANT.NUMBER_COMMENT_PER_PAGE
      }
    }

    this.commentSubcription = this.commentService.getCommentByPostSlug(this.slug, params).subscribe(
      (res) => {
        this.totalSizeComments = res.data.total_size;
        this.listComments = this.listComments.concat(res.data.comments);
        this.isLoadingComments = false;
        this.isLoadingMoreComments = false;
      },
      () => {
        this.isLoadingMoreComments = false;
        this.isLoadingComments = false;
      }
    );
  }

  onClickReport(type: ReportType = 'post', comment_id = null) {
    if (!this.userService.getSessionId()) {
      this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant('message.needlogin') });
      this.appUser.openLoginPopup();
      return;
    }
    const text = this.translate.instant('report');
    const data: ReportSendModel = {
      post_slug: this.post.slug,
      report_type: type,
      comment_id,
      user_name: null,
    };
    this.appUser.openReportPopup(data, text.title, null);
  }

  initLoadComment() {
    this.isLoadingComments = true;

    this.getComments();
  }

  loadMoreComment() {
    this.isLoadingMoreComments = true;

    setTimeout(() => {
      this.getComments();
    }, APPCONSTANT.LOADING_TIMEOUT);
  }

  onFilterComments(event) {
    this.currentFilter = event.value;
    this.isLoadingComments = true;
    const getParams = event.value.value.split('-');

    const params: ApiParams = {
      start: 0,
      size: APPCONSTANT.NUMBER_COMMENT_PER_PAGE,
      sort_by: getParams[0],
      order: getParams[1]
    }

    this.listComments = [];

    setTimeout(() => {
      this.getComments(params);
    }, APPCONSTANT.LOADING_TIMEOUT);
  }

  onSubmitComment(input: CommentInput) {
    if (input instanceof SubmitEvent) {
      return;
    }
    if (input.content.trim()) {
      if (!this.userService.getSessionId()) {
        this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant('message.needlogin') });
        this.appUser.openLoginPopup();
        return;
      }
      this.isLoadingAddComment = true;
      if (this.postCommentSubcription) {
        this.postCommentSubcription.unsubscribe();
      }
      this.postCommentSubcription = this.commentService
        .postComment(this.slug, input.parent_id, input.content).subscribe(
          (res) => {
            this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.addcomment') });
            this.listComments.unshift(res.data.comment);
            this.totalSizeComments++;
            this.isLoadingAddComment = false;
          },
          (err) => {
            this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) });
            this.isLoadingAddComment = false;
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
        this.messageService.add({ severity: 'success', summary: '', detail: this.translate.instant('message.deletepostcomment') });
        this.totalSizeComments--;
        this.listComments = this.listComments.filter(item => item.id !== comment.id);
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) });
      }
    );
  }

  onShowSpeeDial() {
    DomHandler.addClass(document.body, 'p-overflow-hidden');
  }

  onHideSpeeDial() {
    DomHandler.removeClass(document.body, 'p-overflow-hidden');
  }

  ngOnDestroy() {
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (this.actionUserSubcription) {
      this.actionUserSubcription.unsubscribe();
    }
    if (this.commentSubcription) {
      this.commentSubcription.unsubscribe();
    }
    if (this.postCommentSubcription) {
      this.postCommentSubcription.unsubscribe();
    }
    if (this.postValuesSubcription) {
      this.postValuesSubcription.unsubscribe();
    }
    if (this.deleteCommentSubcription) {
      this.deleteCommentSubcription.unsubscribe();
    }
    if (this.getRelatedSubscription) {
      this.getRelatedSubscription.unsubscribe();
    }
    if (this.getOtherSubscription) {
      this.getOtherSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }

  }
}
