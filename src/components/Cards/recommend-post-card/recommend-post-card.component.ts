import Post from 'models/post.model';
import { Component, Input, OnInit } from '@angular/core';
import { postsMockData } from 'shared/mockData/postsMockData';
import { TranslateService } from '@ngx-translate/core';
import { mapActionWithPost, convertDateTime } from 'utils/commonFunction';
@Component({
  selector: 'app-recommend-post-card',
  templateUrl: './recommend-post-card.component.html',
  styleUrls: ['./recommend-post-card.component.scss']
})
export class RecommendPostCardComponent implements OnInit {

  @Input() loading: boolean = false;

  @Input() post: Post = postsMockData[0];

  @Input() isSmall: boolean = true;

  @Input() showStatus: boolean = false;

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    if (!this.loading) {
      this.post = {
        ...this.post,
        fromNow: {
          created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, false, true),
          approved: convertDateTime(this.post.approved_timestamp, this.translate.currentLang, false, true),
        }
      };

      this.post.mapAction = mapActionWithPost(this.post.actions || []);
    }
  }

}
