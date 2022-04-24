import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';
import Post from 'models/post.model';

@Component({
  selector: 'app-user-manage-post',
  templateUrl: './user-manage-post.component.html',
  styleUrls: ['./user-manage-post.component.scss']
})
export class UserManagePostComponent implements OnInit {
  size: number = 0;

  totalSize: number;

  isLoading: boolean = false;

  isLoadingMore: boolean = false;

  listPosts: Post[];

  error: boolean = false;

  subscription: Subscription;

  constructor(
    private postService: PostsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getListPosts();
  }

  getListPosts(loadMore = false) {
    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params = {
      start: this.size,
      size: this.size + 24
    }

    this.subscription = this.postService.getPostOfUser(this.userService.user.user_name, params, this.userService.getSessionId()).subscribe(
      (res) => {
        this.listPosts = res.data.posts;
        this.totalSize = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      (err) => {
        console.log(err);
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
