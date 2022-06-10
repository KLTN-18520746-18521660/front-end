import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss']
})
export class NoAccessComponent implements OnInit {

  @Input() visible: boolean = true;

  options: AnimationOptions = {
    path: '/assets/jsons/acces-denied.json',
  };

  constructor(
    private title: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.visible) {
      return;
    }
    this.title.setTitle(this.translate.instant('label.noAccess.pageTitle'));
  }
}
