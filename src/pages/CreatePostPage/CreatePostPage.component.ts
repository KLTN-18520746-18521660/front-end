import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from 'pages/LoginPage/LoginPage.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-CreatePostPage',
  templateUrl: './CreatePostPage.component.html',
  styleUrls: ['./CreatePostPage.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class CreatePostPageComponent implements OnInit {

  content: string = '';

  contentMd: string = '';

  types = ['HTML', 'Markdown'];

  selectedType: string = 'HTML';

  ref: DynamicDialogRef;

  textTranslate: {
    confirmation?: string,
    publish?: string,
    login?: string,
    discard?: string,
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.translate.get('dialog').subscribe(res => {
      this.textTranslate = res;
    });
  }

  onTextChange(event: any) {
    this.content = event.target.value;
  }

  onChangeType(event: any) {
    this.selectedType = event.value;
  }

  onClickSaveDraft() {
  }

  onClickPublish() {
    if (!this.userService.isAuthenticated) {
      this.ref = this.dialogService.open(LoginPageComponent, {
        header: 'You no longer login',
        width: '50%',
        footer: 'Login to countinue publish this post!'
      });
      this.ref.onClose.subscribe(() => {
        this.ref = null;
        this.userService.ref = [];
      });
      this.userService.ref.push(this.ref);
    }
  }

  onClickDiscard() {
    this.confirmationService.confirm({
      message: this.textTranslate.discard,
      header: this.textTranslate.confirmation,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }
}
