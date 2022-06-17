import { APPCONSTANT } from 'utils/appConstant';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PasswordPolicy } from 'models/appconfig.model';
import { ConfirmationService, Message } from 'primeng/api';
import { AuthService } from 'services/auth.service';
import Validation from 'utils/validation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  value: string = '';

  passwordPolicy: PasswordPolicy;

  submitted: boolean = false;
  isLoading: boolean;

  message: Message[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
    });

    this.passwordPolicy = this.authService.getConfig().SocialPasswordPolicy;

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
      message: this.translate.instant('label.changepassword.dialog.description'),
      header: this.translate.instant('label.changepassword.dialog.title'),
      acceptLabel: this.translate.instant('label.changepassword.dialog.ok'),
      rejectLabel: this.translate.instant('label.changepassword.dialog.cancel'),
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

    this.authService.changePassword(body).subscribe(
      () => {
        this.isLoading = false;
        this.form.get('oldPassword').setValue(this.form.get('newPassword').value);
        this.form.get('newPassword').setValue('');
        this.form.get('confirmPassword').setValue('');
        this.message = [{
          severity: 'success',
          summary: '',
          detail: this.translate.instant('message.update')
        }];
      },
      (err) => {
        this.isLoading = false;
        this.message = [{
          severity: 'error',
          summary: '',
          detail: this.translate.instant(`messageCode.${err.message_code}`)
        }];
      }
    );
  }

}