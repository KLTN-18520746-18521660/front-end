import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import md from 'markdown-it';
import { ApiParams } from 'models/api.model';
import { PostModel } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { AnimationOptions } from 'ngx-lottie';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { ConfirmationService, MenuItem, Message, MessageService, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { APPCONSTANT, STORAGE_KEY } from 'utils/appConstant';
import { convertArrayToNested, convertToSlug, removeChildrenByLevel } from 'utils/commonFunction';

@Component({
  selector: 'app-CreatePostPage',
  templateUrl: './CreatePostPage.component.html',
  styleUrls: ['./CreatePostPage.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class CreatePostPageComponent implements OnInit {

  isLoading: boolean = false;

  content: string = '';

  markdownIt: any;
  contentMd: string = '';
  contentMdComplied: string = '';

  short_content: string = '';

  types = ['HTML', 'Markdown'];
  selectedEditorType: 'HTML' | 'Markdown';

  title: string = '';
  slug: string = '';

  thumbnail: string = '';
  validThumbnail: boolean = true;

  listCategory: TreeNode[] = [];
  selectedCategory: TreeNode[] = [];

  listTags: Tag[] = [];
  listFilterTags: Tag[] = [];

  time_read: number = 5;

  draft: object = {
    type: '',
    title: '',
    short_content: '',
    thumbnail: '',
    tags: [],
    HTML: '',
    Markdown: '',
    time_read: 5,
    step: 0,
    private: false
  }

  ref: DynamicDialogRef;

  textTranslate: {
    confirmation?: string,
    publish?: string,
    login?: string,
    discard?: string,
    popup?: any;
    valid?: any;
  };

  getTagSubscription: Subscription;

  uploadSubcription: Subscription;
  getCategorySubscription: Subscription;
  publishSubscription: Subscription;
  isSelectThumbnail: boolean;
  thumbnailPreview: any;
  thumbnailFile: File;

  message: Message[] = [];

  steps: MenuItem[];

  activeStep: number = 0;

  options: AnimationOptions = {
    path: '/assets/jsons/publish-article.json',
  };

  MAX_FILE_SIZE: number;

  private: boolean = false;
  statusOptions = [
    { label: this.translate.instant('createPost.status.public'), value: false, icon: 'pi pi-users' },
    { label: this.translate.instant('createPost.status.private'), value: true, icon: 'pi pi-lock' },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private postsService: PostsService,
    public linkifyService: NgxLinkifyjsService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    this.markdownIt = md();

    this.steps = [
      {
        label: this.translate.instant('createPost.step.start'),
        command: () => {
          this.activeStep = 0;
        }
      },
      {
        label: this.translate.instant('createPost.step.title'),
        command: () => {
          this.activeStep = 1;
        }
      },
      {
        label: this.translate.instant('createPost.step.content'),
        command: () => {
          this.activeStep = 2;
        }
      }
    ]

    this.MAX_FILE_SIZE = this.authService.getConfig().UploadFileConfig.max_length_of_single_file || APPCONSTANT.MAX_FILE_SIZE;

    this.loadDraft();

    this.getCategory();
    this.onChangeTitle(this.title);
    this.textTranslate = this.translate.instant('createPost.textTranslate')
  }

  onClickBack() {
    if (this.activeStep > 0) {
      this.activeStep--;
      this.draft['step'] = this.activeStep;
      this.saveDraft();
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }

  onClickNext() {
    if (this.activeStep < this.steps.length - 1) {
      this.activeStep++;
      this.draft['step'] = this.activeStep;
      this.saveDraft();
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }

  getCategory() {
    this.isLoading = true;
    this.getCategorySubscription = this.postsService.getListCategories().subscribe(
      (res: any) => {
        this.isLoading = false;
        const list = res?.data.categories.map(item => {
          return {
            ...item,
            label: item.display_name,
            data: item,
            expandedIcon: '',
            collapsedIcon: '',
          }
        })
        let result = convertArrayToNested(list);
        this.listCategory = removeChildrenByLevel(result, 2);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  // onChange content function

  onChangeContent(event) {
    this.draft[this.selectedEditorType] = event;
    this.saveDraft();
  }

  onChangeContentMd(event) {
    this.contentMdComplied = this.markdownIt.render(event || '');
    // this.convertToShortContent();
    this.draft[this.selectedEditorType] = event;
    this.saveDraft();
  }

  onChangeTitle(event) {
    if (event && event.length > 200) {
      event = event.slice(0, 200);
    }
    this.draft['title'] = event;
    this.slug = convertToSlug(event || '');
    this.saveDraft();
  }

  onChangeShortContent(event) {
    if (event && event.length > 200) {
      event = event.slice(0, 200);
    }
    this.draft['short_content'] = event;
    this.saveDraft();
  }

  onChangeThumbnail(event) {
    this.draft['thumbnail'] = event;
    this.saveDraft();
  }

  onChangeTimeRead(event) {
    this.draft['time_read'] = event;
    this.saveDraft();
  }

  onChangeStatus(event) {
    this.draft['private'] = event.value;
    this.saveDraft();
  }

  onSelectThumbnail(event) {
    this.isSelectThumbnail = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.files[0]);
    reader.onload = (_event) => {
      this.thumbnailPreview = reader.result as string;
    }
    this.thumbnailFile = event.files[0];
  }

  onClearSelect() {
    this.isSelectThumbnail = false;
    this.thumbnailPreview = null;
    this.thumbnailFile = null;
  }

  loadDraft() {
    const draft = localStorage.getItem(STORAGE_KEY.POST_DRAFT);
    if (draft) {
      this.draft = JSON.parse(draft);
      this.selectedEditorType = this.draft['type'] || 'HTML';
      this.thumbnail = this.draft['thumbnail'] || null;
      this.thumbnailPreview = this.thumbnail ? this.thumbnail : null;
      this.title = this.draft['title'] || null;
      this.short_content = this.draft['short_content'] || null;
      this.listTags = this.draft['tags'] || [];
      this.content = this.draft['HTML'] || null;
      this.contentMd = this.draft['Markdown'] || null;
      this.contentMdComplied = this.markdownIt.render(this.contentMd || '');
      this.time_read = this.draft['time_read'] || 5;
      this.slug = convertToSlug(this.title || '');
      this.activeStep = this.draft['step'] || 0;
      this.private = this.draft['private'] || false;
      // this.convertToShortContent();
    }
    else {
      this.content = null;
      this.contentMd = null;
      this.thumbnail = null;
      this.short_content = null;
      this.listTags = [];
      this.validThumbnail = true;
      this.title = null;
      this.selectedEditorType = 'HTML';
      this.time_read = 5;
      this.activeStep = 0;
      this.private = false;

      this.draft = {
        type: null,
        title: null,
        short_content: null,
        tags: [],
        thumbnail: null,
        HTML: null,
        Markdown: null,
        time_read: 5,
        step: 0,
        private: false
      }
      this.saveDraft();
    }
  }

  saveDraft() {
    localStorage.setItem(STORAGE_KEY.POST_DRAFT, JSON.stringify(this.draft));
  }

  // convertToShortContent() {
  //   let temp: string;
  //   try {
  //     if (this.selectedEditorType === 'Markdown') {
  //       temp = this.contentMdComplied
  //     }
  //     else {
  //       temp = this.content;
  //     }
  //     this.short_content = (temp ? temp : '')
  //       .replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
  //       .replace(/(&#\d+;)+/g, ' ')
  //       .replace(/\n+/g, '.')
  //       .slice(0, 190);

  //   } catch (error) {
  //     this.messageService.add({ key: 'createPostToast', severity: 'error', summary: 'Markdown Error', detail: 'Error when complie markdown.' });
  //   }
  // }

  onChangeType(event: any) {
    this.draft['type'] = event.value;
    this.selectedEditorType = event.value;
    // this.convertToShortContent();
    this.saveDraft();
  }

  onClickSaveDraft() {
    this.saveDraft();
    this.messageService.add({ key: 'createPostToast', severity: 'success', summary: 'Success', detail: 'Save draft successfully' });
  }

  onChangeTags(event) {
    this.draft['tags'] = event;
    this.saveDraft();
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

    this.getTagSubscription = this.postsService.getListTags(params).subscribe((res) => {
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
        this.listFilterTags.map(item => item.is_new = false);
      }
    });
  }

  onChangeSelectCategory(event) {
    console.log(this.selectedCategory)
    // this.selectedCategory = event.value;
  }

  onSelectCategory() {
    // console.log(this.selectedCategory);
  }

  checkValidPost() {
    let result = true;
    if (this.selectedEditorType === 'HTML' && this.content.toString().length == 0) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.content
      }];
      result = false;
    }
    else if (this.selectedEditorType === 'Markdown' && this.contentMd.toString().length == 0) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.content
      }]
      result = false;
    }
    if (!this.title) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.title
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
    if (this.selectedCategory.length == 0) {
      this.message = [...this.message, {
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.category
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
    console.log(this.message)
    return result;
  }

  onClickDiscard() {
    this.confirmationService.confirm({
      key: 'createPostDialog',
      message: this.textTranslate.discard,
      header: this.textTranslate.confirmation,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.activeStep = 0;
        localStorage.removeItem(STORAGE_KEY.POST_DRAFT);
        this.loadDraft();
      }
    });
  }

  uploadImage() {
    this.isLoading = true;
    this.uploadSubcription = this.postsService.upLoadImage('post', this.thumbnailFile).subscribe(
      (res) => {
        this.thumbnail = res.data.url;
        this.draft['thumbnail'] = this.thumbnail;
        this.saveDraft();
        this.publishPost();
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        this.isLoading = false;
      }
    );
  }

  onClickPublish() {
    this.message = [];
    if (!this.userService.isAuthenticated) {
      console.log(this.textTranslate.popup)
      this.appUser.openLoginPopup(
        this.textTranslate.popup.message,
        'warn',
        this.textTranslate.popup.header,
        this.textTranslate.popup.footer,
      );
    }
    else if (!this.checkValidPost()) {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      // this.messageService.addAll(this.checkValidPost().message);
    }
    else {
      this.confirmationService.confirm({
        key: 'createPostDialog',
        message: this.textTranslate.publish,
        header: this.textTranslate.confirmation,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
          if (this.isSelectThumbnail) {
            this.uploadImage();
          }
          else {
            this.publishPost();
          }
        }
      });
    }
  }

  publishPost() {
    this.isLoading = true;
    let post: PostModel = {
      title: this.title,
      thumbnail: this.thumbnail,
      content: this.selectedEditorType === 'HTML' ? this.content : this.contentMd,
      short_content: this.short_content ? this.short_content.slice(0, 180) : null,
      content_type: this.selectedEditorType.toUpperCase(),
      time_read: this.time_read,
      categories: this.selectedCategory.map((item: any) => {
        return item.slug;
      }),
      tags: this.listTags.map(item => {
        return item.tag;
      }),
      is_private: this.private,
    };

    post = _.omitBy(post, _.isNull);

    this.publishSubscription = this.postsService.publishPost(post).subscribe(
      () => {
        this.isLoading = false;

        // discard draft
        localStorage.removeItem(STORAGE_KEY.POST_DRAFT);
        this.loadDraft();

        this.messageService.add({
          key: 'createPostToast',
          severity: 'success',
          summary: '',
          detail: this.translate.instant('message.publishpost'),
          life: APPCONSTANT.TOAST_TIMEOUT
        });
      },
      (err) => {
        this.isLoading = false;
        this.messageService.add({
          key: 'createPostToast',
          severity: 'error',
          summary: err.error,
          detail: err.message,
          life: APPCONSTANT.TOAST_TIMEOUT
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.getTagSubscription) {
      this.getTagSubscription.unsubscribe();
    }
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
    if (this.getCategorySubscription) {
      this.getCategorySubscription.unsubscribe();
    }
    if (this.publishSubscription) {
      this.publishSubscription.unsubscribe();
    }
  }
}
