import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import Post from 'models/post.model';
import { ActivatedRoute } from '@angular/router';
import { APPCONSTANT } from 'utils/appConstant';

@Component({
  selector: 'app-search-post',
  templateUrl: './search-post.component.html',
  styleUrls: ['./search-post.component.scss']
})
export class SearchPostComponent implements OnInit {

  listPosts: Post[] = [];

  isLoading: boolean = false;
  isLoadingMore: boolean = false;

  getListSubscription: Subscription;

  routeSubscription: Subscription;

  totalSize: number = 0;

  keyword: string;

  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.keyword = params.q || null;
      this.getListPost();
    });
  }

  getListPost(loadMore = false) {
    if (loadMore) {
      this.isLoadingMore = true;
    }
    else {
      this.isLoading = true;
      this.listPosts = [];
      this.totalSize = 0;
    }

    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }

    const params: ApiParams = {
      start: this.listPosts.length,
      size: APPCONSTANT.DEFAULT_PAGE_SIZE,
      search_term: this.keyword
    }

    this.getListSubscription = this.postService.searchPost(params).subscribe(
      (res) => {
        this.listPosts = this.listPosts ? this.listPosts.concat(res.data.posts) : res.data.posts;
        this.isLoading = false;
        this.isLoadingMore = false;
        this.totalSize = res.data.total_size;
      },
      (err) => {
        this.isLoadingMore = false;
        this.isLoading = false;
        this.listPosts = [];
      }
    );
  }

  onViewMore() {
    this.getListPost(true);
  }


  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
