import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import Category from 'models/category.model';
import { ManageCategoryTagService } from 'services/admin/manage-category-tag.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ManageCategoryPage',
  templateUrl: './ManageCategoryPage.component.html',
  styleUrls: ['./ManageCategoryPage.component.scss']
})
export class ManageCategoryPageComponent implements OnInit {

  listData: Category[];

  currentCategory: Category;

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
      size: 1000,
    };

    this.getListSubscription = this.manageCategoryTagService.getCategoryList(params).subscribe(
      (res) => {
        this.listData = res.data.categories;
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

  onClickEdit(category: Category) {
    this.currentCategory = category;
    this.viewDialog = 'edit';
    this.displayDialog = true;
  }

  onHideDialog() {
    this.displayDialog = false;
    this.currentCategory = null;
  }

  ngOnDestroy() {
    if (this.getListSubscription) {
      this.getListSubscription.unsubscribe();
    }
  }

}
