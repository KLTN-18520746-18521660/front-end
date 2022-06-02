import { PostsService } from 'services/posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService } from 'primeng/api';
import Post from 'models/post.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { postsMockData } from 'shared/mockData/postsMockData';
import { TranslateService } from '@ngx-translate/core';
import { mapActionWithPost, convertDateTime } from 'utils/commonFunction';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-recommend-post-card',
  templateUrl: './recommend-post-card.component.html',
  styleUrls: ['./recommend-post-card.component.scss']
})
export class RecommendPostCardComponent implements OnInit {

  @Input() loading: boolean = false;

  @Input() showAction: boolean = true;

  @Input() post: Post = postsMockData[0];

  @Input() isSmall: boolean = true;

  @Input() showStatus: boolean = false;

  @Input() showMenu: boolean = false;

  @Output() deletePost: EventEmitter<number> = new EventEmitter();

  menuitem: MenuItem[] = [];

  status: string;

  isLoading: boolean = false;

  displayDialog: boolean = false;

  changeStatusSubscription: Subscription;

  deletePostSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private userService: UserService,
    private postsService: PostsService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.loading) {
      return;
    }
    if (this.showMenu) {
      this.menuitem = this.menuitem = [
        ...(this.userService.isAuthenticated && this.userService.user.user_name === this.post.owner.user_name ? [{
          id: 'edit',
          label: this.translate.instant('card.recommnedCard.menu.edit'),
          icon: 'pi pi-pencil',
          command: () => {
            if (this.post.id) {
              this.router.navigate(['/edit', this.post.id]);
            }
          },
        },
        {
          id: 'delete',
          label: this.translate.instant('card.recommnedCard.menu.delete'),
          icon: 'pi pi-trash',
          command: () => {
            this.onDeletePost();
          }
        },
        ...(this.post.status === 'Approved' || this.post.status === 'Private' ? [{
          id: 'status',
          label: this.translate.instant('card.recommnedCard.menu.status'),
          icon: 'pi pi-cog',
          command: () => {
            this.displayDialog = true;
          }
        }] : [])
        ] : [])
      ];
    }
    this.post = {
      ...this.post,
      fromNow: {
        created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, false, true),
        approved: convertDateTime(this.post.approved_timestamp, this.translate.currentLang, false, true),
      }
    };

    this.status = this.post.status;

    this.post.mapAction = mapActionWithPost(this.post.actions || []);
  }

  onClickChangsStatus() {
    if (this.post.status === 'Approved') {
      this.changeStatus('private');
    } else {
      this.changeStatus('publish');
    }
  }

  changeStatus(type: 'private' | 'publish') {
    this.isLoading = true;
    this.loading = true;

    if (this.changeStatusSubscription) {
      this.changeStatusSubscription.unsubscribe();
    }

    this.changeStatusSubscription = this.postsService.changeStatusPost(type, this.post.id).subscribe(
      (res) => {
        this.displayDialog = false;
        this.loading = false;
        this.isLoading = false;
        this.post.status = "Pending";
      }
    );
  }

  onDeletePost() {
    this.confirmationService.confirm({
      key: 'recommendCard' + this.post.id,
      message: this.translate.instant('card.recommnedCard.deletePost.description', { title: this.post.title }),
      header: this.translate.instant('card.recommnedCard.deletePost.title'),
      acceptLabel: this.translate.instant('card.recommnedCard.deletePost.ok'),
      rejectLabel: this.translate.instant('card.recommnedCard.deletePost.cancel'),
      rejectButtonStyleClass: 'p-button-outlined',
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-trash',
      accept: () => {
        this.loading = true;

        if (this.deletePostSubscription) {
          this.deletePostSubscription.unsubscribe();
        }

        this.deletePostSubscription = this.postsService.deletePostByPostId(this.post.id).subscribe(
          (res) => {
            this.deletePost.emit(this.post.id);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.changeStatusSubscription) {
      this.changeStatusSubscription.unsubscribe();
    }
    if (this.deletePostSubscription) {
      this.deletePostSubscription.unsubscribe();
    }
  }

}
