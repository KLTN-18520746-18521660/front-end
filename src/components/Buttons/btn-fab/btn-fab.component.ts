import { Component, OnInit, Input } from '@angular/core';
import { LinkItem } from 'models/app.model';

@Component({
  selector: 'app-btn-fab',
  templateUrl: './btn-fab.component.html',
  styleUrls: ['./btn-fab.component.scss']
})
export class BtnFabComponent implements OnInit {

  @Input() showValue = false;

  @Input() isLoading: boolean = false;

  @Input() data: LinkItem;

  @Input() width: string = '';

  constructor() { }

  ngOnInit() {
  }

}
