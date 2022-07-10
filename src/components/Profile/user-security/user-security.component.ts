import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Session } from 'models/api.model';
import { AuthService } from 'services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-security',
  templateUrl: './user-security.component.html',
  styleUrls: ['./user-security.component.scss']
})
export class UserSecurityComponent implements OnInit {

  isLoading: boolean = false;

  isLoadingDeleteAll: boolean = false;

  listSession: Session[];

  getListSubscription: Subscription;

  deleteAllSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.getListSession();
  }

  getListSession() {
    this.listSession = [];
    this.isLoading = true;
    this.getListSubscription = this.authService.getAllSessionUser().subscribe(
      (res) => {
        this.isLoading = false;
        this.listSession = res.data.sessions;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onDelete(id) {
    this.listSession = this.listSession.filter(item => item.session_token !== id);
  }

  deleteAll() {
    this.confirmationService.confirm({
      key: 'logout',
      header: this.translate.instant('dialog.logoutAll.header'),
      message: this.translate.instant('dialog.logoutAll.title'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('dialog.logoutAll.yes'),
      rejectLabel: this.translate.instant('dialog.logoutAll.no'),
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.isLoadingDeleteAll = true;
        this.deleteAllSubscription = this.authService.deleteAllSessionUser().subscribe(
          (res) => {
            this.isLoadingDeleteAll = false;
            this.getListSession();
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
    if (this.deleteAllSubscription) {
      this.deleteAllSubscription.unsubscribe();
    }
  }

}
