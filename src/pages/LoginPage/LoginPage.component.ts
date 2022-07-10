import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SocialUser } from 'angularx-social-login';
import { AppConfig, PasswordPolicy } from 'models/appconfig.model';
import { LoginUserModel } from 'models/user.model';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'services/app.config.service';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.scss'],
  providers: [MessageService]
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;

  socialUser!: SocialUser;

  isLoggedin?: boolean;

  submitted = false;

  isLoading: boolean = false;

  isRedirecting: boolean = false;

  message: Message[] = [];

  config: AppConfig;

  subscription: Subscription;
  authSubscription: Subscription;

  passwordPolicy: PasswordPolicy;

  returnUrl: string;

  constructor(
    public configService: AppConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.passwordPolicy = this.authService.getConfig().SocialPasswordPolicy;

    // get returnUrl
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || null;

    this.message = this.userService.messages;
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    this.form = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      remember: new FormControl(''),
    });

    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null,
        // [
        //   Validators.required,
        //   Validators.minLength(this.passwordPolicy.min_len || APPCONSTANT.PASSWORD_POLICY.MIN_LEN),
        //   Validators.maxLength(this.passwordPolicy.max_len || APPCONSTANT.PASSWORD_POLICY.MAX_LEN),
        //   Validation.minLowerCaseChar(this.passwordPolicy.min_lower_char || APPCONSTANT.PASSWORD_POLICY.MIN_LOWER_CHAR),
        //   Validation.minUpperCaseChar(this.passwordPolicy.min_upper_char || APPCONSTANT.PASSWORD_POLICY.MIN_UPPER_CHAR),
        //   Validation.minNumberChar(this.passwordPolicy.min_number_char || APPCONSTANT.PASSWORD_POLICY.MIN_NUMBER_CHAR),
        //   Validation.minSpecialChar(this.passwordPolicy.min_special_char || APPCONSTANT.PASSWORD_POLICY.MIN_SPECIAL_CHAR),
        // ]
      ],
      remember: [false]
    });
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.socialUser = user;
    //   this.isLoggedin = user != null;
    // });
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

    const { email, password, remember } = this.form.value;

    const user = new LoginUserModel({
      user_name: email.toLowerCase(),
      password,
      remember
    });

    this.authService.login(user).subscribe(
      (res) => {
        this.isLoading = false;
        this.userService.alreadyLogin = true;
        this.userService.updateAuth(res?.data?.session_id);

        this.authSubscription = this.userService.authUpdate$.subscribe(res => {
          if (res.isAuthenticated) {
            this.isRedirecting = true;
            if (this.returnUrl) {
              setTimeout(() => {
                this.router.navigateByUrl(decodeURIComponent(this.returnUrl));
              }, APPCONSTANT.LOADING_TIMEOUT);
            }
            else {
              setTimeout(() => {
                if (this.userService.history[0]) {
                  this.router.navigateByUrl(decodeURIComponent(this.userService.history[0] || '/'));
                }
                else {
                  this.router.navigateByUrl(decodeURIComponent(window.location.pathname));
                }
              }, APPCONSTANT.LOADING_TIMEOUT);
            }
          }
        });

        this.message = [{
          severity: 'success',
          summary: '',
          detail: this.translate.instant('apiResult.login.success'),
          life: APPCONSTANT.TOAST_TIMEOUT
        }];
        this.userService.messages = [];
      },
      (err) => {
        this.isLoading = false;
        this.message = [{
          severity: 'error',
          summary: '',
          detail: this.translate.instant(`messageCode.${err.message_code}`),
          life: APPCONSTANT.TOAST_TIMEOUT
        }];
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // loginWithGoogle() {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
  //     (res) => {

  //     },
  //     (err) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Service Message',
  //         detail: err.toString(),
  //         life: APPCONSTANT.TOAST_TIMEOUT
  //       })
  //     }
  //   );
  // }
}
