import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Post from 'models/post.model';
import { convertDateTime, mapActionWithPost } from 'utils/commonFunction';

@Component({
  selector: 'app-post-card-vertical',
  templateUrl: './post-card-vertical.component.html',
  styleUrls: ['./post-card-vertical.component.scss']
})
export class PostCardVerticalComponent implements OnInit {

  @Input() post: Post;

  @Input() loading: boolean = false;

  @Input() showAction: boolean = false;

  constructor(
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    if (this.loading) {
      return;
    }

    this.post = {
      ...this.post,
      fromNow: {
        created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, true, false),
        approved: convertDateTime(this.post.approved_timestamp, this.translate.currentLang, true, false),
        updated: convertDateTime(this.post.last_modified_timestamp, this.translate.currentLang, true, false) || null
      }
    }

    this.post.mapAction = mapActionWithPost(this.post.actions || []);
  }

}
