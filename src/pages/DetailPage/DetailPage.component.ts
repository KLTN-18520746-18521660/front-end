import { ReportSendModel } from 'models/report.model';
import Comment, { CommentInput } from 'models/comment.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import mermaid from 'mermaid';
import Post from 'models/post.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CommentService } from 'services/comment.service';
import { postsMockData } from 'shared/mockData/postsMockData';
import { mapActionWithPost, randomArray } from 'utils/commonFunction';
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

  breadcrumbItems: MenuItem[];

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

    this.commentService.current_Slug = this.slug;

    this.getPostDetail();

    this.breadcrumbItems = [
      { label: 'Technology', url: 'technology' },
      { label: 'Angular', url: 'tag/angular' }
    ];

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
    result = Object.values(res.action) as [];
    // menu action with post
    this.menuitem = [
      {
        id: 'edit',
        label: '',
        icon: 'pi pi-pencil',
        command: (event) => {
          console.log(event);
        }
      },
      {
        id: 'save',
        label: '',
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
        label: '',
        icon: 'pi pi-copy',
        command: () => {
          this.clipboard.copy(window.location.href);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link copied' });
        }
      },
      {
        id: 'share',
        label: '',
        icon: 'pi pi-share-alt',
        command: (event) => {
          console.log(event);
        }
      },
      {
        id: 'report',
        label: '',
        icon: 'pi pi-flag-fill',
        command: (event) => {
          this.onClickReport('post');
        }
      }
    ]
    this.menuitem.map((item, index) => {
      item.label = result[index]
    });

    // share menu with post speedial
    this.shareItems = [
      {
        tooltipOptions: {
          tooltipLabel: ""
        },

        icon: 'pi pi-facebook',
        command: () => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: ""
        },
        icon: 'pi pi-twitter',
        command: () => {
          window.open(`https://twitter.com/intent/tweet?text=${this.post.title}&url=${window.location.href}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: ""
        },
        icon: 'pi pi-linkedin',
        command: () => {
          window.open(`sharing/share-offsite/?url=${window.location.href}`, '_blank');
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: ""
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
          tooltipLabel: ""
        },
        icon: 'pi pi-link',
        command: () => {
          this.clipboard.copy(window.location.href);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link copied' });
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: ""
        },
        icon: 'pi pi-flag-fill',
        command: () => {
          this.onClickReport('post');
        }
      }
    ];
    result = Object.values(res.shareAction) as [];
    // this.shareItems.map((item: any, index) => {
    //   item.tooltipOptions.tooltipLabel = result[index]
    // })
    // reverse this.shareItems
    this.shareItems.reverse();

    // share button on desktop view
    this.contacts = [
      {
        id: 'facebook',
        name: '',
        icon: 'pi-facebook',
        color: '',
        style: 'p-button-rounded',
        command: () => {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank');
        }
      },
      {
        id: 'twitter',
        name: '',
        icon: 'pi-twitter',
        color: 'p-button-info',
        style: 'p-button-rounded',
        command: () => {
          window.open('https://twitter.com/intent/tweet?text=' + this.post.title + '&url=' + window.location.href, '_blank');
        }
      },
      {
        id: 'linkedin',
        name: '',
        icon: 'pi-linkedin',
        color: 'p-button-secondary',
        style: 'p-button-rounded',
        command: () => {
          window.open('sharing/share-offsite/?url=' + window.location.href, '_blank');
        }
      },
      {
        id: 'save',
        name: '',
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
        name: '',
        icon: 'pi-link',
        color: 'p-button-help',
        style: 'p-button-rounded',
        command: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link copied' });
          this.clipboard.copy(window.location.href);
        }
      },
      {
        id: 'report',
        name: '',
        icon: 'pi-flag-fill',
        color: 'p-button-warning',
        style: 'p-button-rounded',
        command: () => {
          this.onClickReport('post');
        }
      },
    ];
    result = Object.values(res.shareAction) as [];
    this.contacts.map((item: any, index) => {
      item.name = result[index]
    })

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
    this.isLoading = true;
    this.isLoadingValue = true;
    this.postsService.getPostBySlug(this.slug, this.userService.getSessionId()).subscribe(
      (res) => {
        // const convert = (str) => {
        //   str = str.replace(/<img /g, '<p-image [preview]="true" ').replace(/>/g, '></p-image>')
        //   return str;
        // }

        this.post = res.data.post;
        // this.post.content = res.data.post.content.replace(/<img[^>]+>/g, convert);
        this.post.mapAction = mapActionWithPost(res.data.post.actions || []);

        this.titleService.setTitle(this.post.title + ' - ' + this.post.owner.display_name);

        dayjs.extend(relativeTime);
        dayjs.locale(this.translate.currentLang);
        this.post.fromNow = {
          created: dayjs(this.post.created_timestamp).fromNow(true),
          updated: this.post.last_modified_timestamp ? dayjs(this.post.last_modified_timestamp).fromNow(true) : null
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
        console.log(err);
      }
    );
  }

  getPostValue(post: Post) {
    this.postValues = [
      {
        id: 'view',
        name: '',
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
        name: '',
        value: post.likes | 0,
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
        name: '',
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
        name: '',
        value: post.comments || 0,
        icon: 'pi pi-comments',
        color: 'p-button-secondary',
        style: 'p-button-rounded' + (!post.mapAction.comment ? ' p-button-outlined' : ''),
        command: () => {
          this.router.navigate([], { fragment: "comments" });
        }
      }
    ]
    let result = Object.values(this.textTranslate.values) as [];
    this.postValues.map((item: any, index) => {
      item.name = result[index]
    });
  }

  getPostValueWhenAction() {
    this.isLoadingValue = true;
    if (this.postValuesSubcription) {
      this.postValuesSubcription.unsubscribe();
    }
    this.postValuesSubcription = this.postsService.getPostValuesBySlug(this.slug, this.userService.getSessionId()).subscribe(
      (res) => {
        this.post = { ...this.post, ...res.data.post };
        this.post.mapAction = mapActionWithPost(res.data.post.actions || []);
        this.getPostValue(this.post);
        this.isLoadingValue = false;
      },
      (err) => {
        this.isLoadingValue = false;
        console.log(err);
      }
    );
  }

  actionWithPost(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.postsService.sendActionWithPost(this.slug, action, sessionId).subscribe(
        (res) => {
          this.getPostValueWhenAction();
          if (action === 'save' || action === 'unsave') {
            this.messageService.add({ severity: 'success', summary: action.toUpperCase(), detail: this.translate.instant('status.success').toString() });
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

  getComments(size: number) {
    if (this.commentSubcription) {
      this.commentSubcription.unsubscribe();
    }

    this.commentSubcription = this.commentService.getCommentByPostSlug(this.slug, this.userService.getSessionId()).subscribe(
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

  onClickReport(type: 'post' | 'comment' | 'user' = 'post', comment_id = 0) {
    const text = this.translate.instant('report');
    const data = {
      post_id: this.post.id || 1,
      type,
      comment_id,
      user_id: 'test',
    } as ReportSendModel;
    this.appUser.openReportPopup(data, text.title, null);
  }

  initLoadComment() {
    this.isLoadingComments = true;

    this.getComments(this.sizeComment);
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
      this.isLoading = true;
      if (!this.userService.getSessionId()) {
        this.messageService.add({ severity: 'error', summary: '', detail: 'Please login to countinue!' });
        this.appUser.openLoginPopup();
        return;
      }
      if (this.postCommentSubcription) {
        this.postCommentSubcription.unsubscribe();
      }
      this.postCommentSubcription = this.commentService.postComment(this.slug, input.parent_id, input.content, this.userService.getSessionId()).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: '', detail: 'Comment successfully' });
          this.listComments.unshift(res.data.comment);
          this.totalSizeComments++;
          this.isLoading = false;
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
    this.deleteCommentSubcription = this.commentService.deleteComment(comment.id, this.userService.getSessionId()).subscribe(
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
