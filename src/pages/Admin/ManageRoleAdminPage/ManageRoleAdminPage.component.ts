import { Component, OnInit } from '@angular/core';
import { Role } from 'models/Admins/role_right.model';
import { Subscription } from 'rxjs';
import { ManageRoleService } from 'services/admin/manage-role.service';

@Component({
  selector: 'app-ManageRolePage',
  templateUrl: './ManageRoleAdminPage.component.html',
  styleUrls: ['./ManageRoleAdminPage.component.scss']
})
export class ManageRoleAdminPageComponent implements OnInit {

  isLoading: boolean = false;

  listRoles: Role[];

  getListSubscription: Subscription;

  constructor(
    private manageRoleService: ManageRoleService
  ) { }

  ngOnInit() {
    this.getListRoles();
  }

  getListRoles() {
    this.isLoading = true;
    this.getListSubscription = this.manageRoleService.getRoleAdmin().subscribe(
      (res) => {
        this.isLoading = false;
        this.listRoles = res.data.roles;
      },
      (err) => {
        this.listRoles = [];
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }

}
