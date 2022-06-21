import { Component, Input, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Post from 'models/post.model';
import { MenuItem } from 'primeng/api';
import { convertDateTime } from 'utils/commonFunction';

@Component({
  selector: 'app-view-detail-post',
  templateUrl: './view-detail-post.component.html',
  styleUrls: ['./view-detail-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDetailPostComponent implements OnInit {

  @Input() post: Post;

  @Input() menu: MenuItem[];

  @Input() viewImage: boolean = false;

  @Output() onClickImage = new EventEmitter<any>();

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.post.fromNow = {
      created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, true, false),
      approved: this.post.approved_timestamp ? convertDateTime(this.post.approved_timestamp, this.translate.currentLang, true, false) : null,
      updated: this.post.last_modified_timestamp ? convertDateTime(this.post.last_modified_timestamp, this.translate.currentLang, true, false) : null
    }
  }

  onClick(event) {
    this.onClickImage.emit(event);
  }

}
