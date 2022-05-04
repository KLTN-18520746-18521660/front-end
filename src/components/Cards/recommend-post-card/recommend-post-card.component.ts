import { convertDateTime } from './../../../utils/commonFunction';
import Post from 'models/post.model';
import { Component, Input, OnInit } from '@angular/core';
import { postsMockData } from 'shared/mockData/postsMockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TranslateService } from '@ngx-translate/core';
import { mapActionWithPost } from 'utils/commonFunction';
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
      dayjs.extend(relativeTime);
      dayjs.locale(this.translate.currentLang);
      this.post = {
        ...this.post,
        fromNow: {
          created: convertDateTime(this.post.created_timestamp, this.translate.currentLang, false),
        }
      };

      this.post.mapAction = mapActionWithPost(this.post.actions || []);
    }
  }

}
