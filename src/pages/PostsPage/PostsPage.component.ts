import { APPCONSTANT } from 'utils/appConstant';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import Post from 'models/post.model';
import { Tag } from 'models/tag.model';
import { postsMockData } from 'shared/mockData/postsMockData';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { randomArray } from 'utils/commonFunction';
import _ from 'lodash';

@Component({
  selector: 'app-PostsPage',
  templateUrl: './PostsPage.component.html',
  styleUrls: ['./PostsPage.component.scss']
})
export class PostsPageComponent implements OnInit {

  listPosts: Post[];

  isLoading = false;

  isLoadingMore = false;

  tags: Tag[] = randomArray(tagsMockData, 10);

  constructor(private titleService: Title) {
    this.titleService.setTitle('Posts Page');
  }

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.listPosts = postsMockData;
      this.isLoading = false;
    }, APPCONSTANT.LOADING_TIMEOUT);
  }

  onScroll() {
    if (this.isLoading || this.isLoadingMore) {
      return;
    }
    this.isLoadingMore = true;
    setTimeout(() => {
      this.listPosts = _.concat(this.listPosts, randomArray(postsMockData, 6));
      this.isLoadingMore = false;
    }, 2000);
  }
}
