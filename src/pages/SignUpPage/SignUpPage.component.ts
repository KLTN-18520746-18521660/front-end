import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { AppConfig } from 'models/appconfig';
import { SignUpUserModel } from 'models/user.model';
import { ConfigService } from 'pages/Admin/service/app.config.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
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

  constructor(
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
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
        this.messageService.add({
          severity: 'success',
          summary: 'Service Message',
          detail: res.message,
          life: APPCONSTANT.TOAST_TIMEOUT
        })
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: err.message,
          detail: err.error,
          life: APPCONSTANT.TOAST_TIMEOUT,
        })
      }
    );
  }

}
