import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { ApiParams } from 'models/api.model';
import Category from 'models/category.model';
import { PostModel } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { ConfirmationService, Message, TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { PostsService } from 'services/posts.service';
import { APPCONSTANT } from 'utils/appConstant';
import { convertArrayToNested, convertToSlug, getDifferenceObject, removeChildrenByLevel } from 'utils/commonFunction';

@Component({
  selector: 'app-EditPostPage',
  templateUrl: './EditPostPage.component.html',
  styleUrls: ['./EditPostPage.component.scss']
})
export class EditPostPageComponent implements OnInit {

  MAX_FILE_SIZE: number;

  isLoading: boolean = false;
  isLoadingSubmit: boolean = false;

  editing: boolean = false;

  id: number;

  postSlug: string;

  error: boolean = false;

  post: PostModel;

  editPost: PostModel;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  short_content: string = '';
  time_read: number;
  content_type: string = 'MARKDOWN';
  contentMdComplied: string;

  listCategory: Category[];
  selectedCategory: TreeNode[] = [];
  categories: Category[];

  listTags: Tag[] = [];
  listFilterTags: Tag[] = [];

  uploadSubscription: Subscription;

  getPostSubscription: Subscription;

  modifyPostSubscription: Subscription;

  getTagSubscription: Subscription;

  getCategorySubcription: Subscription;

  message: Message[] = [];

  @ViewChild('fileUpload') fileUpload: FileUpload;

  isSelectFile: boolean = false;
  thumbnailPreview: any;

  constructor(
    private translate: TranslateService,
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private pageTitle: Title
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.MAX_FILE_SIZE = this.authService.getConfig()?.UploadFileConfig?.max_length_of_single_file || APPCONSTANT.MAX_FILE_SIZE;

    this.getPostDetail();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return !this.editing;
  }

  getPostDetail() {
    this.postService.getPostById(this.id).subscribe(
      (res) => {
        this.pageTitle.setTitle(this.translate.instant('editPost.pageTitle', { title: res.data.post.title }));
        this.isLoading = false;
        this.postSlug = res.data.post.slug;

        this.post = {
          title: res.data.post.title,
          content: res.data.post.content,
          content_type: res.data.post.content_type,
          short_content: res.data.post.short_content,
          thumbnail: res.data.post.thumbnail,
          time_read: res.data.post.time_read,
          is_private: res.data.post.status === 'Private',
          categories: res.data.post.categories.map(item => {
            return item.name;
          }),
          tags: res.data.post.tags.map(item => {
            return item.tag;
          })
        };

        this.slug = convertToSlug(res.data.post.title);
        this.categories = res.data.post.categories;
        this.listTags = res.data.post.tags;
        this.content = this.post.content;
        this.short_content = this.post.short_content;
        this.title = this.post.title;
        this.thumbnail = this.post.thumbnail;
        this.thumbnailPreview = this.post.thumbnail;
        this.time_read = this.post.time_read;
        this.content_type = this.post.content_type;

        this.getCategory();
      },
      () => {
        this.isLoading = false;
        this.error = true;
      }
    );
  }

  getCategory() {
    this.isLoading = true;
    this.postService.getListCategories().subscribe(
      (res) => {
        this.isLoading = false;
        const list = res?.data.categories.map((item: Category) => {
          return {
            ...item,
            label: item.display_name,
            data: item,
            expandedIcon: '',
            collapsedIcon: '',
          } as TreeNode;
        })
        let result = convertArrayToNested(list);
        this.listCategory = removeChildrenByLevel(result, 2);

        //filter selected category to list category
        this.listCategory.forEach(item => {
          this.categories.forEach(category => {
            if (item.name === category.name) {
              this.selectedCategory.push(item as TreeNode);
            }
          })
        });

        this.editPost = this.post;
        this.updateEditPost(false);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onChangeTags(event) {
    this.updateEditPost();
  }

  onFilterTag(event) {
    if (this.getTagSubscription) {
      this.getTagSubscription.unsubscribe();
    }

    const params: ApiParams = {
      search_term: event.query,
      start: 0,
      size: 24
    }

    this.getTagSubscription = this.postService.getListTags(params).subscribe((res) => {
      if (res.data?.tags?.length === 0) {
        this.listFilterTags = [
          {
            id: '',
            tag: event.query.toLowerCase().trim().replace(/\s/g, '-'),
            name: event.query.toLowerCase().trim().replace(/\s/g, '-'),
            is_new: true
          }
        ];
      }
      else {
        this.listFilterTags = res?.data.tags;
        let check = false;
        this.listFilterTags.map(item => {
          if (item.tag === event.query.toLowerCase().trim().replace(/\s/g, '-')) {
            check = true;
          }
          item.is_new = false
        });

        if (!check) {
          this.listFilterTags.unshift({
            id: '',
            tag: event.query.toLowerCase().trim().replace(/\s/g, '-'),
            name: event.query.toLowerCase().trim().replace(/\s/g, '-'),
            is_new: true
          });
        }
      }
    });
  }

  updateEditPost(edit = true) {
    if (edit) {
      this.editing = true;
    }
    else {
      this.editing = false;
    }
    this.editPost = {
      content: this.content,
      short_content: this.short_content,
      title: this.title,
      thumbnail: this.thumbnail,
      time_read: this.time_read,
      content_type: this.content_type,
      categories: this.selectedCategory.map(item => {
        return item.data.name;
      }),
      tags: this.listTags.map(item => {
        return item.tag;
      }),
      is_private: this.post.is_private
    };

    const diff = getDifferenceObject(this.post, this.editPost);
    this.editing = !_.isEqual(diff, {});
  }

  onChangeContentMd(event) {
    this.updateEditPost();
  }

  onSelectCategory() {
    this.updateEditPost();
  }

  myUploader(event) {
    this.isLoadingSubmit = true;
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    this.uploadSubscription = this.postService.upLoadImage('post', event.files[0]).subscribe(
      (res) => {
        this.editPost.thumbnail = res.data.url;
        this.thumbnailPreview = res.data.url;
        this.thumbnail = res.data.url;
        this.isSelectFile = false;
        this.updateEditPost();
        const data = getDifferenceObject(this.post, this.editPost) as any;
        this.modifyPost(data);
      },
      () => {
        this.message = [{ severity: 'error', summary: 'Error', detail: this.translate.instant('message.uploadfail') }];
      }
    );
  }

  onChangeTitle(event) {
    this.editPost.title = event;
    this.slug = convertToSlug(event);
    this.updateEditPost();
  }

  onChangeShortContent(event) {
    this.editPost.short_content = event;
    this.updateEditPost();
  }

  onChangeTimeRead(event) {
    this.editPost.time_read = event;
    this.updateEditPost();
  }

  onSelectThumbnail(event) {
    this.isSelectFile = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.files[0]);
    reader.onload = (_event) => {
      this.thumbnailPreview = reader.result as string;
    }
  }

  onClearSelect() {
    this.isSelectFile = false;
    this.thumbnailPreview = null;
  }

  onClickDiscard() {
    this.confirmationService.confirm({
      key: 'editPostDialog',
      message: this.translate.instant('editPost.dialog.discard'),
      header: this.translate.instant('editPost.dialog.title'),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.editing = false;
        this.editPost = this.post;
        this.updateEditPost(false);
      }
    });
  }

  checkValid(): boolean {
    let result = true;
    if (!this.content.trim()) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.translate.instant('editPost.valid.content')
      }]
      result = false;
    }
    if (!this.title.trim()) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.translate.instant('editPost.valid.title')
      }];
      result = false;
    }
    if (!this.short_content.trim()) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.translate.instant('editPost.valid.shortContent')
      }];
      result = false;
    }
    // if (this.validThumbnail) {
    //   message.push({
    //     severity: 'error',
    //     summary: '',
    //     detail: this.textTranslate.valid.thumbnail
    //   })
    //   result = false;
    // }
    if (this.selectedCategory.length === 0) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.translate.instant('editPost.valid.category')
      }];
      result = false;
    }
    if (this.time_read > 50 && this.time_read < 1) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.translate.instant('editPost.valid.timeRead')
      }];
      result = false;
    }
    // if (this.listTagModel.length == 0) {
    //   message.push({
    //     severity: 'error',
    //     summary: '',
    //     detail: this.textTranslate.valid.tag
    //   })
    //   result = false;
    // }

    return result;
  }

  onClickPublish() {
    if (!this.checkValid()) {
      return;
    }
    this.confirmationService.confirm({
      key: 'editPostDialog',
      message: this.translate.instant('editPost.dialog.publish'),
      header: this.translate.instant('editPost.dialog.title'),
      acceptLabel: this.translate.instant('editPost.dialog.ok'),
      rejectLabel: this.translate.instant('editPost.dialog.cancel'),
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        window.scrollTo(0, 0);
        if (this.isSelectFile) {
          this.fileUpload.upload();
        }
        else {
          const data = getDifferenceObject(this.post, this.editPost) as any;
          this.modifyPost(data);
        }
      }
    });
  }

  modifyPost(diffData) {
    if (_.isEmpty(diffData)) {
      return;
    }
    this.isLoadingSubmit = true;
    if (this.modifyPostSubscription) {
      this.modifyPostSubscription.unsubscribe();
    }

    this.modifyPostSubscription = this.postService.modifyPostByPostId(this.id, diffData).subscribe(
      (res) => {
        this.isLoadingSubmit = false;
        this.editing = false;
        this.message = [{ severity: 'success', summary: '', detail: this.translate.instant('message.modifyPostSuccess') }];
      },
      () => {
        this.isLoadingSubmit = false;
        this.message = [{ severity: 'error', summary: '', detail: this.translate.instant('message.modifyPostFail') }];
      }
    );
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (this.getPostSubscription) {
      this.getPostSubscription.unsubscribe();
    }
    if (this.modifyPostSubscription) {
      this.modifyPostSubscription.unsubscribe();
    }
    if (this.getTagSubscription) {
      this.getTagSubscription.unsubscribe();
    }
    if (this.getCategorySubcription) {
      this.getCategorySubcription.unsubscribe();
    }
  }

}
