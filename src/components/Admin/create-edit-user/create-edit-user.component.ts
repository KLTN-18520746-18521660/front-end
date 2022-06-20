import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Role } from 'models/Admins/role_right.model';
import { PasswordPolicy } from 'models/appconfig.model';
import User from 'models/user.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AdminService } from 'services/admin.service';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';
import { ManageRoleService } from 'services/admin/manage-role.service';

@Component({
  selector: 'admin-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss']
})
export class CreateEditUserComponent implements OnInit {

  user: User;

  @Input() id: string;

  @Input() view: 'create' | 'edit';

  @Output() onClose = new EventEmitter();

  listRole: Role[];

  subscription: Subscription;

  isLoading: boolean = false;

  isLoadingRole: boolean = false;

  isLoadingSubmit: boolean = false;

  form: FormGroup;

  submitted: boolean = false;

  getUserSubscription: Subscription;

  getListRoleSubscription: Subscription;

  passwordPolicy: PasswordPolicy;

  constructor(
    private manageAdminUserService: ManageAdminUserService,
    private manageRoleService: ManageRoleService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.passwordPolicy = this.adminService.getConfig().AdminPasswordPolicy;
    if (this.view === 'edit') {
      this.form = new FormGroup({
        status: new FormControl(''),
        roles: new FormArray([]),
      });

      this.form = this.formBuilder.group({
        status: ['', [Validators.required]],
        roles: this.formBuilder.array([]),
      });
      this.getUserById();
    }
  }

  addFormArray(arr: string[]) {
    arr.forEach(item => {
      const formArray = this.form.controls.roles as FormArray;
      formArray.push(this.formBuilder.group({
        [item]: [this.user.roles.includes(item) ? true : false],
      }));
    });
  }

  getUserById() {
    this.isLoading = true;
    if (!this.id) {
      return;
    }
    this.getUserSubscription = this.manageAdminUserService.getUserById(this.id).subscribe(
      (res) => {
        this.user = res.data.user;
        this.form.patchValue({
          status: this.user.status,
          roles: this.user.roles,
        });
        this.isLoading = false;
        this.getListRole();
      }
    );
  }

  getListRole() {
    this.listRole = [];
    this.isLoadingRole = true;
    this.getListRoleSubscription = this.manageRoleService.getRoleUser().subscribe(
      (res) => {
        this.listRole = res.data.roles;
        this.addFormArray(this.listRole.map(item => item.role_name));
        this.isLoadingRole = false;
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editUser();
    }
  }

  editUser() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body = {
        display_name: this.form.value.display_name,
        status: this.form.value.status,
        roles: this.form.value.roles.filter(item => Object.values(item).includes(true)).map(item => Object.keys(item)[0]),
      };

      this.subscription = this.manageAdminUserService.modifyUser(this.user.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited user success' });
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
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }
    if (this.getListRoleSubscription) {
      this.getListRoleSubscription.unsubscribe();
    }
  }

}
