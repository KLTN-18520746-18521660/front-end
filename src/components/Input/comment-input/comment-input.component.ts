import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent implements OnInit {

  form: FormGroup = new FormGroup({
    value: new FormControl('')
  })

  @Output() submit = new EventEmitter<any>();

  @Input() isShow: boolean = true;

  @Input() isLoading: boolean = false;

  @Input() parent_id: string = null;

  value: string;

  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      value: [null, [Validators.required]]
    })
  }

  getValue() {
    return this.form.get('value').value;
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.form.invalid) {
      if (this.form.value.value.trim()) {
        this.submit.emit(this.form.value.value.trim());
        this.form.get('value').setValue('');
        this.submitted = false;
      }
    }
    this.isLoading = false;
  }
}