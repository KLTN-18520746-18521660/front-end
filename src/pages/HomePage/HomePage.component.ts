import Category from 'models/category.model';
import { Component, OnInit } from '@angular/core';
import Post from 'models/post.model';
import Tag from 'models/tag.model';
import { UserConfigService } from 'services/user-config.service';
import { postsMockData } from 'shared/mockData/postsMockData';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { APPCONSTANT, BREAKPOINT, CONTACT_INFO } from 'utils/appConstant';
import { randomArray } from 'utils/commonFunction';
import { PostsService } from 'services/posts.service';
import _ from 'lodash';
import { AppConfig } from 'models/appconfig.model';
import { Subscription } from 'rxjs';
import { ConfigService } from 'services/app.config.service';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.scss']
})
export class HomePageComponent implements OnInit {

  isGrid: boolean = false;
  layout: string;
  viewOption: string;

  layoutOptions: any[];

  contacts = CONTACT_INFO;

  tags: Tag[] = [];

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
    private configService: ConfigService
  ) {
    this.layoutOptions = [
      { icon: 'pi pi-align-justify', value: 'list' },
      { icon: 'pi pi-th-large', value: 'grid' },
    ];

    const _layout = this.userConfigService.getConfigByKey('layout') || 'list';
    this.layout = _layout;
    this.isGrid = _layout === 'grid' ? true : false;

    this.viewOption = this.userConfigService.getConfigByKey('viewOption') || 'foryou';
  }

  ngOnInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    this.getListPostsByType('trending', false);

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
    this.isGrid = !this.isGrid;
    this.listPosts = [];
    this.isLoadingPosts = true;
    setTimeout(() => {
      this.listPosts = randomArray(postsMockData, 12);
      this.isLoadingPosts = false;
    }, 300);
    this.userConfigService.addConfig('layout', e.value);
  }

  onChangeViewOption(e) {
    this.viewOption = e;
    this.listPosts = [];
    this.userConfigService.addConfig('viewOption', e);
    // setTimeout(() => {
    //   this.listPosts = randomArray(postsMockData, 12);
    //   this.isLoadingPosts = false;
    // }, 1000);
    this.start = 0;
    this.getListPostsByType('trending', false);
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
      this.getListPostsByType('trending', true);
    }
  }

  getListPostsByType(type: 'following' | 'new' | 'trending', loadMore = false) {
    if (loadMore) {
      this.isLoadingMorePosts = true;
    }
    else {
      this.isLoadingPosts = true;
    }

    const params = {
      start: this.start,
      size: APPCONSTANT.DEFAULT_SIZE_LOADING_MORE
    }

    this.postSubscription = this.postService.getPostsByType(type, {}).subscribe(
      (res) => {
        this.listPosts = this.listPosts ? [...this.listPosts, ...res.data.posts] : res.data.posts;
        this.totalSizePost = res.data.total_size;
        this.isLoadingPosts = false;
        this.isLoadingMorePosts = false;
        this.start += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
      },
      () => {
        this.isLoadingPosts = false;
        this.isLoadingMorePosts = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
