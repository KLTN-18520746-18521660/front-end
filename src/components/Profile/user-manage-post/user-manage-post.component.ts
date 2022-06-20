import { ApiParams } from 'models/api.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';
import Post from 'models/post.model';
import { APPCONSTANT } from 'utils/appConstant';

@Component({
  selector: 'app-user-manage-post',
  templateUrl: './user-manage-post.component.html',
  styleUrls: ['./user-manage-post.component.scss']
})
export class UserManagePostComponent implements OnInit {
  start: number = 0;

  totalSize: number = 0;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listPosts: Post[] = [];

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
    private userService: UserService,
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
        label: this.translate.instant('order.post.modifyDesc'),
        value: 'last_modified_timestamp-desc'
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

    this.orderBy = this.orderOptions[0];
    this.getListPosts();
  }

  getListPosts(loadMore = false) {
    if (this.isLoading || this.isLoadingMore) {
      return;
    }

    if (loadMore) {
      this.isLoadingMore = true;
    }
    else {
      this.isLoading = true;
      this.start = 0;
      this.totalSize = 0;
      this.listPosts = [];
    }

    const params: ApiParams = {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE,
      sort_by: this.orderBy.value.split('-')[0],
      order: this.orderBy.value.split('-')[1]
    }

    this.subscription = this.postService.getPostOfUser(this.userService.user.user_name, params).subscribe(
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

  deletePost(id) {
    this.listPosts = this.listPosts.filter(post => post.id !== id);
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
