import { TranslateService } from '@ngx-translate/core';
import { APPCONSTANT } from 'utils/appConstant';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiParams } from 'models/api.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'services/posts.service';
import { Component, Input, OnInit } from '@angular/core';
import Post from 'models/post.model';

export interface PostLog {
  id?: number;
  /**
   * action: 1: create, 2: modify
   */
  action?: string;
  timestamp?: string;
  old_value?: Post;
  new_value?: Post;
  user_id?: string;
}

export interface Timline {
  id?: number;
  title?: string;
  icon?: string;
  image?: string;
  styleClass?: string;
  color?: string;
  content?: string;
  old_value?: Post;
  new_value?: Post;
  timestamp?: string;
  user_id?: string;
}

@Component({
  selector: 'app-post-timline',
  templateUrl: './post-timline.component.html',
  styleUrls: ['./post-timline.component.scss']
})
export class PostTimlineComponent implements OnInit {

  getListSusbscription: Subscription;

  logs: PostLog[] = [];

  timelines: Timline[] = [];

  @Input() postId: number;

  isLoading: boolean = false;

  constructor(
    private postService: PostsService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.postId) {
      this.postId = this.dynamicDialogConfig.data.postId;
    }
    this.getPostTimeline();
  }

  getPostTimeline() {
    this.isLoading = true;
    this.logs = [];

    const params: ApiParams = {
      start: 0,
      size: APPCONSTANT.DEFAULT_PAGE_SIZE,
      type: "post",
      key: this.postId.toString()
    }
    this.getListSusbscription = this.postService.getPostTimelineById(params).subscribe(
      (res) => {
        this.isLoading = false;
        this.logs = res.data.logs as PostLog[];
        this.convertToTimeline(this.logs);
      }
    );
  }

  convertToTimeline(logs: PostLog[]) {
    this.timelines = [];
    logs.forEach(log => {
      const timeline: Timline = {
        id: log.id,
        image: "",
        color: "",
        content: "",
        timestamp: log.timestamp,
        user_id: log.user_id,
        old_value: log.old_value,
        new_value: log.new_value
      };
      switch (log.action) {
        case "create": {
          timeline.title = this.translate.instant("label.timeline.post.create");
          timeline.icon = "pi pi-plus";
          timeline.color = "#22C55E";
          break;
        }
        case "modify": {
          timeline.title = this.translate.instant("label.timeline.post.modify");
          timeline.icon = "pi pi-pencil";
          timeline.color = "#cc8925";
          break;
        }
        default: {
          timeline.title = log.action;
          timeline.icon = "pi pi-info-circle";
          timeline.color = "#64748B";
          break;
        }
      }
      this.timelines.push(timeline);
    });
  }

  ngOnDestroy() {
    if (this.getListSusbscription) {
      this.getListSusbscription.unsubscribe();
    }
  }

}
