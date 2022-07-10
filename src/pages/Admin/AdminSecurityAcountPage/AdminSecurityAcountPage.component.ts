import { Component, OnInit } from '@angular/core';
import { Session } from 'models/api.model';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AdminService } from 'services/admin.service';

@Component({
  selector: 'app-AdminSecurityAcountPage',
  templateUrl: './AdminSecurityAcountPage.component.html',
  styleUrls: ['./AdminSecurityAcountPage.component.scss']
})
export class AdminSecurityAcountPageComponent implements OnInit {

  isLoadingDeleteAll: boolean = false;

  isLoading: boolean = false;

  listSession: Session[];

  deleteAllSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getListSession();
  }

  getListSession() {
    this.listSession = [];
    this.isLoading = true;
    this.adminService.getAllSessionAdmin().subscribe(
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
      header: "Log out all device?",
      message: "Do you sure to log out all device you already log in?",
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Yes, log out all",
      rejectLabel: "No, cancel",
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      accept: () => {
        this.isLoadingDeleteAll = true;
        this.deleteAllSubscription = this.adminService.deleteAllSessionAdmin().subscribe(
          (res) => {
            this.isLoadingDeleteAll = false;
            this.getListSession();
          }
        );
      }
    });
  }

}
