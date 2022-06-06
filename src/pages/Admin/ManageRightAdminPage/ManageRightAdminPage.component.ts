import { Component, OnInit } from '@angular/core';
import { Right } from 'models/Admins/role_right.model';
import { Subscription } from 'rxjs';
import { ManageRightService } from 'services/admin/manage-right.service';

@Component({
  selector: 'app-ManageRightAdminPage',
  templateUrl: './ManageRightAdminPage.component.html',
  styleUrls: ['./ManageRightAdminPage.component.scss']
})
export class ManageRightAdminPageComponent implements OnInit {

  viewDialog: 'edit' | 'create' = 'edit';

  displayDialog: boolean = false;

  currentRight: Right;

  isLoading: boolean = false;

  listRights: Right[];

  getListSubscription: Subscription;

  constructor(
    private manageRightService: ManageRightService
  ) { }

  ngOnInit() {
    this.getListRights();
  }

  getListRights() {
    this.listRights = [];
    this.isLoading = true;
    this.getListSubscription = this.manageRightService.getRightAdmin().subscribe(
      (res) => {
        this.isLoading = false;
        this.listRights = res.data.rights;
      },
      (err) => {
        this.listRights = [];
        this.isLoading = false;
      }
    );
  }

  onClickCreate() {
    this.currentRight = null;
    this.viewDialog = 'create';
    this.displayDialog = true;
  }

  onClickEdit(right: Right) {
    this.currentRight = right;
    this.viewDialog = 'edit';
    this.displayDialog = true;
  }

  onSuccess() {
    this.displayDialog = false;
    this.getListRights();
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }
}
