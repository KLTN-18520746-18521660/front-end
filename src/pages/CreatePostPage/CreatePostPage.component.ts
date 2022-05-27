import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { PostModel } from 'models/post.model';
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
import md from 'markdown-it';
import mdAnchor from 'markdown-it-anchor';
import mdTableContent from 'markdown-it-table-of-contents';

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
    time_read: 5,
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
  isSelectThumbnail: boolean;
  thumbnailPreview: any;

  @ViewChild('fileUpload') fileUpload: FileUpload;

  message: Message[] = [];

  constructor(
    private userService: UserService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private postsService: PostsService,
    public linkifyService: NgxLinkifyjsService,
    private markdownService: MarkdownService,
    private appUser: AppUserComponent,
  ) { }

  ngOnInit() {
    this.markdownIt = md();

    this.loadDraft();

    this.getCategory();
    this.onChangeTitle(this.title);
  }

  handleChangeTabView(event) {
    console.log(event);
  }

  getCategory() {
    this.isLoading = true;
    this.postsService.getListCategories().subscribe(
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
  onTextChange(event) {
    this.short_content = event?.textValue;
  }

  onChangeContent(event) {
    this.draft[this.selectedEditorType] = event;
    this.saveDraft();
  }

  onChangeContentMd(event) {
    this.contentMdComplied = this.markdownIt.render(event || '');
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

  onChangeTimeRead(event) {
    this.draft['time_read'] = event;
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

  onAddMoreTag(event) {
    const list = this.listTagModel.map(item => {
      return item.tag;
    });
    list.push(event.value.toLowerCase().trim().replace(/\s/g, '-'));
    this.tags = list;
    this.draft['tags'] = this.tags;
    this.saveDraft();
  }

  onRemoveMoreTag(event) {
    const list = this.listTagModel.map(item => {
      return item.tag;
    });
    list.filter(item => {
      return item !== event.value.toLowerCase().trim().replace(/\s/g, '-');
    })
    this.tags = list;
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
      this.contentMdComplied = this.markdownIt.render(this.contentMd || '');
      this.time_read = this.draft['time_read'] || 5;
      this.slug = convertToSlug(this.title || '');
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
      this.time_read = 5;

      this.draft = {
        type: null,
        title: null,
        tags: [],
        thumbnail: null,
        HTML: null,
        Markdown: null,
        time_read: 5,
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
        temp = this.contentMdComplied
      }
      else {
        temp = this.content;
      }
      this.short_content = (temp ? temp : '')
        .replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
        .replace(/(&#\d+;)+/g, ' ')
        .replace(/\n+/g,'.')
        .slice(0, 190);

    } catch (error) {
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
    if (this.getTagSubscription) {
      this.getTagSubscription.unsubscribe();
    }

    const params: ApiParams = {
      search_term: event.query,
      start: 0,
      size: 20
    }

    this.getTagSubscription = this.postsService.getListTags(params).subscribe((res: any) => {
      this.listFilterTags = res?.data.tags;
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
    if (this.title.length == 0) {
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

    return {
      isvalid: result,
      message: this.message
    };
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
    else if (!this.checkValidPost().isvalid) {
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
    let post = new PostModel({
      title: this.title,
      thumbnail: this.thumbnail,
      content: this.selectedEditorType === 'HTML' ? this.content : this.contentMd,
      short_content: this.short_content.slice(0, 180),
      content_type: this.selectedEditorType.toUpperCase(),
      time_read: this.time_read,
      categories: this.selectedCategory.map((item: any) => {
        return item.slug;
      }),
      tags: _.concat(this.listTagModel.map(item => {
        return item.tag;
      }), this.tags),
    });

    post = _.omitBy(post, _.isNull)

    this.postsService.publishPost(post).subscribe(
      (res) => {
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
  }
}
