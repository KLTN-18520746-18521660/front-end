import { Observable, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import User from 'models/user.model';
import { UserService } from 'services/user.service';
import { ConfirmationService, Message } from 'primeng/api';
import { PostsService } from 'services/posts.service';
import { FileUpload } from 'primeng/fileupload';
import _ from 'lodash';
import { getDifferenceObject } from 'utils/commonFunction';
import { COUNTRY } from 'utils/appConstant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-edit-info',
  templateUrl: './user-edit-info.component.html',
  styleUrls: ['./user-edit-info.component.scss']
})
export class UserEditInfoComponent implements OnInit {
  form: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    display_name: new FormControl(''),
    // email: new FormControl(''),
    // user_name: new FormControl(''),
    description: new FormControl(''),
    sex: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    province: new FormControl(''),
    avatar: new FormControl(''),
    // publics: new FormControl([]),
  });

  user: User;

  initData: any;

  isLoading: boolean = false;

  getSubscription: Subscription;

  subscription: Subscription;

  uploadSubcription: Subscription;

  editingSubcription: Subscription;

  editing: boolean = false;

  submitted: boolean = false;

  message: Message[] = [];

  selectedCountry: {
    name: string;
    code: string;
  };

  countries: {
    name: string;
    code: string;
  }[];

  isSelect: boolean = false;

  @ViewChild('fileUpload') fileUpload: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostsService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.countries = COUNTRY.data;
    this.getUserInfo();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return !this.editing;
  }

  getUserInfo() {
    this.isLoading = true;
    this.getSubscription = this.userService.getUserInfo(this.userService.getSessionId()).subscribe(
      (res) => {
        this.user = res.data.user;

        this.isLoading = false;

        this.selectedCountry = _.find(this.countries, { name: this.user.country });

        this.form = this.formBuilder.group({
          first_name: [this.user.first_name, Validators.required],
          last_name: [this.user.last_name, Validators.required],
          display_name: [this.user.display_name, [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]],
          // email: ['', Validators.required],
          // user_name: ['', Validators.required],
          description: [this.user.description],
          sex: [this.user.sex],
          phone: [this.user.phone, [Validators.pattern('[0-9 ]{11}')]],
          country: [this.selectedCountry ? this.selectedCountry : null],
          city: [this.user.city],
          province: [this.user.province],
          avatar: [this.user.avatar],
          // publics: ['', Validators.required],
        });

        this.initData = this.form.value;

        this.editingSubcription = this.form.valueChanges.subscribe(x => {
          this.editing = true;
          if (_.isEmpty(getDifferenceObject(this.initData, x))) {
            this.editing = false;
          }
        })
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  myUploader(event) {
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
    this.uploadSubcription = this.postService.upLoadImage('user', event.files[0]).subscribe(
      (res) => {
        this.form.get('avatar').setValue(res.data.url);
        this.user.avatar = res.data.url;
        this.updateUserInfo(getDifferenceObject(this.initData, this.form.value) as any);
      },
      () => {
        this.message = [{ severity: 'error', summary: 'Error', detail: this.translate.instant('message.uploadfail') }];
      }
    );
  }

  onSelectAvatar(event) {
    //return when file size > 3MB
    if (event.files[0].size > 3000000) {
      this.message = [{ severity: 'error', summary: 'Error', detail: this.translate.instant('message.filesize') }];
      this.fileUpload.clear();
      return;
    }
    this.message = [];
    this.isSelect = true;
    this.editing = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.files[0]);
    reader.onload = (_event) => {
      this.user.avatar = reader.result as string;
    }
    // this.user.avatar = event.files[0];
  }

  onClearSelect() {
    this.user.avatar = this.initData.avatar;
    this.isSelect = false;
  }

  onErrorSelectFile(event) {
    this.editing = false;
    this.isSelect = false;
    this.message = [{ severity: 'error', summary: 'Error', detail: event.error }];
  }

  onChangeCountry(event) {
    this.selectedCountry = event.value;
  }

  onSubmit() {
    this.message = [];
    if (this.form.invalid) {
      return;
    }
    this.confirmationService.confirm({
      key: 'editUserInfo',
      message: this.translate.instant('profile.editProfile.dialog.description'),
      header: this.translate.instant('profile.editProfile.dialog.title'),
      acceptLabel: this.translate.instant('profile.editProfile.dialog.ok'),
      rejectLabel: this.translate.instant('profile.editProfile.dialog.cancel'),
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedCountry) {
          this.form.get('country').setValue(this.selectedCountry.name);
        }
        const data = getDifferenceObject(this.initData, this.form.value) as any;
        // this.submitted = true;
    
        console.log(data);
        if (this.isSelect) {
          this.fileUpload.upload();
        }
        else {
          this.updateUserInfo(data);
        }
      }
    });
  }

  updateUserInfo(data) {
    //check data is empty
    if (_.isEmpty(data)) {
      this.message = [{ severity: 'error', summary: 'Error', detail: this.translate.instant('message.nochange') }];
      this.editing = false;
      return;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isLoading = true;
    this.subscription = this.userService.editUserInfo(data).subscribe(
      (res) => {
        this.message = [{ severity: 'success', summary: '', detail: this.translate.instant('message.update') }];
        this.user = res.data.user;

        this.userService.authUpdate.next({
          session_id: this.userService.getSessionId(),
          user: res.data.user,
          isAuthenticated: true,
          remember: this.userService.remember,
          error: false
        });
        if (this.selectedCountry) {
          this.form.get('country').setValue(this.selectedCountry);
        }
        this.isLoading = false;
        this.isSelect = false;
        this.editing = false;
      },
      () => {
        this.editing = false;
        this.isLoading = false;
        this.message = [{ severity: 'error', summary: 'Error', detail: this.translate.instant('message.updateFail') }];
      }
    );
  }

  ngOnDestroy() {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.uploadSubcription) {
      this.uploadSubcription.unsubscribe();
    }
    if (this.editingSubcription) {
      this.editingSubcription.unsubscribe();
    }
  }
}
