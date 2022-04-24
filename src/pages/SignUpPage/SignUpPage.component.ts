import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { AppConfig } from 'models/appconfig';
import { SignUpUserModel } from 'models/user.model';
import { ConfigService } from 'services/app.config.service';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { APPCONSTANT } from 'utils/appConstant';
import Validation from 'utils/validation';
@Component({
  selector: 'app-SignUpPage',
  templateUrl: './SignUpPage.component.html',
  styleUrls: ['./SignUpPage.component.scss'],
  providers: [MessageService]
})
export class SignUpPageComponent implements OnInit {

  form: FormGroup;

  submitted = false;

  isLoading: boolean = false;

  config: AppConfig;

  subscription: Subscription;

  message: Message[];

  constructor(
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.message = [];
    this.subscription = this.userService.authUpdate$.subscribe(res => {
      console.log(res);
      if (res.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });

    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    this.form = new FormGroup({
      email: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      acceptTerms: new FormControl('')
    });

    this.form = this.formBuilder.group(
      {
        firstname: [null, Validators.required],
        lastname: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
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
    const { email, firstname, lastname, password, confirmPassword } = this.form.value;

    const user = new SignUpUserModel({
      email,
      first_name: firstname,
      last_name: lastname,
      password,
      confirm_password: confirmPassword,
      settings: {
        test: 'test'
      }
    });

    this.authService.register(user).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.userService.messages = this.message = [{
          severity: 'success',
          summary: '',
          detail: 'Check your email for verification link or login now at here',
          life: APPCONSTANT.TOAST_TIMEOUT
        }];
        this.router.navigate(['/auth/login']);
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
        this.message = [{
          severity: 'error',
          summary: '',
          detail: err.error,
          life: APPCONSTANT.TOAST_TIMEOUT,
        }]
      }
    );
  }

}
