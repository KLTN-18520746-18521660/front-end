import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private title: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.translate.instant('label.notfound.pageTitle'));
  }

}
