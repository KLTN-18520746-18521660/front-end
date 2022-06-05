import Post from 'models/post.model';
import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import User from 'models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import { Tag } from 'models/tag.model';
import Category from 'models/category.model';

@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.component.html',
  styleUrls: ['./search-all.component.scss']
})
export class SearchAllComponent implements OnInit {

  listPosts: Post[];

  listUsers: User[];

  listTags: Tag[];

  listCategories: Category[];

  isLoading: boolean = false;

  getListSubscription: Subscription;

  routeSubscription: Subscription;

  keyword: string;

  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.keyword = params.q || null;
      this.getListResult();
    });
  }

  getListResult() {
    this.isLoading = true;

    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }

    const params: ApiParams = {
      search_term: this.keyword
    }

    this.getListSubscription = this.postService.searchAll(params).subscribe(
      (res) => {
        this.listUsers = res.data.search_user.users || [];
        this.listPosts = res.data.search_post.posts || [];
        this.listTags = res.data.search_tag.tags || [];
        this.listCategories = res.data.search_category.categories || [];
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.listUsers = [];
        this.listPosts = [];
        this.listTags = [];
        this.listCategories = [];
      }
    );
  }

  onViewMore() {

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
