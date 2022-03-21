import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() label: string = 'My Button';

  @Input() loading: boolean = false;

  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'help' | 'plain' = 'primary';

  @Input() icon: string = 'pi pi-user-plus';

  @Input() size: 'sm' | 'lg' | '' = '';

  @Input() badge: number = 0;

  @Input() iconLeft: boolean = true;

  @Input() disabled: boolean = true;

  @Input() className: string = '';

  @Input() outline: boolean = false;

  @Input() raised: boolean = false;

  @Input() rounded: boolean = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  classButton: string = '';

  constructor() { }

  ngOnInit() {
    this.classButton = `${this.size ? 'p-button-' + this.size : 'p-button'} p-button-${this.color} ${this.className} ${this.outline ? 'p-button-outlined' : ''} ${this.raised ? 'p-button-raised p-button-text' : ''} ${this.rounded ? 'p-button-rounded' : ''}`;
  }

  handleClick() {
    this.onClick.emit();
  }

}
