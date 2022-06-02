import { ApiParams } from './../../models/api.model';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'models/appconfig.model';
import Category from 'models/category.model';
import Post, { PostTypeView } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'services/app.config.service';
import { PostsService } from 'services/posts.service';
import { UserConfigService } from 'services/user-config.service';
import { UserService } from 'services/user.service';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { APPCONSTANT, BREAKPOINT, CONTACT_INFO } from 'utils/appConstant';
import { randomArray } from 'utils/commonFunction';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.scss']
})
export class HomePageComponent implements OnInit {

  isGrid: boolean = false;
  layout: string;

  layoutOptions: any[];

  contacts = CONTACT_INFO;

  tags: Tag[] = [];

  currentPostType: PostTypeView = 'trending';

  listPostType: PostTypeView[] = [];

  listPosts: Post[] = [];

  listRecommend: Post[] = [];

  isLoadingPosts: boolean = false;

  isLoadingMorePosts: boolean = false;
  isLoadingRecommend: boolean = false;

  config: AppConfig;

  subscription: Subscription;
  postSubscription: Subscription;
  recommendSubscription: Subscription;

  start: number = 0;
  totalSizePost: number;

  listCategory: Category[] = [];
  isLoadingCategory: boolean = false;

  constructor(
    private userConfigService: UserConfigService,
    private postService: PostsService,
    private configService: AppConfigService,
    private userService: UserService
  ) {
    this.layoutOptions = [
      { icon: 'pi pi-align-justify', value: 'list' },
      { icon: 'pi pi-th-large', value: 'grid' },
    ];

    if (this.userService.isAuthenticated) {
      this.listPostType = ['recommend', 'following'];
    }
    else {
      this.listPostType = ['new', 'trending']
    }

    const _layout = this.userConfigService.getConfigByKey('layout') || 'list';
    this.layout = _layout;
    this.isGrid = _layout === 'grid' ? true : false;

    this.currentPostType = this.listPostType.includes(this.userConfigService.getConfigByKey('viewOption')) ? this.userConfigService.getConfigByKey('viewOption') : this.listPostType[0];
  }

  ngOnInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    this.getListPostsByType(this.currentPostType, false);

    this.tags = randomArray(tagsMockData, 5);
    this.onLoadRecommend();
    this.getListCategory();
  }

  getListCategory() {
    this.isLoadingCategory = true;
    this.postSubscription = this.postService.getListCategories().subscribe(
      (res) => {
        this.listCategory = res.data.categories;
        this.isLoadingCategory = false;
      }
    );
  }

  onChangeLayout(e) {
    if (e.value === 'grid' && !this.isGrid) {
      this.isGrid = true;
    }
    else if (e.value === 'list' && this.isGrid) {
      this.isGrid = false;
    }
    else {
      return;
    }

    this.userConfigService.addConfig('layout', e.value);
  }

  onChangeViewOption(e) {
    this.listPosts = [];
    this.currentPostType = e;
    this.userConfigService.addConfig('viewOption', e);
    // setTimeout(() => {
    //   this.listPosts = randomArray(postsMockData, 12);
    //   this.isLoadingPosts = false;
    // }, 1000);
    this.start = 0;
    this.getListPostsByType(this.currentPostType, false);
  }

  onLoadRecommend() {
    this.isLoadingRecommend = true;
    this.recommendSubscription = this.postService.getPostsTrending({}).subscribe(
      (res) => {
        this.listRecommend = res.data.posts;
        this.isLoadingRecommend = false;
      }
    );
  }

  onLoadMorePosts(scroll = false) {
    if (this.isLoadingPosts || this.isLoadingMorePosts) {
      return;
    }
    if (scroll && window.innerWidth < BREAKPOINT.lg) {
      return;
    }

    if (this.start < this.totalSizePost) {
      this.getListPostsByType(this.currentPostType, true);
    }
  }

  getListPostsByType(type: PostTypeView, loadMore = false) {
    if (loadMore) {
      this.isLoadingMorePosts = true;
    }
    else {
      this.isLoadingPosts = true;
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
        this.isLoadingPosts = false;
        this.isLoadingMorePosts = false;
        this.start += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
      },
      () => {
        this.isLoadingPosts = false;
        this.listPosts = this.listPosts ? this.listPosts : [];
        this.totalSizePost = this.listPosts.length;
        this.isLoadingMorePosts = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
