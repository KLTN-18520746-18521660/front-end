import { APPCONSTANT } from 'utils/appConstant';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiParams } from 'models/api.model';
import User from 'models/user.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {

  listUsers: User[];
  
  isLoading: boolean = false;
  isLoadingMore: boolean = false;

  getListSubscription: Subscription;

  totalSize: number = 0;

  keyword: string;

  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.keyword = this.activatedRoute.snapshot.queryParams.q || null;

    this.getListPost();
  }

  getListPost(loadMore = false) {
    if (loadMore) {
      this.isLoadingMore = true;
    }
    else {
      this.isLoading = true;
    }

    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }

    const params: ApiParams = {
      start: this.getListPost.length,
      size: APPCONSTANT.DEFAULT_PAGE_SIZE,
      search_term: this.keyword
    }

    this.getListSubscription = this.postService.searchUser(params).subscribe(
      (res) => {
        this.listUsers = this.listUsers ? this.listUsers.concat(res.data.users) : res.data.users;

        this.isLoading = false;
        this.isLoadingMore = false;
        this.totalSize = res.data.total_size;
      },
      (err) => {
        this.listUsers = [];
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    );
  }

  onViewMore() {
    this.isLoadingMore = true;

    this.getListPost(true);
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }
}
