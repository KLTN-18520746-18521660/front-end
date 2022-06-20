import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-AdminForgotPasswordPage',
  templateUrl: './AdminForgotPasswordPage.component.html',
  styleUrls: ['./AdminForgotPasswordPage.component.scss']
})
export class AdminForgotPasswordPageComponent implements OnInit {

  message: Message[] = [];

  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  email: string;

  success: boolean = false;

  submitted: boolean = false;

  subsciption: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
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

    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }

    this.subsciption = this.adminService.sendForgotPassword(body).subscribe(
      () => {
        this.isLoading = false;
        this.success = true;
      },
      (err) => {
        this.isLoading = false;
        this.success = false;
        this.message = [{ severity: 'error', detail: err.message, summary: err.error }];
      }
    );
  }

  ngOnDestroy() {
    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }
  }


}
