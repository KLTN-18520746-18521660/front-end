import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { CreatePostModel } from 'models/post.model';
import Tag from 'models/tag.model';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { MarkdownService } from 'ngx-markdown';
import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { ConfirmationService, Message, MessageService, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { UserService } from 'services/user.service';
import { APPCONSTANT, STORAGE_KEY } from 'utils/appConstant';
import { convertArrayToNested, convertToSlug, removeChildrenByLevel } from 'utils/commonFunction';
import { ApiParams } from './../../models/api.model';

@Component({
  selector: 'app-CreatePostPage',
  templateUrl: './CreatePostPage.component.html',
  styleUrls: ['./CreatePostPage.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class CreatePostPageComponent implements OnInit {

  isLoading: boolean = false;

  content: string = '';

  contentMd: string = '';

  short_content: string = '';

  types = ['HTML', 'Markdown'];
  selectedEditorType: 'HTML' | 'Markdown';

  title: string = '';
  slug: string = '';

  thumbnail: string = '';
  validThumbnail: boolean = true;

  listCategory: TreeNode[] = [];
  selectedCategory: TreeNode[] = [];

  listTagModel: Tag[] = [];
  listTags: Tag[] = [];
  listFilterTags: Tag[] = [];

  tags: string[] = [];

  time_read: number = 5;

  draft: object = {
    type: '',
    title: '',
    thumbnail: '',
    tags: [],
    HTML: '',
    Markdown: '',
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

  subscription: Subscription;

  uploadSubcription: Subscription;
  isSelectThumbnail: boolean;
  thumbnailPreview: any;
  @ViewChild('fileUpload') fileUpload: FileUpload;

  constructor(
    private userService: UserService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private postsService: PostsService,
    public linkifyService: NgxLinkifyjsService,
    private markdownService: MarkdownService,
    private appUser: AppUserComponent
  ) { }

  ngOnInit() {
    this.loadDraft();
    this.translate.get('createPost.textTranslate').subscribe(res => {
      this.textTranslate = res;
    });

    this.getCategory();
    this.onChangeTitle(this.title);
  }

  handleChangeTabView(event) {
    console.log(event);
  }

  getCategory() {
    this.postsService.getListCategories().subscribe((res: any) => {
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
    });
  }

  getListTags() {
    const params: ApiParams = {
      search_term: '',
      start: 0,
      size: 20
    }
    this.postsService.getListTags(params).subscribe((res: any) => {
      this.listTags = res?.data.tags;
      this.listFilterTags = this.listTags;
    });
  }

  // onChange content function
  onTextChange(event) {
    console.log(event);
    this.short_content = event?.textValue;
  }

  onChangeContent(event) {
    console.log(event);
    this.draft[this.selectedEditorType] = event;
    this.saveDraft();
  }

  onChangeContentMd(event) {
    this.convertToShortContent();
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

  onChangeThumbnail(event) {
    this.validThumbnail = this.linkifyService.test(event);
    if (this.validThumbnail) {
      this.draft['thumbnail'] = event;
    }
    else {
      this.draft['thumbnail'] = '';
    }
    this.saveDraft();
  }

  myUploader(event) {
    console.log(event);
    this.isLoading = true;
    this.uploadSubcription = this.postsService.upLoadImage('post', event.files[0]).subscribe(
      (res) => {
        this.thumbnail = res.data.url;
        this.draft['thumbnail'] = this.thumbnail;
        this.saveDraft();
        this.publishPost();
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  onSelectThumbnail(event) {
    this.isSelectThumbnail = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.files[0]);
    reader.onload = (_event) => {
      this.thumbnailPreview = reader.result as string;
    }
    // this.user.avatar = event.files[0];
  }

  onClearSelect() {
    this.isSelectThumbnail = false;
    this.thumbnailPreview = null;
  }

  onChangeMoreTag(event) {
    const list = this.listTagModel.map(item => {
      return item.tag;
    })
    this.tags = this.tags.map(item => {
      return item.toLowerCase().trim().replace(/\s/g, '');
    })
    this.tags = _.difference(this.tags, list);
    this.draft['tags'] = this.tags;
    this.saveDraft();
  }

  loadDraft() {
    const draft = localStorage.getItem(STORAGE_KEY.POST_DRAFT);
    if (draft) {
      this.draft = JSON.parse(draft);
      this.selectedEditorType = this.draft['type'] || 'HTML';
      this.thumbnail = this.draft['thumbnail'] || null;
      this.thumbnailPreview = this.thumbnail ? this.thumbnail : null;
      this.title = this.draft['title'] || null;
      this.tags = this.draft['tags'] || [];
      this.content = this.draft['HTML'] || null;
      this.contentMd = this.draft['Markdown'] || null;
      this.convertToShortContent();
    }
    else {
      this.content = null;
      this.contentMd = null;
      this.thumbnail = null;
      this.tags = [];
      this.validThumbnail = true;
      this.title = null;
      this.selectedEditorType = 'HTML';

      this.draft = {
        type: null,
        title: null,
        tags: [],
        thumbnail: null,
        HTML: null,
        Markdown: null,
      }
      this.saveDraft();
    }
  }

  saveDraft() {
    localStorage.setItem(STORAGE_KEY.POST_DRAFT, JSON.stringify(this.draft));
  }

  convertToShortContent() {
    let temp: string;
    try {
      if (this.selectedEditorType === 'Markdown') {
        temp = this.markdownService.compile(this.contentMd.toString(), true)
      }
      else {
        temp = this.content;
      }
      this.short_content = (temp ? temp : '')
        .replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
        .replace(/(&#\d+;)+/g, ' ')
        .slice(0, 180);
    } catch (error) {
      console.log(error);
      this.messageService.add({ key: 'createPostToast', severity: 'error', summary: 'Markdown Error', detail: 'Error when complie markdown.' });
    }

  }

  onChangeType(event: any) {
    this.draft['type'] = event.value;
    this.selectedEditorType = event.value;
    this.convertToShortContent();
    this.saveDraft();
  }

  onClickSaveDraft() {
    this.saveDraft();
    this.messageService.add({ key: 'createPostToast', severity: 'success', summary: 'Success', detail: 'Save draft successfully' });
  }

  onFilterTag(event) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    let filtered: any[] = [];
    let query = event.query;

    this.subscription = this.postsService.getListTags(query).subscribe((res: any) => {
      filtered = res?.data.tags;
      this.listFilterTags = filtered;
    });
  }

  onChangeSelectCategory(event) {
    console.log(this.selectedCategory)
    // this.selectedCategory = event.value;
  }

  onSelectCategory() {
    console.log(this.selectedCategory);
  }

  checkValidPost() {
    let result = true;
    let message: Message[] = [];
    if (this.selectedEditorType === 'HTML' && this.content.toString().length == 0) {
      message.push({
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.content
      })
      result = false;
    }
    else if (this.selectedEditorType === 'Markdown' && this.contentMd.toString().length == 0) {
      message.push({
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.content
      })
      result = false;
    }
    if (this.title.length == 0) {
      message.push({
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.title
      })
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
      message.push({
        severity: 'error',
        summary: '',
        detail: this.textTranslate.valid.category
      })
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

    return {
      isvalid: result,
      message: message
    };
  }

  onClickPublish() {
    if (!this.userService.isAuthenticated) {
      console.log(this.textTranslate.popup)
      this.appUser.openLoginPopup(
        this.textTranslate.popup.message,
        'warn',
        this.textTranslate.popup.header,
        this.textTranslate.popup.footer,
      );
    }
    else if (!this.checkValidPost().isvalid) {
      this.messageService.addAll(this.checkValidPost().message);
    }
    else {
      this.confirmationService.confirm({
        key: 'createPostDialog',
        message: this.textTranslate.publish,
        header: this.textTranslate.confirmation,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          if (this.isSelectThumbnail) {
            this.fileUpload.upload();
          }
          else {
            this.publishPost();
          }
        }
      });
    }
  }

  onClickDiscard() {
    this.confirmationService.confirm({
      key: 'createPostDialog',
      message: this.textTranslate.discard,
      header: this.textTranslate.confirmation,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        localStorage.removeItem(STORAGE_KEY.POST_DRAFT);
        this.loadDraft();
      }
    });
  }

  publishPost() {
    this.isLoading = true;
    const post = new CreatePostModel({
      title: this.title,
      thumbnail: this.thumbnail,
      content: this.selectedEditorType === 'HTML' ? this.content : this.contentMd,
      short_content: this.short_content,
      content_type: this.selectedEditorType.toUpperCase(),
      time_read: this.time_read,
      categories: this.selectedCategory.map((item: any) => {
        return item.slug;
      }),
      tags: _.concat(this.listTagModel.map(item => {
        return item.tag;
      }), this.tags),
    });

    this.postsService.publishPost(post).subscribe(
      (res) => {
        this.isLoading = false;
        this.messageService.add({
          key: 'createPostToast',
          severity: 'success',
          summary: '',
          detail: this.translate.instant('message.publishpost'),
          life: APPCONSTANT.TOAST_TIMEOUT
        });
      },
      (err: any) => {
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
  }
}
