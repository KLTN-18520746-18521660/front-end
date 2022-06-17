import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-ForgotPasswordPage',
  templateUrl: './ForgotPasswordPage.component.html',
  styleUrls: ['./ForgotPasswordPage.component.scss']
})
export class ForgotPasswordPageComponent implements OnInit {

  message: Message[] = [];

  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  email: string;

  success: boolean = false;

  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService 
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    const body = {
      user_name: this.form.value.email,
    }

    this.authService.sendForgotPassword(body).subscribe(
      () => {
        this.isLoading = false;
        this.success = true;
      },
      (err) => {
        this.isLoading = false;
        this.success = false;
        this.message = [{ severity: 'error', detail: this.translate.instant(`messageCode.${err.message_code}`) }];
      }
    );
  }

}
