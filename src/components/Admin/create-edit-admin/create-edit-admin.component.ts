import { PasswordPolicy } from 'models/appconfig.model';
import { AdminService } from 'services/admin.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Admin } from 'models/admin.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ManageAdminUserService } from 'services/admin/manage-admin-user.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';

@Component({
  selector: 'admin-create-edit-admin',
  templateUrl: './create-edit-admin.component.html',
  styleUrls: ['./create-edit-admin.component.scss']
})
export class CreateEditAdminComponent implements OnInit {

  admin: Admin;

  @Input() id: string;

  @Input() view: 'create' | 'edit';

  @Input() adminId: number;

  @Output() onClose = new EventEmitter();

  subscription: Subscription;

  isLoading: boolean = false;

  isLoadingSubmit: boolean = false;

  form: FormGroup;

  submitted: boolean = false;

  getAdminSubscription: Subscription;

  passwordPolicy: PasswordPolicy;

  constructor(
    private manageAdminUserService: ManageAdminUserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.passwordPolicy = this.adminService.getConfig().AdminPasswordPolicy;
    console.log(this.passwordPolicy);
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

    if (this.view === 'edit') {
      this.getAdminById();
    }
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
          user_name: this.admin.user_name,
          display_name: this.admin.display_name,
          email: this.admin.email,
        });
        this.isLoading = false;
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
    this.isLoading = true;
    if (this.form.valid) {
      const body = {
        display_name: this.form.value.display_name,
        describe: this.form.value.describe,
      };

      this.subscription = this.manageAdminUserService.modifyAdmin(this.admin.id, body).subscribe(
        (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edited admin success' });
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
    if (this.getAdminSubscription) {
      this.getAdminSubscription.unsubscribe();
    }
  }

}
