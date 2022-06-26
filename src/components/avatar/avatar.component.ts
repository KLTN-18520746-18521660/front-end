import { Component, Input, OnInit } from '@angular/core';
import User from 'models/user.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() user: User;

  @Input() height: string = '3rem';

  @Input() badge: string;

  @Input() badgeClass: string;

  colorMapping = {
    A: 'surface-500',
    B: 'bg-blue-500',
    C: 'bg-green-500',
    D: 'bg-yellow-500',
    E: 'bg-orange-500',
    F: 'bg-cyan-500',
    G: 'bg-pink-500',
    H: 'bg-indigo-500',
    I: 'bg-teal-500',
    J: 'bg-bluegray-500',
    K: 'bg-purple-500',
    L: 'bg-gray-500',
    M: 'surface-700',
    N: 'bg-blue-700',
    O: 'bg-green-700',
    P: 'bg-yellow-700',
    Q: 'bg-orange-700',
    R: 'bg-cyan-700',
    S: 'bg-pink-700',
    T: 'bg-indigo-700',
    U: 'bg-teal-700',
    V: 'bg-bluegray-700',
    W: 'bg-purple-700',
    X: 'bg-gray-700',
    Y: 'bg-yellow-700',
    Z: 'bg-blue-700'
  }
  className: string = '';

  borderColor: string = '';

  constructor() { }

  ngOnInit() {
    if (this.user.avatar) {
      return;
    }
    this.className = 'text-100 ' +
      (this.colorMapping[this.user.display_name.substring(0, 1).toUpperCase()] || 'bg-gray-500');

    this.borderColor = this.colorMapping[this.user.display_name.substring(0, 1).toUpperCase()] || 'bg-gray-500';
    this.borderColor = this.borderColor.replace('bg-', '');
  }

}
