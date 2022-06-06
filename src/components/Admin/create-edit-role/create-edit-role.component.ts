import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'models/Admins/role_right.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ManageRoleService } from 'services/admin/manage-role.service';

@Component({
  selector: 'admin-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  @Input() role: Role;

  @Input() view: 'create' | 'edit' = 'create';

  @Input() roleId: number;

  @Input() type: 'admin' | 'user' = 'admin';

  @Output() onClose = new EventEmitter();

  subscription: Subscription;

  isLoading: boolean = false;

  form: FormGroup;

  constructor(
    private manageRoleService: ManageRoleService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.view === 'edit') {
      this.form = new FormGroup({
        display_name: new FormControl(this.role.display_name),
        describe: new FormControl(this.role.describe),
      });

      this.form = this.formBuilder.group({
        display_name: [this.role.display_name, [Validators.required]],
        describe: [this.role.describe, [Validators.required]],
      });
    }
    else {
      this.form = new FormGroup({
        role_name: new FormControl(''),
        display_name: new FormControl(''),
        describe: new FormControl(''),
      });

      this.form = this.formBuilder.group({
        role_name: ['', [Validators.required]],
        display_name: ['', [Validators.required]],
        describe: ['', [Validators.required]],
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    if (this.view === 'edit') {
      this.editRole();
    }
    else {
      this.createRole();
    }
  }

  createRole() {
    this.isLoading = true;
    if (this.form.valid) {
      const body = {
        role_name: this.form.value.role_name,
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageRoleService.createRole(this.type, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create role success' });
          this.form.reset();
          this.onClose.emit();
          this.isLoading = false;
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

  editRole() {
    this.isLoading = true;
    if (this.form.valid) {
      const body = {
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageRoleService.updateRole(this.type, this.role.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited role success' });
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
