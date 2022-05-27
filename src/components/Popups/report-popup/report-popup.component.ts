import { PostsService } from 'services/posts.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ReportSendModel, ReportType } from 'models/report.model';

interface IReportPopup {
  key: string;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.scss']
})
export class ReportPopupComponent implements OnInit {

  listReasons: IReportPopup[] = [];

  currentReason: IReportPopup;

  content: string;

  success: boolean = false;

  reportSubcription: Subscription;

  data: {
    comment_id?: number;
    post_slug?: string;
    text?: {
      cancel: string;
      description: string;
      submit: string;
      title: string;
    }
    type?: ReportType;
    user_name?: string;
  };

  ref: DynamicDialogRef;

  @ViewChild('textInput') textInput: ElementRef;

  constructor(
    private translate: TranslateService,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private postService: PostsService,
    private confirmationService: ConfirmationService,
  ) { }

  ESCAPE_KEYCODE = 27;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClickCancel();
    }
  }

  ngOnInit() {
    this.data = this.config.data || {};
    console.log(this.data);

    if (this.userService.ref) {
      this.ref = this.userService.ref[this.userService.ref.length - 1];
    }

    this.translate.get('report.reasons').subscribe(res => {
      const keys = Object.keys(res);
      const values = Object.values(res) as any as IReportPopup;
      keys.map((key, index) => {
        this.listReasons.push({
          key: key,
          title: values[index].title,
          description: values[index].description
        });
      });
    })
  }

  onClickReason() {
    setTimeout(() => {
      if (this.textInput?.nativeElement) {
        this.textInput.nativeElement.focus();
      }
    }, 100);
    console.log(this.currentReason);
  }

  onClickCancel() {
    if (this.currentReason) {
      const dialog = this.translate.instant('report.dialog.cancel');
      this.confirmationService.confirm({
        key: 'reportConfirm',
        header: dialog.title,
        message: dialog.description,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: dialog.confirm,
        rejectLabel: dialog.cancel,
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.ref.close();
          this.userService.ref.pop();
          this.ref = null;
        }
      });
    }
    else {
      this.ref.close();
      this.userService.ref.pop();
    }
  }

  onClickSubmit() {
    const dialog = this.translate.instant('report.dialog.submit');
    this.confirmationService.confirm({
      key: 'reportConfirm',
      header: dialog.title,
      message: dialog.description,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: dialog.confirm,
      rejectLabel: dialog.cancel,
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (this.currentReason) {
          if (!this.reportSubcription) {
            const data = {
              comment_id: this.data?.comment_id,
              user_name: this.data?.user_name,
              post_slug: this.data?.post_slug,
              report_type: this.currentReason.key,
              content: this.content,
            } as ReportSendModel;
            this.reportSubcription = this.postService
              .sendReport(this.data.type, data)
              .subscribe(
                (res) => {
                  this.success = true;
                  this.currentReason = null;
                },
                () => {
                }
              );
          }
        }
      }
    });
  }
}
