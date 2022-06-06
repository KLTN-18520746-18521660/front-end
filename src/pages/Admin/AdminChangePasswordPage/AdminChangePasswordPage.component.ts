import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PasswordPolicy } from 'models/appconfig.model';
import { Message, ConfirmationService } from 'primeng/api';
import { AdminService } from 'services/admin.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';

@Component({
  selector: 'app-AdminChangePasswordPage',
  templateUrl: './AdminChangePasswordPage.component.html',
  styleUrls: ['./AdminChangePasswordPage.component.scss']
})
export class AdminChangePasswordPageComponent implements OnInit {

  form: FormGroup;

  value: string = '';

  passwordPolicy: PasswordPolicy;

  submitted: boolean = false;
  isLoading: boolean;

  message: Message[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
    });

    this.passwordPolicy = this.adminService.getConfig().AdminPasswordPolicy;
    console.log(this.passwordPolicy);

    this.form = this.formBuilder.group(
      {
        oldPassword: [
          null,
          [
            Validators.required
          ]
        ],
        newPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(this.passwordPolicy.min_len || APPCONSTANT.PASSWORD_POLICY.MIN_LEN),
            Validators.maxLength(this.passwordPolicy.max_len || APPCONSTANT.PASSWORD_POLICY.MAX_LEN),
            Validation.minLowerCaseChar(this.passwordPolicy.min_lower_char || APPCONSTANT.PASSWORD_POLICY.MIN_LOWER_CHAR),
            Validation.minUpperCaseChar(this.passwordPolicy.min_upper_char || APPCONSTANT.PASSWORD_POLICY.MIN_UPPER_CHAR),
            Validation.minNumberChar(this.passwordPolicy.min_number_char || APPCONSTANT.PASSWORD_POLICY.MIN_NUMBER_CHAR),
            Validation.minSpecialChar(this.passwordPolicy.min_special_char || APPCONSTANT.PASSWORD_POLICY.MIN_SPECIAL_CHAR),
          ]
        ],
        confirmPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(this.passwordPolicy.min_len || APPCONSTANT.PASSWORD_POLICY.MIN_LEN),
            Validators.maxLength(this.passwordPolicy.max_len || APPCONSTANT.PASSWORD_POLICY.MAX_LEN),
          ]
        ]
      },
      {
        validators: [
          Validation.match('newPassword', 'confirmPassword'),
        ]
      }
    );
  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }
    this.confirmationService.confirm({
      key: 'changePasswordDialog',
      message: "Are you sure that you want to change your password?",
      header: 'Change Password',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onChangePassword();
      }
    });
  }

  onChangePassword() {
    const body = {
      old_password: this.form.get('oldPassword').value,
      new_password: this.form.get('newPassword').value
    }

    this.adminService.changePassword(body).subscribe(
      () => {
        this.isLoading = false;
        this.form.get('oldPassword').setValue(this.form.get('newPassword').value);
        this.form.get('newPassword').setValue('');
        this.form.get('confirmPassword').setValue('');
        this.message = [{
          severity: 'success',
          summary: '',
          detail: 'Password changed successfully'
        }];
      },
      (err) => {
        this.isLoading = false;
        this.message = [{
          severity: 'error',
          summary: '',
          detail: err.message
        }];
      }
    );
  }

}
