import { ManageRoleService } from 'services/admin/manage-role.service';
import { PasswordPolicy } from 'models/appconfig.model';
import { AdminService } from 'services/admin.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Admin } from 'models/admin.model';
import { MessageService } from 'primeng/api';
import { Subscription, filter } from 'rxjs';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';
import { Role } from 'models/Admins/role_right.model';

@Component({
  selector: 'admin-create-edit-admin',
  templateUrl: './create-edit-admin.component.html',
  styleUrls: ['./create-edit-admin.component.scss']
})
export class CreateEditAdminComponent implements OnInit {

  admin: Admin;

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

  getAdminSubscription: Subscription;

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
    if (this.view === 'create') {
      this.form = new FormGroup({
        email: new FormControl(''),
        display_name: new FormControl(''),
        user_name: new FormControl(''),
        password: new FormControl(''),
      });

      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        display_name: ['', [Validators.required]],
        user_name: ['', [Validators.required]],
        password: ['', [
          Validators.required,
          Validators.minLength(this.passwordPolicy.min_len || APPCONSTANT.PASSWORD_POLICY.MIN_LEN),
          Validators.maxLength(this.passwordPolicy.max_len || APPCONSTANT.PASSWORD_POLICY.MAX_LEN),
          Validation.minLowerCaseChar(this.passwordPolicy.min_lower_char || APPCONSTANT.PASSWORD_POLICY.MIN_LOWER_CHAR),
          Validation.minUpperCaseChar(this.passwordPolicy.min_upper_char || APPCONSTANT.PASSWORD_POLICY.MIN_UPPER_CHAR),
          Validation.minNumberChar(this.passwordPolicy.min_number_char || APPCONSTANT.PASSWORD_POLICY.MIN_NUMBER_CHAR),
          Validation.minSpecialChar(this.passwordPolicy.min_special_char || APPCONSTANT.PASSWORD_POLICY.MIN_SPECIAL_CHAR),
        ]],
      });
    }

    else if (this.view === 'edit') {
      this.form = new FormGroup({
        display_name: new FormControl(''),
        status: new FormControl(''),
        roles: new FormArray([]),
      });

      this.form = this.formBuilder.group({
        display_name: ['', [Validators.required]],
        status: ['', [Validators.required]],
        roles: this.formBuilder.array([]),
      });
      this.getAdminById();
    }
  }

  addFormArray(arr: string[]) {
    arr.forEach(item => {
      const formArray = this.form.controls.roles as FormArray;
      formArray.push(this.formBuilder.group({
        [item]: [this.admin.roles.includes(item) ? true : false],
      }));
    });
  }

  getAdminById() {
    this.isLoading = true;
    if (!this.id) {
      return;
    }
    this.getAdminSubscription = this.manageAdminUserService.getAdminById(this.id).subscribe(
      (res) => {
        this.admin = res.data.admin;
        this.form.patchValue({
          display_name: this.admin.display_name,
          status: this.admin.status,
          roles: this.admin.roles,
        });
        this.isLoading = false;
        this.getListRole();
      }
    );
  }

  getListRole() {
    this.listRole = [];
    this.isLoadingRole = true;
    this.getListRoleSubscription = this.manageRoleService.getRoleAdmin().subscribe(
      (res) => {
        this.listRole = res.data.roles;
        this.isLoadingRole = false;
        this.addFormArray(this.listRole.map(item => item.role_name));
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.view === 'edit') {
      this.editAdmin();
    }
    else {
      this.createAdmin();
    }
  }

  createAdmin() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body = {
        user_name: this.form.value.user_name,
        display_name: this.form.value.display_name,
        email: this.form.value.email,
        password: this.form.value.password,
        settings: {}
      };

      this.subscription = this.manageAdminUserService.createAdmin(body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create admin success' });
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

  editAdmin() {
    this.isLoadingSubmit = true;
    if (this.form.valid) {
      const body = {
        display_name: this.form.value.display_name,
        status: this.form.value.status,
        roles: this.form.value.roles.filter(item => Object.values(item).includes(true)).map(item => Object.keys(item)[0]),
      };

      if (body.status === 'Readonly') {
        delete body.status
      }

      this.subscription = this.manageAdminUserService.modifyAdmin(this.admin.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited admin success' });
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
    if (this.getAdminSubscription) {
      this.getAdminSubscription.unsubscribe();
    }
    if (this.getListRoleSubscription) {
      this.getListRoleSubscription.unsubscribe();
    }
  }

}
