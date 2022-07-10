import { mapActionWithUser } from 'utils/commonFunction';
import { TranslateService } from '@ngx-translate/core';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from 'services/posts.service';
import Post from 'models/post.model';
import User from 'models/user.model';
import { ReportSendModel, ReportType } from 'models/report.model';

@Component({
  selector: 'app-UserInfoPage',
  templateUrl: './UserInfoPage.component.html',
  styleUrls: ['./UserInfoPage.component.scss']
})
export class UserInfoPageComponent implements OnInit {
  error: boolean = false;

  user_name: string = '';
  user: User;

  isLoadingPost: boolean = true;
  isLoadingUser: boolean = true;

  listPosts: Post[] = [];

  getUserSubscription: Subscription;

  getPostSubscription: Subscription;

  showButtonAction: boolean = true;

  constructor(
    private postService: PostsService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private appUser: AppUserComponent,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.user_name = params.username;
        this.getUserInfo();
        this.getPosts();
        if (this.userService.user && this.userService.user.user_name === this.user_name) {
          this.showButtonAction = false;
        }
      }
    );
  }

  getUserInfo() {
    this.isLoadingUser = true;
    const params = {
    }

    this.getUserSubscription = this.postService.getPostOfUser(this.user_name, params).subscribe(
      (res) => {
        this.listPosts = res.data.posts;
        this.isLoadingPost = false;
      },
      (err) => {
        this.error = true;
        this.isLoadingPost = false;
      }
    );
  }

  getPosts() {
    this.isLoadingPost = true;
    this.getPostSubscription = this.postService.getUserByUsername(this.user_name).subscribe(
      (res) => {
        this.user = res.data.user;
        this.user.mapAction = this.user.mapAction = mapActionWithUser(res.data.user.actions || []);
        this.isLoadingUser = false;
      },
      (err) => {
        this.error = true;
        this.isLoadingUser = false;
      }
    );
  }

  onClickReport() {
    if (!this.userService.getSessionId()) {
      this.appUser.openLoginPopup();
      return;
    }
    const text = this.translate.instant('report');
    const data: ReportSendModel = {
      post_slug: null,
      report_type: 'user',
      comment_id: null,
      user_name: this.user_name,
    };
    this.appUser.openReportPopup(data, text.title, null);
  }

  ngOnDestroy() {
    if (this.getPostSubscription) {
      this.getPostSubscription.unsubscribe();
    }
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }
  }

}
