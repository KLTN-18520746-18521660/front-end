import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import Post from 'models/post.model';
import { convertDateTime } from 'utils/commonFunction';

@Component({
  selector: 'app-view-detail-post',
  templateUrl: './view-detail-post.component.html',
  styleUrls: ['./view-detail-post.component.scss']
})
export class ViewDetailPostComponent implements OnInit {

  @Input() post: Post;

  @Input() menu: MenuItem[];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.post.fromNow = {
      created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, true, false),
      approved: convertDateTime(this.post.approved_timestamp, this.translate.currentLang, true, false),
      updated: this.post.last_modified_timestamp ? convertDateTime(this.post.last_modified_timestamp, this.translate.currentLang, true, false) : null
    }
  }

}