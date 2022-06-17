import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TagSendModel } from 'models/Admins/category-tag.model';
import { Tag } from 'models/tag.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ManageCategoryTagService } from 'services/admin/manage-category-tag.service';

@Component({
  selector: 'admin-create-edit-tag',
  templateUrl: './create-edit-tag.component.html',
  styleUrls: ['./create-edit-tag.component.scss']
})
export class CreateEditTagComponent implements OnInit {

  @Input() tag: Tag;

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
      tag: new FormControl(this.tag?.tag),
      name: new FormControl(this.tag?.name),
      describe: new FormControl(this.tag?.describe),
      status: new FormControl(this.tag?.status),
    });

    this.form = this.formBuilder.group({
      tag: [this.tag?.tag, [Validators.required]],
      name: [this.tag?.name, [Validators.required]],
      describe: [this.tag?.describe, [Validators.required]],
      status: [this.tag?.status],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editTag();
    }
    else {
      this.createTag();
    }
  }

  createTag() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body: TagSendModel = {
        tag: this.form.value.tag,
        name: this.form.value.name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageCategoryTagService.createTag(body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create tag success' });
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

  editTag() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body: TagSendModel = {
        name: this.form.value.name,
        describe: this.form.value.describe,
        status: this.form.value.status,
      };

      this.subscription = this.manageCategoryTagService.updateTag(this.tag.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited tag success' });
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
