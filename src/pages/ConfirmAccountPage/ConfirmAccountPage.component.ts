import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-ConfirmAccountPage',
  templateUrl: './ConfirmAccountPage.component.html',
  styleUrls: ['./ConfirmAccountPage.component.scss']
})
export class ConfirmAccountPageComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted: boolean = false;

  params: any = {};

  user: any = {};

  isLoading: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.queryParams.subscribe(res => {
      this.params = res;
      this.authService.confirmUser(this.params).subscribe(
        (res: any) => {
          if (res?.data) {
            this.user = res?.data?.user;
            this.form.get('email').setValue(this.user?.email);
          }
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          console.log(err);
        }
      );
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
      (res) => {
        console.log(res);
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

}
