import { Component, OnInit } from '@angular/core';
import { Right } from 'models/Admins/role_right.model';
import { Subscription } from 'rxjs';
import { ManageRightService } from 'services/admin/manage-right.service';

@Component({
  selector: 'app-ManageRightUserPage',
  templateUrl: './ManageRightUserPage.component.html',
  styleUrls: ['./ManageRightUserPage.component.scss']
})
export class ManageRightUserPageComponent implements OnInit {

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
    this.isLoading = true;
    this.getListSubscription = this.manageRightService.getRightUser().subscribe(
      (res) => {
        this.isLoading = false;
        this.listRights = res.data.roles;
      },
      (err) => {
        this.listRights = [];
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
