import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ConfirmAccountPage',
  templateUrl: './ConfirmAccountPage.component.html',
  styleUrls: ['./ConfirmAccountPage.component.scss']
})
export class ConfirmAccountPageComponent implements OnInit {

  success: boolean = false;

  error: boolean = false;

  message: Message[] = [];

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted: boolean = false;

  params: any = {};

  user: any = {};

  isLoading: boolean = false;

  routerSubcription: Subscription;

  textTranslate: any;

  constructor(
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.isLoading = true;
    this.params = this.activatedRoute.snapshot.queryParams;
    this.authService.confirmUser(this.params).subscribe(
      (res) => {
        if (res?.data) {
          this.user = res?.data?.user;
          this.form.get('email').setValue(this.user?.email);
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.error = true;
        this.message = [{ severity: 'error', summary: '', detail: err.message }];
      }
    );
    this.translate.get('label.confirm').subscribe(res => {
      this.textTranslate = res;
    });
    this.form = this.formbuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.isLoading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    };

    this.authService.confirmUserPost({ ...this.params, password: this.form.get('password').value }).subscribe(
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
            detail: err.message
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
