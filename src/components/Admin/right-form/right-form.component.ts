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

  disabled: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      selected: new FormControl(this.right?.selected || false),
      read: new FormControl(this.right?.read || false),
      write: new FormControl(this.right?.write || false),
    });

    if (!this.right.selected) {
      this.disabled = true;
    }
    else {
      this.disabled = false;
    }

    this.subscription = this.form.valueChanges.subscribe(
      (res: RightDetail) => {

        //disable form for read and write if selected is false
        if (!res.selected) {
          this.disabled = true;
        }
        else {
          this.disabled = false;
        }

        this.onChange.emit({
          key: this.right?.key,
          display_name: this.right?.display_name,
          read: res.read,
          write: res.write,
          selected: res.selected,
        });
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
  }

}
