import { TranslateService } from '@ngx-translate/core';
import { PostsService } from 'services/posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  uploadSubcription: Subscription;

  type: 'post' | 'user' | 'common' = 'post';

  url: string;

  copied: boolean = false;

  message: Message[] = [];

  constructor(
    private postService: PostsService,
    private translate: TranslateService,
    public dialogConfig: DynamicDialogConfig,
    private clipboard: Clipboard
  ) { }

  ngOnInit(
  ) {
    const data = this.dialogConfig.data || {};
    if (data.type) {
      this.type = data.type;
    }
  }

  myUploader(event) {
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
    this.uploadSubcription = this.postService.upLoadImage(this.type, event.files[0]).subscribe(
      (res) => {
        this.url = res.data.url;
        this.message = [{ severity: 'success', summary: '', detail: this.translate.instant('message.uploadsucess') }];
      },
      (err) => {
        this.message = [{ severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) }];
      }
    );
  }

  onClickCopy() {
    if (!this.copied) {
      this.copied = true;
      this.clipboard.copy(decodeURI(this.url));
    }
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

}
