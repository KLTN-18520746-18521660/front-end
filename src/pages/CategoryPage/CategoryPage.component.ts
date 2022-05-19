import { APPCONSTANT } from 'utils/appConstant';
import { ApiParams } from './../../models/api.model';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { UserService } from 'services/user.service';
import { mapActionWithCategory } from './../../utils/commonFunction';
import { PostsService } from 'services/posts.service';
import { Subscription } from 'rxjs';
import Post from 'models/post.model';
import Category from 'models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActionType } from 'utils/apiConstant';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-CategoryPage',
  templateUrl: './CategoryPage.component.html',
  styleUrls: ['./CategoryPage.component.scss']
})
export class CategoryPageComponent implements OnInit {

  categoryID: string;

  category: Category;

  error: boolean = false;

  listPosts: Post[];

  isLoading: boolean = false;

  isLoadingPost: boolean = false;

  isLoadingCategory: boolean = false;

  isLoadingMore: boolean = false;

  isLoadingAction: boolean = false;

  getCategorySubcription: Subscription;

  getPostSubcription: Subscription;

  actionSubcription: Subscription;

  currentPage: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private appUser: AppUserComponent,
    private messageService: MessageService,
    private translate: TranslateService,
    private title: Title,
    private router: Router
  ) { }

  ngOnInit() {
    this.categoryID = this.activatedRoute.snapshot.params.id || null;
    if (this.categoryID) {
      this.getCategoryDetail(this.categoryID);
    }

    this.currentPage = this.activatedRoute.snapshot.queryParams.page || 1;
    this.getPosts(this.currentPage);
  }

  getCategoryDetail(id: string) {
    this.isLoadingCategory = true;
    this.getCategorySubcription = this.postService.getCategoryDetail(id).subscribe(
      (res) => {
        this.category = res.data.category;
        this.isLoadingCategory = false;

        this.title.setTitle(this.category.display_name);

        this.category.mapAction = mapActionWithCategory(this.category.actions);
      },
      () => {
        this.isLoadingCategory = false;
        this.error = true;
      }
    );
  }

  getPosts(page: number) {
    this.isLoadingPost = true;

    if (this.getPostSubcription) {
      this.getPostSubcription.unsubscribe();
    }

    const params: ApiParams = {
      // categories: this.category.name,
      start: (page - 1) * APPCONSTANT.DEFAULT_PAGE_SIZE,
      size: APPCONSTANT.DEFAULT_PAGE_SIZE,
    }

    this.getPostSubcription = this.postService.getPostsByType('trending', {}).subscribe(
      (res) => {
        this.listPosts = res.data.posts;
        this.isLoadingPost = false;
      },
      () => {
        this.isLoading = false;
        this.error = true;
      }
    );
  }

  onPaginate(event) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      ...(event.page == 0 ? { queryParams: { page: null } } : { queryParams: { page: event.page } }),
    });

    // this.currentPage = event.page + 1;
    // this.getPosts(this.currentPage);
  }

  onClickFollow() {
    if (this.category.mapAction.follow) {
      this.actionWithUser('unfollow');
    }
    else {
      this.actionWithUser('follow');
    }
  }

  actionWithUser(action: ActionType) {
    const sessionId = this.userService.getSessionId();
    this.isLoadingAction = true;
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
    if (sessionId) {
      this.actionSubcription = this.postService.sendActionWithCategory(this.category.name, action).subscribe(
        () => {
          this.isLoadingAction = false;
          if (action === 'follow') {
            this.category.mapAction.follow = true;
          }
          else if (action === 'unfollow') {
            this.category.mapAction.follow = false;
          }
        },
        () => {
          this.messageService.add({ severity: 'error', summary: '', detail: this.translate.instant('message.error') });
          this.isLoadingAction = false;
        }
      );
    }
    else {
      this.appUser.openLoginPopup();
      this.isLoading = false;
      return;
    }
  }

  ngOnDestroy() {
    if (this.getCategorySubcription) {
      this.getCategorySubcription.unsubscribe();
    }
    if (this.getPostSubcription) {
      this.getPostSubcription.unsubscribe();
    }
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
  }
}
