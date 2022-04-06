import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConfigService } from 'pages/Admin/service/app.config.service';
import { AppConfig } from 'models/appconfig';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { AuthService } from 'services/auth.service';
import { LoginUserModel } from 'models/user.model';
import { MessageService } from 'primeng/api';
import { APPCONSTANT } from 'utils/appConstant';
import { UserService } from 'services/user.service';
import { TokenService } from 'services/token.service';

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

  config: AppConfig;

  subscription: Subscription;

  constructor(
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService,
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
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
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40)
        ]
      ],
      remember: [false]
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
    });
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
      (res: any) => {
        this.isLoading = false;
        this.userService.updateAuth(res?.data?.session_id);
        this.userService.saveUser(user)
        this.messageService.add({
          severity: 'success',
          summary: 'Service Message',
          detail: res?.message,
          life: APPCONSTANT.TOAST_TIMEOUT
        })
      },
      (err: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: err.message,
          detail: err.error,
          life: APPCONSTANT.TOAST_TIMEOUT
        })
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (res) => {

      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service Message',
          detail: err.toString(),
          life: APPCONSTANT.TOAST_TIMEOUT
        })
      }
    );
  }
}
