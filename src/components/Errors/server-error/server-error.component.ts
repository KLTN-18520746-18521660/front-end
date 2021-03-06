import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  @Input() visible: boolean = true;

  options: AnimationOptions = {
    path: '/assets/jsons/server-error.json',
  };

  constructor(
    private title: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.visible) {
      return;
    }
    this.title.setTitle(this.translate.instant('label.serverError.pageTitle'));
  }

}
