import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Right } from 'models/Admins/role_right.model';
import { ManageRightService } from 'services/admin/manage-right.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'admin-create-edit-right',
  templateUrl: './create-edit-right.component.html',
  styleUrls: ['./create-edit-right.component.scss']
})
export class CreateEditRightComponent implements OnInit {

  @Input() right: Right;

  @Input() view: 'create' | 'edit' = 'create';

  @Input() rightId: number;

  @Input() type: 'admin' | 'user' = 'admin';

  @Output() onClose = new EventEmitter();

  subscription: Subscription;

  isLoading: boolean = false;

  form: FormGroup;

  submitted: boolean = false;

  constructor(
    private manageRightService: ManageRightService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.view === 'edit') {
      this.form = new FormGroup({
        display_name: new FormControl(this.right.display_name),
        describe: new FormControl(this.right.describe),
      });

      this.form = this.formBuilder.group({
        display_name: [this.right.display_name, [Validators.required]],
        describe: [this.right.describe, [Validators.required]],
      });
    }
    else {
      this.form = new FormGroup({
        right_name: new FormControl(''),
        display_name: new FormControl(''),
        describe: new FormControl(''),
      });

      this.form = this.formBuilder.group({
        right_name: ['', [Validators.required]],
        display_name: ['', [Validators.required]],
        describe: ['', [Validators.required]],
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editRight();
    }
    else {
      this.createRight();
    }
  }

  createRight() {
    this.isLoading = true;
    if (this.form.valid) {
      const body = {
        right_name: this.form.value.right_name,
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageRightService.createRight(this.type, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create right success' });
          this.form.reset();
          this.isLoading = false;
          this.onClose.emit();
        },
        (err) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
        }
      );
    }
    else {
      this.isLoading = false;
    }
  };

  editRight() {
    this.isLoading = true;
    if (this.form.valid) {
      const body = {
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageRightService.updateRight(this.type, this.right.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited right success' });
          this.isLoading = false;
          this.onClose.emit();
        },
        (err) => {
          this.isLoading = false;

          this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
        }
      );
    }
    else {
      this.isLoading = false;
    }
  };

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

