import { Subscription } from 'rxjs';
import { PasswordPolicy } from 'models/appconfig.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { AuthService } from 'services/auth.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';

@Component({
  selector: 'app-NewPasswordPage',
  templateUrl: './NewPasswordPage.component.html',
  styleUrls: ['./NewPasswordPage.component.scss']
})
export class NewPasswordPageComponent implements OnInit {

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

  textTranslate: any = {};

  passwordPolicy: PasswordPolicy;

  routerSubcription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.isLoading = true;
    this.routerSubcription = this.activatedRoute.queryParams.subscribe(res => {
      this.params = res;
      this.authService.getForgotPassword(this.params).subscribe(
        () => {
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.error = true;
          this.message = [{ severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) }];
        }
      );
      this.translate.get('label.confirm').subscribe(res => {
        this.textTranslate = res;
      })
    });
    this.passwordPolicy = this.authService.getConfig().SocialPasswordPolicy;

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

    this.authService.resetPassword({ ...this.params, new_password: this.form.get('password').value }).subscribe(
      () => {
        this.isLoading = false;
        this.success = true;
        this.message = [{ severity: 'success', summary: '', detail: this.textTranslate.success }];
      },
      (err) => {
        this.isLoading = false;
        this.message = [
          {
            severity: 'error',
            summary: '',
            detail: this.translate.instant(`messageCode.${err.message_code}`)
          },
          {
            severity: 'warn',
            summary: '',
            detail: this.textTranslate.warning
          }
        ];
      }
    );
  }

  ngOnDestroy() {
    if (this.routerSubcription) {
      this.routerSubcription.unsubscribe();
    }
  }

}
