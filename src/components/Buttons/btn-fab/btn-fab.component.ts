import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-btn-fab',
  templateUrl: './btn-fab.component.html',
  styleUrls: ['./btn-fab.component.scss']
})
export class BtnFabComponent implements OnInit {
  @Input() data = {
    id: 'facebook',
    name: 'Facebook',
    icon: 'pi-facebook',
    color: '',
    style: 'p-button-rounded'
  }

  constructor() { }

  ngOnInit() {
  }

}
