import { Component, OnInit } from '@angular/core';
import User from 'models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { APPCONSTANT } from 'utils/appConstant';

@Component({
  selector: 'app-user-follower',
  templateUrl: './user-follower.component.html',
  styleUrls: ['./user-follower.component.scss']
})
export class UserFollowerComponent implements OnInit {

  totalSize: number = 0;

  listUsers: User[];

  size = 0;

  isLoading: boolean;

  isLoadingMore: boolean = false;

  subscription: Subscription;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getListUserFollowers();
  }

  getListUserFollowers(loadMore = false) {
    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params = {
      start: this.size,
      size: this.size + APPCONSTANT.DEFAULT_SIZE_LOADING_MORE
    }

    this.subscription = this.userService.getFollowers(params).subscribe(
      (res) => {
        this.listUsers = this.listUsers ? [...this.listUsers, ...res.data.users] : res.data.users;
        this.totalSize = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
        this.size += APPCONSTANT.DEFAULT_SIZE_LOADING_MORE;
      },
      (err) => {
        this.isLoading = false;
        this.isLoadingMore = false;
        console.log(err);
      }
    );
  }

  onScroll() {
    if (this.listUsers?.length < this.totalSize) {
      this.getListUserFollowers(true);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
