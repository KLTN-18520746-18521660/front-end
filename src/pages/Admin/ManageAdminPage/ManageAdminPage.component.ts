import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'models/admin.model';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';

@Component({
  selector: 'app-ManageAdminPage',
  templateUrl: './ManageAdminPage.component.html',
  styleUrls: ['./ManageAdminPage.component.scss']
})
export class ManageAdminPageComponent implements OnInit {

  isLoading: boolean = false;

  listAdmins: Admin[] = [];

  displayDialog: boolean = false;

  viewDialog: 'create' | 'edit';

  currentAdmin: Admin;

  getListSubscription: Subscription;

  constructor(
    private manageAdminUserService: ManageAdminUserService
  ) { }

  ngOnInit() {
    this.getListAdmins();
  }

  getListAdmins() {
    this.listAdmins = [];
    this.isLoading = true;

    const params: ApiParams = {
      start: 0,
      size: 100
    }

    this.getListSubscription = this.manageAdminUserService.getListAdmin(params).subscribe(
      (res) => {
        this.listAdmins = res.data.admins;
        this.isLoading = false;
      }
    );
  }

  onSuccess() {
    this.displayDialog = false;
    this.getListAdmins();
  }

  onClickCreate() {
    this.viewDialog = 'create';
    this.displayDialog = true;
  }

  onClickEdit(admin: Admin) {
    this.viewDialog = 'edit';
    this.currentAdmin = admin;
    this.displayDialog = true;
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }
}
