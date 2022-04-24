import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { Component, OnInit } from '@angular/core';
import User from 'models/user.model';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.component.html',
  styleUrls: ['./user-following.component.scss']
})
export class UserFollowingComponent implements OnInit {

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
    this.getListUserFollowing();
  }

  getListUserFollowing(loadMore = false) {
    if (loadMore)
      this.isLoadingMore = true;
    else
      this.isLoading = true;

    const params = {
      start: this.size,
      size: this.size + 24
    }

    this.subscription = this.userService.getFollowings(params, this.userService.getSessionId()).subscribe(
      (res) => {
        this.listUsers = this.listUsers ? [...this.listUsers, ...res.data.users] : res.data.users;
        this.totalSize = res.data.total_size;
        this.isLoading = false;
        this.isLoadingMore = false;
        this.size += 24;
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
      this.getListUserFollowing(true);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
