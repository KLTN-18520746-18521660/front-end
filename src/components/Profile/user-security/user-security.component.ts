import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Session } from 'models/api.model';
import { AuthService } from 'services/auth.service';

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
  ) { }

  ngOnInit() {
    this.getListSession();
  }

  getListSession() {
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
    this.isLoadingDeleteAll = true;
    this.deleteAllSubscription = this.authService.deleteAllSessionUser().subscribe(
      (res) => {
        this.isLoadingDeleteAll = false;
        this.getListSession();
      }
    );
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
