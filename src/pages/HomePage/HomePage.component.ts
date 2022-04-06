import { Component, OnInit } from '@angular/core';
import Post from 'models/post.model';
import Tag from 'models/tag.model';
import { UserConfigService } from 'services/user-config.service';
import { postsMockData } from 'shared/mockData/postsMockData';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { BREAKPOINT, CONTACT_INFO } from 'utils/appConstant';
import { randomArray } from 'utils/commonFunction';
import { PostsService } from 'services/posts.service';
import _ from 'lodash';
import { AppConfig } from 'models/appconfig';
import { Subscription } from 'rxjs';
import { ConfigService } from 'pages/Admin/service/app.config.service';

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
    this.isLoadingPosts = true;
    setTimeout(() => {
      this.listPosts = postsMockData;
      this.isLoadingPosts = false;
    }, 2000);
    this.tags = randomArray(tagsMockData, 5);
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
    this.isLoadingPosts = true;
    setTimeout(() => {
      this.listPosts = randomArray(postsMockData, 12);
      this.isLoadingPosts = false;
    }, 1000);
    this.userConfigService.addConfig('viewOption', e);
  }

  onLoadRecommend() {
    this.isLoadingRecommend = true;
    setTimeout(() => {
      this.listRecommend = randomArray(postsMockData, 6);
      this.isLoadingRecommend = false;
    }, 2000);
  }

  onLoadMorePosts(scroll = false) {
    if (this.isLoadingPosts || this.isLoadingMorePosts) {
      return;
    }
    if (scroll && window.innerWidth < BREAKPOINT.lg) {
      return;
    }

    this.isLoadingMorePosts = true;
    setTimeout(() => {
      this.listPosts = _.concat(this.listPosts, randomArray(postsMockData, 6));
      this.isLoadingMorePosts = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
