import { Component, Input, OnInit } from '@angular/core';
import Notification from 'models/notification.model';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification: Notification;

  constructor() { }

  ngOnInit() {
  }

}
