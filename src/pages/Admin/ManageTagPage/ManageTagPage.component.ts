import { Component, OnInit } from '@angular/core';
import { ApiParams } from 'models/api.model';
import { Tag } from 'models/tag.model';
import { Subscription } from 'rxjs';
import { ManageCategoryTagService } from 'services/admin/manage-category-tag.service';

@Component({
  selector: 'app-ManageTagPage',
  templateUrl: './ManageTagPage.component.html',
  styleUrls: ['./ManageTagPage.component.scss']
})
export class ManageTagPageComponent implements OnInit {

  listData: Tag[];

  currentTag: Tag;

  viewDialog: 'create' | 'edit';

  displayDialog: boolean = false;

  isLoading: boolean = false;

  getListSubscription: Subscription;

  constructor(
    private manageCategoryTagService: ManageCategoryTagService,
  ) { }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.listData = [];
    this.isLoading = true;

    const params: ApiParams = {
      start: 0,
      size: 10000,
    };

    this.getListSubscription = this.manageCategoryTagService.getTagList(params).subscribe(
      (res) => {
        this.listData = res.data.tags;
        this.isLoading = false;
      }
    );
  }


  onSuccess() {
    this.displayDialog = false;
    this.getList();
  }

  onClickCreate() {
    this.viewDialog = 'create';
    this.displayDialog = true;
  }

  onClickEdit(tag: Tag) {
    this.currentTag = tag;
    this.viewDialog = 'edit';
    this.displayDialog = true;
  }

  onHideDialog() {
    this.displayDialog = false;
    this.currentTag = null;
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }

}
