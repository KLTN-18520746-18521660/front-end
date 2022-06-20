import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PasswordPolicy } from 'models/appconfig.model';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AdminService } from 'services/admin.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';

@Component({
  selector: 'app-AdminResetPasswordPage',
  templateUrl: './AdminResetPasswordPage.component.html',
  styleUrls: ['./AdminResetPasswordPage.component.scss']
})
export class AdminResetPasswordPageComponent implements OnInit {

  success: boolean = false;

  error: boolean = false;

  message: Message[] = [];

  form = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  submitted: boolean = false;

  params: any = {};

  isLoading: boolean = false;

  passwordPolicy: PasswordPolicy;

  routerSubcription: Subscription;

  submitSubcription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private translate: TranslateService,
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.translate.use('en');
    this.isLoading = true;
    this.routerSubcription = this.activatedRoute.queryParams.subscribe(res => {
      this.params = res;
      this.adminService.getForgotPassword(this.params).subscribe(
        () => {
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.error = true;
          this.message = [{ severity: 'error', summary: '', detail: err.message }];
        }
      );
    });
    this.passwordPolicy = this.adminService.getConfig().SocialPasswordPolicy;

    this.form = this.formBuilder.group(
      {
        password: [
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
          Validation.match('password', 'confirmPassword'),
        ]
      }
    );
  }

  onSubmit(e) {
    e.preventDefault();
    this.isLoading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    };

    if (this.submitSubcription) {
      this.submitSubcription.unsubscribe();
    }

    this.submitSubcription = this.adminService.resetPassword({ ...this.params, new_password: this.form.get('password').value }).subscribe(
      () => {
        this.isLoading = false;
        this.success = true;
        this.message = [{ severity: 'success', summary: '', detail: "Reset Password Successfully" }];
      },
      (err) => {
        this.isLoading = false;
        this.message = [
          {
            severity: 'error',
            summary: '',
            detail: err.message
          },
          {
            severity: 'warn',
            summary: '',
            detail: "You only have x attempt to reset password. If you don't reset password in 1 hour, you will be locked out."
          }
        ];
      }
    );
  }

  ngOnDestroy() {
    if (this.routerSubcription) {
      this.routerSubcription.unsubscribe();
    }
    if (this.submitSubcription) {
      this.submitSubcription.unsubscribe();
    }
  }

}
