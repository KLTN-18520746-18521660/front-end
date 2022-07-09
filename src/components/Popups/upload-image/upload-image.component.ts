import { APPCONSTANT } from 'utils/appConstant';
import { UserService } from 'services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { PostsService } from 'services/posts.service';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { ManageFileService } from 'services/admin/manage-file.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [DynamicDialogConfig]
})
export class UploadImageComponent implements OnInit {

  @Output() onSuccess = new EventEmitter<string>();

  @Input() showCopy: boolean = true;

  @Input() type: 'basic' | 'advanced' = 'advanced';

  @Input() auto: boolean = false;

  @Input() path: 'post' | 'user' | 'common' = 'post';

  @Input() isAdmin: boolean = false;

  @Input() className: string;

  isUploading: boolean = false;

  uploadSubcription: Subscription;

  url: string;

  copied: boolean = false;

  message: Message[] = [];

  MAX_FILE_SIZE: number;

  constructor(
    private postService: PostsService,
    private translate: TranslateService,
    private dialogConfig: DynamicDialogConfig,
    private clipboard: Clipboard,
    private userService: UserService,
    private manageFileService: ManageFileService,
  ) { }

  ngOnInit(
  ) {
    const data = this.dialogConfig.data || {};
    if (data.type) {
      this.type = data.type;
    }
    this.MAX_FILE_SIZE = this.userService.config?.UploadFileConfig?.max_length_of_single_file || APPCONSTANT.MAX_FILE_SIZE;
  }

  myUploader(event) {
    this.url = null;
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }

    this.isUploading = true;

    if (!this.isAdmin) {
      this.uploadSubcription = this.postService.upLoadImage(this.path, event.files[0]).subscribe(
        (res) => {
          this.url = res.data.url;
          this.onSuccess.emit(this.url);
          this.message = [{ severity: 'success', summary: '', detail: this.translate.instant('message.uploadsucess') }];
          this.isUploading = false;
        },
        (err) => {
          this.message = [{ severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) }];
        }
      );
    }
    else {
      this.uploadSubcription = this.manageFileService.upLoadImage(this.path, event.files[0]).subscribe(
        (res) => {
          this.url = res.data.url;
          this.onSuccess.emit(this.url);
          this.message = [{ severity: 'success', summary: '', detail: this.translate.instant('message.uploadsucess') }];
          this.isUploading = false;
        }
      );
    }
  }

  onClickCopy() {
    if (!this.copied) {
      this.copied = true;
      this.clipboard.copy(window.location.origin + decodeURI(this.url));
      setTimeout(() => {
        this.copied = false;
      }, 5000);
    }
  }

  onClear() {
    this.url = null;
  }

  ngOnDestroy() {
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
  }
}
