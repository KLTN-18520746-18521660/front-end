import { PasswordPolicy } from './../../models/appconfig.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConfigService } from 'services/app.config.service';
import { AppConfig } from 'models/appconfig.model';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { AuthService } from 'services/auth.service';
import { LoginUserModel } from 'models/user.model';
import { Message, MessageService } from 'primeng/api';
import { APPCONSTANT } from 'utils/appConstant';
import { UserService } from 'services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
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
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

    // this.subscription = this.userService.authUpdate$.subscribe(res => {
    //   if (res.isAuthenticated) {
    //     this.router.navigate(['/']);
    //   }
    // });

    this.form = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      remember: new FormControl(''),
    });

    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null,
        [
          Validators.required,
          // Validators.minLength(this.passwordPolicy.min_len || APPCONSTANT.PASSWORD_POLICY.MIN_LEN),
          // Validators.maxLength(this.passwordPolicy.max_len || APPCONSTANT.PASSWORD_POLICY.MAX_LEN),
          // Validation.minLowerCaseChar(this.passwordPolicy.min_lower_char || APPCONSTANT.PASSWORD_POLICY.MIN_LOWER_CHAR),
          // Validation.minUpperCaseChar(this.passwordPolicy.min_upper_char || APPCONSTANT.PASSWORD_POLICY.MIN_UPPER_CHAR),
          // Validation.minNumberChar(this.passwordPolicy.min_number_char || APPCONSTANT.PASSWORD_POLICY.MIN_NUMBER_CHAR),
          // Validation.minSpecialChar(this.passwordPolicy.min_special_char || APPCONSTANT.PASSWORD_POLICY.MIN_SPECIAL_CHAR),
        ]
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
      user_name: email,
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
                this.router.navigate([this.returnUrl]);
              }, APPCONSTANT.LOADING_TIMEOUT);
            }
            else {
              setTimeout(() => {
                this.router.navigate([this.userService.history[0] || '/']);
              }, APPCONSTANT.LOADING_TIMEOUT);
            }
          }
        });

        this.message = [{
          severity: 'success',
          summary: '',
          detail: 'Login Success!!!!!!!!',
          life: APPCONSTANT.TOAST_TIMEOUT
        }];
        this.userService.messages = [];
      },
      (err) => {
        this.isLoading = false;
        this.message = [{
          severity: 'error',
          summary: '',
          detail: err.message,
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
