import { AdminService } from 'services/admin.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from 'models/api.model';
import { convertDateTime } from 'utils/commonFunction';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent implements OnInit {

  @Input() loading: boolean = false;

  @Input() type: 'admin' | 'user' = 'user';

  @Input() session: Session;

  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  deleteSubcription: Subscription;

  menuitems: MenuItem[];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private translate: TranslateService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    if (this.loading) {
      return;
    }

    this.menuitems = [
      {
        label: this.translate.instant('profile.security.session.logout'),
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.deleteSession(this.session.session_token);
        }
      }
    ];

    if (this.type === 'admin') {
      this.session.iscurrent = this.session.session_token === this.adminService.getSessionId();
    }
    else if (this.type === 'user') {
      this.session.iscurrent = this.session.session_token === this.authService.getSessionId();
    }

    this.session.fromNow = {
      created: convertDateTime(this.session.created_timestamp, this.translate.currentLang, false, false, true),
      updated: convertDateTime(this.session.last_interaction_time, this.translate.currentLang, false, false, true)
    }
  }

  deleteSession(sessionId: string) {
    if (this.type === 'admin') {
      this.deleteSubcription = this.adminService.deleteSessionAdmin(sessionId).subscribe(
        (res) => {
          this.loading = false;
          this.onDelete.emit(sessionId);
          this.messageService.add({
            key: 'sessionCard',
            severity: 'success',
            summary: '',
            detail: this.translate.instant('message.delete')
          });
        },
        (err) => {
          this.loading = false;
          this.messageService.add({
            key: 'sessionCard',
            severity: 'error',
            summary: err.error,
            detail: this.translate.instant(`messageCode.${err.message_code}`),
          });
        }
      );
    }
    else if (this.type === 'user') {
      this.deleteSubcription = this.authService.deleteSessionUser(sessionId).subscribe(
        (res) => {
          this.loading = false;
          this.onDelete.emit(sessionId);
          this.messageService.add({
            key: 'sessionCard',
            severity: 'success',
            summary: '',
            detail: this.translate.instant('message.delete')
          });
        },
        (err) => {
          this.loading = false;
          this.messageService.add({
            key: 'sessionCard',
            severity: 'error',
            summary: err.error,
            detail: this.translate.instant(`messageCode.${err.message_code}`)
          });
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.deleteSubcription) {
      this.deleteSubcription.unsubscribe();
    }
  }

}
