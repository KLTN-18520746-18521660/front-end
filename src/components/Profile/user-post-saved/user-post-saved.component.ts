import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionPostParams, ApiParams } from 'models/api.model';
import Post from 'models/post.model';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { APPCONSTANT } from 'utils/appConstant';

@Component({
  selector: 'app-user-post-saved',
  templateUrl: './user-post-saved.component.html',
  styleUrls: ['./user-post-saved.component.scss']
})
export class UserPostSavedComponent implements OnInit {

  start: number = 0;

  totalSize: number = 0;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listPosts: Post[] = [];

  tabMenu: MenuItem[];

  activeType: ActionPostParams = 'saved';

  error: boolean = false;

  subscription: Subscription;

  orderBy: {
    label?: string;
    value?: string;
  };

  orderOptions: {
    label?: string;
    value?: string;
  }[];

  constructor(
    private postService: PostsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.orderOptions = [
      {
        label: this.translate.instant('order.post.dateDesc'),
        value: 'created_timestamp-desc'
      },
      {
        label: this.translate.instant('order.post.dateAsc'),
        value: 'created_timestamp-asc'
      },
      {
        label: this.translate.instant('order.post.likesDesc'),
        value: 'likes-desc'
      },
      {
        label: this.translate.instant('order.post.viewsDesc'),
        value: 'views-desc'
      }
    ];

    this.tabMenu = [
      {
        label: this.translate.instant('profile.actionPosts.menu.saved'),
        command: () => {
          this.activeType = 'saved';
          this.start = 0;
          this.totalSize = 0;
          this.orderBy = this.orderOptions[0];
          this.listPosts = [];
          this.getListPosts();
        }
      },
      {
        label: this.translate.instant('profile.actionPosts.menu.liked'),
        command: () => {
          this.activeType = 'like';
          this.start = 0;
          this.totalSize = 0;
          this.orderBy = this.orderOptions[0];
          this.listPosts = [];
          this.getListPosts();
        }
      },
      {
        label: this.translate.instant('profile.actionPosts.menu.visited'),
        command: () => {
          this.activeType = 'visited';
          this.start = 0;
          this.totalSize = 0;
          this.orderBy = this.orderOptions[0];
          this.listPosts = [];
          this.getListPosts();
        }
      },
      {
        label: this.translate.instant('profile.actionPosts.menu.following'),
        command: () => {
          this.activeType = 'follow';
          this.start = 0;
          this.totalSize = 0;
          this.orderBy = this.orderOptions[0];
          this.listPosts = [];
          this.getListPosts();
        }
      }
    ];

    this.orderBy = this.orderOptions[0];
    this.getListPosts();
  }

  getListPosts(loadMore = false) {
    if (this.isLoading || this.isLoadingMore) {
      return;
    }

    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params: ApiParams = {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE,
      sort_by: this.orderBy.value.split('-')[0],
      order: this.orderBy.value.split('-')[1]
    }

    this.subscription = this.postService.getPostByActionType(this.activeType, params).subscribe(
      (res) => {
        this.listPosts = this.listPosts ? [...this.listPosts, ...res.data.posts] : res.data.posts;
        this.start += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
        this.totalSize = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      () => {
        this.error = true;
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    );
  }

  onScroll() {
    if (this.listPosts?.length < this.totalSize) {
      this.getListPosts(true);
    }
  }

  onOrderPosts(event) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.start = 0;
    this.listPosts = [];
    this.getListPosts();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
