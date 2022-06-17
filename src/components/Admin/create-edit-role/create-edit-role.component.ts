import { RightDetail } from 'models/Admins/role_right.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role, Right } from 'models/Admins/role_right.model';
import { MessageService } from 'primeng/api';
import { Subscription, map } from 'rxjs';
import { ManageRightService } from 'services/admin/manage-right.service';
import { ManageRoleService } from 'services/admin/manage-role.service';

@Component({
  selector: 'admin-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  @Input() role: Role;

  @Input() view: 'create' | 'edit' = 'create';

  @Input() type: 'admin' | 'user' = 'admin';

  @Output() onClose = new EventEmitter();

  subscription: Subscription;

  getRightSubscription: Subscription;

  isLoading: boolean = false;

  listRights: Right[] = [];

  listRightControl: RightDetail[] = [];

  isLoadingRights: boolean = false;

  form: FormGroup;

  submitted: boolean = false;

  rightModel: {
    [key: string]: RightDetail;
  } = {};


  constructor(
    private manageRoleService: ManageRoleService,
    private manageRightService: ManageRightService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.view === 'edit') {
      this.form = new FormGroup({
        display_name: new FormControl(this.role.display_name),
        describe: new FormControl(this.role.describe),
        priority: new FormControl(this.role.priority),
      });

      this.form = this.formBuilder.group({
        display_name: [this.role.display_name, [Validators.required]],
        describe: [this.role.describe, [Validators.required]],
        priority: [this.role.priority, [Validators.required]],
      });
    }
    else {
      this.form = new FormGroup({
        role_name: new FormControl(''),
        display_name: new FormControl(''),
        describe: new FormControl(''),
        priority: new FormControl(false),
      });

      this.form = this.formBuilder.group({
        role_name: ['', [Validators.required]],
        display_name: ['', [Validators.required]],
        describe: ['', [Validators.required]],
        priority: [false, [Validators.required]],
      });
    }

    this.getListRights();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onChange(event: RightDetail) {
    this.rightModel[event.key] = {
      read: event.read,
      write: event.write,
    };
    if (!event.selected || (!event.read && !event.write)) {
      delete this.rightModel[event.key];
    }
    this.rightModel = { ...this.role?.rights, ...this.rightModel };
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editRole();
    }
    else {
      this.createRole();
    }
  }

  getListRights() {
    this.listRights = [];
    if (this.getRightSubscription) {
      this.getRightSubscription.unsubscribe();
    }
    this.isLoadingRights = true;
    if (this.type === 'admin') {
      this.subscription = this.manageRightService.getRightAdmin().subscribe(
        (res) => {
          this.listRights = res.data.rights;

          this.listRightControl = this.convertListRights(this.listRights);
          this.isLoadingRights = false;
        }
      );
    }
    else if (this.type === 'user') {
      this.subscription = this.manageRightService.getRightUser().subscribe(
        (res) => {
          this.listRights = res.data.rights;

          this.listRightControl = this.convertListRights(this.listRights);
          this.isLoadingRights = false;
        }
      );
    }
  }

  convertListRights(listRights: Right[]): RightDetail[] {
    let list: RightDetail[] = [];
    if (this.view === 'edit') {
      listRights.map((item) => {
        list.push({
          key: item.right_name,
          display_name: item.display_name,
          describe: item.describe,
          read: this.role?.rights[item.right_name] ? this.role?.rights[item.right_name]?.read : false,
          write: this.role?.rights[item.right_name] ? this.role?.rights[item.right_name]?.write : false,
          selected: this.role?.rights[item.right_name] ? true : false,
        });
      });
    }
    else if (this.view === 'create') {
      listRights.map((item) => {
        list.push({
          key: item.right_name,
          display_name: item.display_name,
          describe: item.describe,
          read: false,
          write: false,
          selected: false,
        });
      });
    }
    return list;
  }

  createRole() {
    this.isLoading = true;
    if (this.form.valid) {
      const body: Role = {
        role_name: this.form.value.role_name,
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
        priority: this.form.value.priority,
        rights: this.rightModel,
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
        priority: this.form.value.priority,
        rights: this.rightModel,
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
    if (this.getRightSubscription) {
      this.getRightSubscription.unsubscribe();
    }
  }
}
