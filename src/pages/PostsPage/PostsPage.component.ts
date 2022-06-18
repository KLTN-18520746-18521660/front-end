import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { ApiParams } from 'models/api.model';
import Post, { PostTypeView } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { Subscription } from 'rxjs';
import { postsMockData } from 'shared/mockData/postsMockData';
import { APPCONSTANT } from 'utils/appConstant';
import { randomArray } from 'utils/commonFunction';
import { PostsService } from './../../services/posts.service';

@Component({
  selector: 'app-PostsPage',
  templateUrl: './PostsPage.component.html',
  styleUrls: ['./PostsPage.component.scss']
})
export class PostsPageComponent implements OnInit {

  listPosts: Post[];

  isLoading = false;

  isLoadingMore = false;

  isLoadingTag = false;

  totalSizePost: number = 0;

  start: number = 0;

  popularTags: Tag[] = [];

  currentPostType: {
    name: string;
    value: PostTypeView;
  };

  listPostType: {
    name: string,
    value: PostTypeView
  }[] = [];

  postSubscription: Subscription;

  tagSubscription: Subscription;

  constructor(
    private postService: PostsService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getPopularTags();
    this.listPostType = [
      {
        name: this.translate.instant('home.viewOption.new'),
        value: 'new'
      },
      {
        name: this.translate.instant('home.viewOption.popular'),
        value: 'trending'
      }
    ];
    this.currentPostType = this.listPostType[0];
    this.getListPostsByType(this.currentPostType.value);
  }

  onScroll() {
    if (this.isLoading || this.isLoadingMore) {
      return;
    }
    if (this.start < this.totalSizePost) {
      this.getListPostsByType(this.currentPostType.value, true);
    }
  }

  onChangeType(event) {
    this.listPosts = [];
    this.start = 0;
    this.getListPostsByType(event.value.value);
  }

  getListPostsByType(type: PostTypeView, loadMore = false) {
    if (loadMore) {
      this.isLoadingMore = true;
    }
    else {
      this.isLoading = true;
    }

    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }

    const params: ApiParams = {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE
    }

    this.postSubscription = this.postService.getPostsByType(type, params).subscribe(
      (res) => {
        this.listPosts = this.listPosts ? [...this.listPosts, ...res.data.posts] : res.data.posts;
        this.totalSizePost = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
        this.start += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
      },
      () => {
        this.isLoading = false;
        this.listPosts = this.listPosts ? this.listPosts : [];
        this.totalSizePost = this.listPosts.length;
        this.isLoadingMore = false;
      }
    );
  }

  getPopularTags() {
    this.isLoadingTag = true;
    this.popularTags = [];

    const params: ApiParams = {
      start: 0,
      size: 24
    };

    this.postService.getTrendingTags(params).subscribe(
      (res) => {
        this.popularTags = res.data.tags;
        this.isLoadingTag = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.tagSubscription) {
      this.tagSubscription.unsubscribe();
    }
  }
}
