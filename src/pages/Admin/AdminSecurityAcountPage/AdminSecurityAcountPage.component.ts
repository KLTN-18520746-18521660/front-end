import { Component, OnInit } from '@angular/core';
import { Session } from 'models/api.model';
import { ConfirmationService } from 'primeng/api';
import { AdminService } from 'services/admin.service';

@Component({
  selector: 'app-AdminSecurityAcountPage',
  templateUrl: './AdminSecurityAcountPage.component.html',
  styleUrls: ['./AdminSecurityAcountPage.component.scss']
})
export class AdminSecurityAcountPageComponent implements OnInit {

  
  isLoading: boolean = false;

  listSession: Session[];

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.getListSession();
  }

  getListSession() {
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

}
