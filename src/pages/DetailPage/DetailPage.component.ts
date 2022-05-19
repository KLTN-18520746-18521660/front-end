import { ReportSendModel, ReportType } from 'models/report.model';
import Comment, { CommentInput } from 'models/comment.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import mermaid from 'mermaid';
import Post from 'models/post.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CommentService } from 'services/comment.service';
import { postsMockData } from 'shared/mockData/postsMockData';
import { convertDateTime, mapActionWithPost, randomArray } from 'utils/commonFunction';
import { PostsService } from 'services/posts.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DomHandler } from 'primeng/dom';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';

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

  postValuesSubcription: Subscription;

  deleteCommentSubcription: Subscription;

  slug: string;

  contacts: any[];

  listComments: any[];

  numberComments: number = 0;

  filterComments: any[];

  currentFilter: object;

  isLoading: boolean = false;

  isLoadingComments: boolean = false;
  isLoadingAddComment: boolean = false;

  isLoadingMoreComments: boolean = false;

  isLoadingValue: boolean = false;

  postValues: any[];

  listRecommend: Post[] = [];

  progressBar: number = 0;

  error: boolean = false;

  textTranslate: any;

  @ViewChild('postContent') postContent: ElementRef;

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
    private appUser: AppUserComponent
  ) { }

  ngOnInit() {
    this.listRecommend = randomArray(postsMockData, 6);

    this.slug = this.activatedRoute.snapshot.params.slug;
    // this.slug = decodeURI(this.slug);

    this.commentService.current_Slug = this.slug;

    this.getPostDetail();

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Config markdown view mermaid
    mermaid.initialize({
      securityLevel: 'loose'
    });
    mermaid.init();
  }

  getTranslate() {
    const res = this.translate.instant('postDetail');
    this.textTranslate = res;
    let result;

    // menu action with post
    this.menuitem = [
      {
        id: 'edit',
        label: this.translate.instant('postDetail.action.edit'),
        icon: 'pi pi-pencil',
        command: (event) => {
          console.log(event);
        }
      },
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
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug + `?utm_source=${window.location.hostname}&utm_medium=home&utm_campaign=copy`));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link copied' });
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
          window.open(`sharing/share-offsite/?url=${decodeURI(window.location.href)}`, '_blank');
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
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug + `?utm_source=${window.location.hostname}&utm_medium=home&utm_campaign=copy`));
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
          this.clipboard.copy(decodeURI(window.location.origin + '/post/' + this.post.slug + `?utm_source=${window.location.hostname}&utm_medium=home&utm_campaign=copy`));
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
        label: '',
        value: 'created_timestamp-desc'
      },
      {
        label: '',
        value: 'created_timestamp-asc'
      },
      {
        label: '',
        value: 'like-desc'
      },
      {
        label: '',
        value: 'like-asc'
      },
    ];
    result = Object.values(res.commentFilter) as [];
    this.filterComments.map((item, index) => {
      item.label = result[index]
    });
    this.currentFilter = this.filterComments[0];
  }

  // Percent for progressbar read post content
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (window.pageYOffset == 0) {
      this.progressBar = 0;
      return;
    }
    let percent = (window.pageYOffset + this.postContent?.nativeElement?.offsetTop) / (this.postContent?.nativeElement?.offsetHeight) * 100;
    this.progressBar = percent > 100 ? 100 : percent;
  }

  onTextChange(event) {
    console.log(event)
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
          res.data.categories.slice(0, 2)
        }
        categories.map((item) => {
          this.breadcrumbItems.push({
            label: item.display_name,
            url: `/category/${item.slug}`
          });
        });
        this.breadcrumbItems.push({
          label: res.data.post.title,
          url: `/post/${res.data.post.slug}`
        });

        const convertLink = (str: string) => {
          str = str.replace(/<a[^>]*href=["']([^"']*)["']/g, (item) => {
            item = item.replace(/(?<=href=[\'\"])([^\'\"]+)/gm, (match) => {
              return `${window.location.origin}/goto?url=${match}`;
            })
            return item;
          })
          return str;
        }

        this.post = res.data.post;

        this.post.content = convertLink(this.post.content);
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
          this.router.navigate([], { fragment: "comments" });
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
            this.messageService.add({ severity: 'success', summary: action.toUpperCase(), detail: this.translate.instant('status.success').toString() });
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

  getComments(size: number) {
    if (this.commentSubcription) {
      this.commentSubcription.unsubscribe();
    }

    this.commentSubcription = this.commentService.getCommentByPostSlug(this.slug).subscribe(
      (res) => {
        this.totalSizeComments = res.data.total_size;
        this.listComments = res.data.comments;
        this.isLoadingComments = false;
        this.isLoadingMoreComments = false;
      },
      (err) => {
        this.isLoadingMoreComments = false;
        this.isLoadingComments = false;
        console.log(err);
      }
    );
  }

  onClickReport(type: ReportType = 'post', comment_id = null) {
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

    setTimeout(() => {
      this.getComments(this.sizeComment);
    }, 2000);
  }

  loadMoreComment() {
    this.isLoadingMoreComments = true;

    this.sizeComment += 5;
    this.getComments(this.sizeComment);
  }

  onFilterComments(event) {
    this.currentFilter = event.value;
    const getParams = event.value.value.split('-');
    // this.commentService.sortComments(getParams[0], getParams[1]);
    // this.listComments = [];
    // this.listComments = this.commentService.getComments(this.post.id);
  }

  onSubmitComment(input: CommentInput) {
    if (input instanceof SubmitEvent) {
      return;
    }
    if (input.content.trim()) {
      this.isLoadingAddComment = true;
      if (!this.userService.getSessionId()) {
        this.messageService.add({ severity: 'error', summary: '', detail: 'Please login to countinue!' });
        this.appUser.openLoginPopup();
        return;
      }
      if (this.postCommentSubcription) {
        this.postCommentSubcription.unsubscribe();
      }
      this.postCommentSubcription = this.commentService
        .postComment(this.slug, input.parent_id, input.content).subscribe(
          (res) => {
            this.messageService.add({ severity: 'success', summary: '', detail: 'Comment successfully' });
            this.listComments.unshift(res.data.comment);
            this.totalSizeComments++;
            this.isLoadingAddComment = false;
          },
          (err) => {
            this.messageService.add({ severity: 'error', summary: '', detail: err.message });
            console.log(err);
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
        this.messageService.add({ severity: 'success', summary: '', detail: 'Comment successfully deleted' });
        this.totalSizeComments--;
        this.listComments = this.listComments.filter(item => item.id !== comment.id);
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: '', detail: err.message });
        console.log(err);
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
  }
}
