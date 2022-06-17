import { CategorySendModel } from 'models/Admins/category-tag.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import Category from 'models/category.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ManageCategoryTagService } from 'services/admin/manage-category-tag.service';

@Component({
  selector: 'admin-create-edit-category',
  templateUrl: './create-edit-category.component.html',
  styleUrls: ['./create-edit-category.component.scss']
})
export class CreateEditCategoryComponent implements OnInit {

  @Input() category: Category;

  @Input() view: 'create' | 'edit';

  @Output() onClose = new EventEmitter();

  subscription: Subscription;

  isLoadingSubmit: boolean = false;

  form: FormGroup;

  submitted: boolean = false;

  constructor(
    private manageCategoryTagService: ManageCategoryTagService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      parent_id: new FormControl(this.category?.parent_id),
      name: new FormControl(this.category?.name),
      display_name: new FormControl(this.category?.display_name),
      describe: new FormControl(this.category?.describe),
      thumbnail: new FormControl(this.category?.thumbnail),
      status: new FormControl(this.category?.status),
    });

    this.form = this.formBuilder.group({
      parent_id: [this.category?.parent_id],
      name: [this.category?.name, [Validators.required]],
      display_name: [this.category?.display_name, [Validators.required]],
      describe: [this.category?.describe, [Validators.required]],
      thumbnail: [this.category?.thumbnail],
      status: [this.category?.status],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editCategory();
    }
    else {
      this.createCategory();
    }
  }

  createCategory() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body: CategorySendModel = {
        parent_id: this.form.value.parent_id,
        name: this.form.value.name,
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
        thumbnail: this.form.value.thumbnail,
      };

      this.subscription = this.manageCategoryTagService.createCategory(body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create category success' });
          this.form.reset();
          this.isLoadingSubmit = false;
          this.onClose.emit();
        },
        (err) => {
          this.isLoadingSubmit = false;
          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
        }
      );
    }
    else {
      this.isLoadingSubmit = false;
    }
  };

  editCategory() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body: CategorySendModel = {
        parent_id: this.form.value.parent_id,
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
        thumbnail: this.form.value.thumbnail,
        status: this.form.value.status,
      };

      if (body.status === 'Readonly') {
        delete body.status
      }

      this.subscription = this.manageCategoryTagService.updateCategory(this.category.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited category success' });
          this.isLoadingSubmit = false;
          this.onClose.emit();
        },
        (err) => {
          this.isLoadingSubmit = false;

          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
        }
      );
    }
    else {
      this.isLoadingSubmit = false;
    }
  };

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
