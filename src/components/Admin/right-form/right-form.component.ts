import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RightDetail } from 'models/Admins/role_right.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-right-form',
  templateUrl: './right-form.component.html',
  styleUrls: ['./right-form.component.scss']
})
export class RightFormComponent implements OnInit {

  @Output() onChange: EventEmitter<RightDetail> = new EventEmitter<RightDetail>();

  @Input() right: RightDetail;

  @Input() loading: boolean = false;

  form: FormGroup;

  subscription: Subscription;

  selectSubscription: Subscription;

  constructor(
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      selected: new FormControl(this.right?.selected || false),
      read: new FormControl({ value: this.right?.read || false, disabled: !this.right?.selected || false }),
      write: new FormControl({ value: this.right?.write || false, disabled: !this.right?.selected || false }),
    });

    this.subscription = this.form.valueChanges.subscribe(
      (res: RightDetail) => {
        this.onChange.emit({
          key: this.right?.key,
          display_name: this.right?.display_name,
          describe: this.right?.describe,
          read: res?.read || false,
          write: res?.write || false,
          selected: res.selected,
        });
      }
    );

    this.selectSubscription = this.form.get('selected').valueChanges.subscribe(
      (res: boolean) => {
        if (res) {
          this.form.get('read').enable();
          this.form.get('write').enable();
        }
        else {
          this.form.get('read').disable();
          this.form.get('write').disable();
        }
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.selectSubscription) {
      this.selectSubscription.unsubscribe();
    }
  }

}
