import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommentInput } from 'models/comment.model';
import User from 'models/user.model';
import { UserService } from 'services/user.service';


@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent implements OnInit {

  form: FormGroup = new FormGroup({
    value: new FormControl('')
  })

  @Output() submit = new EventEmitter<CommentInput>();

  @Input() isShow: boolean = true;

  @Input() replyName: string;

  @Input() isLoading: boolean = false;

  @Input() parent_id: number = null;

  @Input() autoFocus: boolean = true;

  @Input() currentUser: User = null;

  value: string;

  showButton: boolean = false;

  submitted: boolean = false;

  @ViewChild('textInput') textInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngAfterViewInit() {
    if (this.textInput?.nativeElement && this.autoFocus) {
      this.textInput.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.currentUser = this.userService.user;
    this.form = this.formBuilder.group({
      value: [null, [Validators.required]]
    });

    this.form.get('value').valueChanges.subscribe(val => {
      if (val.trim()) {
        this.showButton = true;
      }
      else {
        this.showButton = false;
      }
    });
  }

  getValue() {
    return this.form.get('value').value;
  }

  onSubmit() {
    // this.submitted = true;
    this.isLoading = true;
    if (!this.form.invalid) {
      if (this.form.value.value.trim()) {
        this.submit.emit({
          parent_id: this.parent_id,
          content: this.form.value.value.trim()
        });
        this.form.get('value').setValue('');
        this.submitted = false;
      }
    }
    this.isLoading = false;
  }
}