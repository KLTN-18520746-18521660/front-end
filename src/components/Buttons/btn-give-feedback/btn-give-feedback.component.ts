import { ReportSendModel } from 'models/report.model';
import { PostsService } from 'services/posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-give-feedback',
  templateUrl: './btn-give-feedback.component.html',
  styleUrls: ['./btn-give-feedback.component.scss']
})
export class BtnGiveFeedbackComponent implements OnInit {

  display: boolean = false;

  isLoading: boolean = false;

  content: string = '';

  success: boolean = false;

  empty: boolean = false;

  feedbackSubscription: Subscription;

  constructor(
    private postService: PostsService
  ) { }

  ngOnInit(

  ) {
  }

  onClickFeedback() {
    this.display = true;
  }

  onChangeContent(event) {
    if (event.trim() === '') {
      this.empty = true;
    }
    else {
      this.empty = false;
    }
  }

  onClickSubmit() {
    if (this.content.trim() === '') {
      this.empty = true;
      return;
    }

    this.isLoading = true;
    const data: ReportSendModel = {
      content: this.content,
      comment_id: null,
      post_slug: null,
      user_name: null,
      report_type: 'others'
    }

    this.feedbackSubscription = this.postService.sendReport('feedback', data).subscribe(
      () => {
        this.success = true;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onClickClose() {
    this.display = false;
    // this.content = '';
    // this.success = false;
  }

  ngOnDestroy() {
    if (this.feedbackSubscription) {
      this.feedbackSubscription.unsubscribe();
    }
  }

}
