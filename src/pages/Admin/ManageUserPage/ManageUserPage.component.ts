import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Admin } from 'models/admin.model';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';
import User from 'models/user.model';

@Component({
  selector: 'app-ManageUserPage',
  templateUrl: './ManageUserPage.component.html',
  styleUrls: ['./ManageUserPage.component.scss']
})
export class ManageUserPageComponent implements OnInit {

  isLoading: boolean = false;

  listUsers: Admin[] = [];

  displayDialog: boolean = false;

  viewDialog: 'create' | 'edit';

  currentUser: User;

  getListSubscription: Subscription;

  constructor(
    private manageAdminUserService: ManageAdminUserService
  ) { }

  ngOnInit() {
    this.getListUsers();
  }

  getListUsers() {
    this.listUsers = [];
    this.isLoading = true;

    const params: ApiParams = {
      start: 0,
      size: 100,
      sort_by: 'created_timestamp',
      order: 'desc',
    }

    this.getListSubscription = this.manageAdminUserService.getListUser(params).subscribe(
      (res) => {
        this.listUsers = res.data.users;
        this.isLoading = false;
      }
    );
  }

  onSuccess() {
    this.displayDialog = false;
    this.getListUsers();
  }

  onClickCreate() {
    this.viewDialog = 'create';
    this.displayDialog = true;
  }

  onClickEdit(admin: Admin) {
    this.currentUser = admin;
    this.viewDialog = 'edit';
    this.displayDialog = true;
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }
}
