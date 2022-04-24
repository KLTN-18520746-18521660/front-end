import { ConfigService } from 'services/app.config.service';
import { Message, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLoginModel } from 'models/admin.model';
import { AdminService } from 'services/admin.service';
import { APPCONSTANT } from 'utils/appConstant';
import { Subscription } from 'rxjs';
import { AppConfig } from 'models/appconfig';
import { UserConfigService } from 'services/user-config.service';

@Component({
  selector: 'app-AdminLoginPage',
  templateUrl: './AdminLoginPage.component.html',
  styleUrls: ['./AdminLoginPage.component.scss']
})
export class AdminLoginPageComponent implements OnInit {

  submitted = false;

  isLoading: boolean = false;

  form: FormGroup;

  message: Message[];

  config: AppConfig;

  subscription: Subscription;

  isAuthenticated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private configService: ConfigService,
    private userConfig: UserConfigService
  ) { }

  ngOnInit() {
    this.message = this.adminService.messages;
    this.changeTheme('lara-light-blue', false);

    this.form = new FormGroup({
      Admin_email: this.formBuilder.control(''),
      Admin_password: this.formBuilder.control(''),
      Admin_remember: this.formBuilder.control(false)
    });

    this.form = this.formBuilder.group({
      Admin_email: ['', [Validators.required]],
      Admin_password: ['', [Validators.required]],
      Admin_remember: [false]
    });
  }

  // function go to dashboard
  goToDashboard(isAuthenticated) {
    if (isAuthenticated) {
      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 0);
    }
  }

  changeTheme(theme: string, dark: boolean) {
    let themeElement = document.getElementById('theme-css');
    this.userConfig.addConfig('theme', theme);
    themeElement.setAttribute('href', 'assets/themes/' + theme + '/theme.css');
    this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted = true;
    this.message = [];
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }
    const { Admin_email, Admin_password, Admin_remember } = this.form.value;

    const user = new AdminLoginModel({
      user_name: Admin_email,
      password: Admin_password,
      remember: Admin_remember
    });

    this.subscription = this.adminService.login(user).subscribe(
      (res: any) => {
        // this.isLoading = false;
        this.adminService.updateAdminAuth(res?.data?.session_id);
        // this.adminService.saveUser(user);
        this.message = [{
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully logged in.',
        }]

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, APPCONSTANT.LOADING_TIMEOUT);
      },
      (err: any) => {
        this.isLoading = false;
        this.message = [
          {
            severity: 'error',
            summary: '',
            detail: err.message
          }
        ]
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
