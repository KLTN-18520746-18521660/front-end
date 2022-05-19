import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiParams } from 'models/api.model';
import Post from 'models/post.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { MessageService } from 'primeng/api';
import Tag from 'models/tag.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { ActionType } from 'utils/apiConstant';
import { APPCONSTANT } from 'utils/appConstant';
import { mapActionWithTag } from 'utils/commonFunction';

@Component({
  selector: 'app-TagsPage',
  templateUrl: './TagsPage.component.html',
  styleUrls: ['./TagsPage.component.scss']
})
export class TagsPageComponent implements OnInit {

  
  tagID: string;

  tag: Tag;

  error: boolean = false;

  listPosts: Post[];

  isLoading: boolean = false;

  isLoadingPost: boolean = false;

  isLoadingTag: boolean = false;

  isLoadingMore: boolean = false;

  isLoadingAction: boolean = false;

  getTagSubcription: Subscription;

  getPostSubcription: Subscription;

  actionSubcription: Subscription;

  currentPage: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private appUser: AppUserComponent,
    private messageService: MessageService,
    private translate: TranslateService,
    private title: Title,
    private router: Router
  ) { }

  ngOnInit() {
    this.tagID = this.activatedRoute.snapshot.params.id || null;
    if (this.tagID) {
      this.getTagDetail(this.tagID);
    }

    this.currentPage = this.activatedRoute.snapshot.queryParams.page || 1;
    this.getPosts(this.currentPage);
  }

  getTagDetail(id: string) {
    this.isLoadingTag = true;
    this.getTagSubcription = this.postService.getTagDetail(id).subscribe(
      (res) => {
        this.tag = res.data.tag;
        this.isLoadingTag = false;

        this.title.setTitle('#' + this.tag.name);

        this.tag.mapAction = mapActionWithTag(this.tag.actions);
      },
      () => {
        this.isLoadingTag = false;
        this.error = true;
      }
    );
  }

  getPosts(page: number) {
    this.isLoadingPost = true;

    if (this.getPostSubcription) {
      this.getPostSubcription.unsubscribe();
    }

    const params: ApiParams = {
      // tags: this.tag.tag,
      start: (page - 1) * APPCONSTANT.DEFAULT_PAGE_SIZE,
      size: APPCONSTANT.DEFAULT_PAGE_SIZE,
    }

    this.getPostSubcription = this.postService.getPostsByType('trending', {}).subscribe(
      (res) => {
        this.listPosts = res.data.posts;
        this.isLoadingPost = false;
      },
      () => {
        this.isLoading = false;
        this.error = true;
      }
    );
  }

  onPaginate(event) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      ...(event.page == 0 ? { queryParams: { page: null } } : { queryParams: { page: event.page } }),
    });

    // this.currentPage = event.page + 1;
    // this.getPosts(this.currentPage);
  }

  onClickFollow() {
    if (this.tag.mapAction.follow) {
      this.actionWithUser('unfollow');
    }
    else {
      this.actionWithUser('follow');
    }
  }

  actionWithUser(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    this.isLoadingAction = true;
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.postService.sendActionWithTag(this.tag.tag, action).subscribe(
        () => {
          this.isLoadingAction = false;
          if (action === 'follow') {
            this.tag.mapAction.follow = true;
          }
          else if (action === 'unfollow') {
            this.tag.mapAction.follow = false;
          }
        },
        () => {
          this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant('message.error') });
          this.isLoadingAction = false;
        }
      );
    }
    else {
      this.appUser.openLoginPopup();
      this.isLoading = false;
      return;
    }
  }

  ngOnDestroy() {
    if (this.getTagSubcription) {
      this.getTagSubcription.unsubscribe();
    }
    if (this.getPostSubcription) {
      this.getPostSubcription.unsubscribe();
    }
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
  }
}
