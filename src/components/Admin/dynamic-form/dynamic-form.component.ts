import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ConfigFormat, ConfigWithFormat } from 'models/Admins/config.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Validation from 'utils/validation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Output() onChange: EventEmitter<ConfigWithFormat> = new EventEmitter();

  @Input() config: ConfigWithFormat;

  form: FormGroup;

  subscription: Subscription;

  displayKey: string;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      [this.config.key]: new FormControl(this.config.value),
    });

    this.form = this.formBuilder.group({
      [this.config.key]: [
        this.config.value,
        [
          Validators.required,
          ...(this.config.format.regex ? [Validators.pattern(this.config.format.regex)] : []),
          ...(this.config.format.min ? [Validators.min(this.config.format.min)] : []),
          ...(this.config.format.max ? [Validators.max(this.config.format.max)] : []),
          ...(this.config.format.contains ? [Validation.mustContains(this.config.format.contains)] : []),
        ]
      ],
    });

    this.subscription = this.form.get(this.config.key).valueChanges.subscribe(
      (value) => {
        if (!this.form.invalid) {
          this.onChange.emit({
            key: this.config.key,
            value,
          });
        }
        else {
          this.onChange.emit({
            key: this.config.key,
            value: this.config.value,
          });
        }
      }
    );

    this.displayKey = this.config.key.replace(/[_-]/g, ' ');
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
