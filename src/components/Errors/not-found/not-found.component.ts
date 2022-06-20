import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {

  @Input() visible: boolean = true;

  @Input() showButton: boolean = true;

  constructor(
    private title: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.visible) {
      return;
    }
    this.title.setTitle(this.translate.instant('label.notfound.pageTitle'));
  }

}
