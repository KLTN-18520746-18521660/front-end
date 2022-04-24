import { UserService } from 'services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from 'services/posts.service';
import Post from 'models/post.model';
import User from 'models/user.model';

@Component({
  selector: 'app-UserInfoPage',
  templateUrl: './UserInfoPage.component.html',
  styleUrls: ['./UserInfoPage.component.scss']
})
export class UserInfoPageComponent implements OnInit {
  error: boolean = false;

  user_name: string = '';
  user: User;

  isLoading: boolean = true;

  listPosts: Post[] = [];

  constructor(
    private postService: PostsService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user_name = this.activatedRoute.snapshot.params['username'];
    const params = {
    }

    this.postService.getPostOfUser(this.user_name, params, this.userService.getSessionId()).subscribe(
      (res) => {
        this.listPosts = res.data.posts;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.error = true;
        this.isLoading = false;
      }
    );

    this.postService.getUserByUsername(this.user_name, this.userService.getSessionId()).subscribe(
      (res) => {
        this.user = res.data.user;
      },
      (err: any) => {
        this.error = true;
        console.log(err);
      }
    );
  }

}
