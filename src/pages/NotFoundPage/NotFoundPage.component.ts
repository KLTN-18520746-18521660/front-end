import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-NotFoundPage',
  templateUrl: './NotFoundPage.component.html',
  styleUrls: ['./NotFoundPage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent implements OnInit {

  @Input() visible: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
