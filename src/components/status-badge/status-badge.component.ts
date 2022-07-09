import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent implements OnInit {

  @Input() label: string;

  @Input() tooltip: string;

  @Input() translation: boolean = true;

  @Input() size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' = 'sm';

  status: {
    text?: string;
    color?: string;
    backgroundColor?: string;
  };

  mapStatus: {
    [key: string]: {
      text?: string;
      color?: string;
      backgroundColor?: string;
    }
  };

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {

    const text = this.translate.instant('status');
    this.mapStatus = {
      Pending: {
        text: text.Pending,
        color: 'yellow-600',
        backgroundColor: 'bg-yellow-100'
      },
      Approved: {
        text: text.Approved,
        color: 'green-600',
        backgroundColor: 'bg-green-100'
      },
      Rejected: {
        text: text.Rejected,
        color: 'pink-600',
        backgroundColor: 'bg-pink-100'
      },
      Private: {
        text: text.Private,
        color: 'gray-600',
        backgroundColor: 'bg-gray-100'
      },
      Ignored: {
        text: text.Ignored,
        color: 'bluegray-600',
        backgroundColor: 'bg-bluegray-100'
      },
      Handled: {
        text: text.Handled,
        color: 'indigo-600',
        backgroundColor: 'bg-indigo-100'
      },
      Read: {
        text: text.Read,
        color: 'blue-600',
        backgroundColor: 'bg-blue-100'
      },
      Blocked: {
        text: text.Blocked,
        color: 'orange-600',
        backgroundColor: 'bg-orange-100'
      },
      Deleted: {
        text: text.Deleted,
        color: 'teal-600',
        backgroundColor: 'bg-teal-100'
      },
      Activated: {
        text: text.Activated,
        color: 'green-600',
        backgroundColor: 'bg-green-100'
      },
      Disabled: {
        text: text.Disabled,
        color: 'gray-600',
        backgroundColor: 'bg-gray-100'
      },
      Enabled: {
        text: text.Enaled,
        color: 'blue-600',
        backgroundColor: 'bg-blue-100'
      },
      Readonly: {
        text: text.Readonly,
        color: 'orange-600',
        backgroundColor: 'bg-orange-100'
      }
    }

    this.status = this.mapStatus[this.label] || {
      text: this.label,
      color: 'blue-600',
      backgroundColor: 'bg-blue-100'
    };

    if (!this.translation) {
      this.status.text = this.label.toUpperCase();
    }
  }

}
