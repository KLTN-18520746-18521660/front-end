import { Component, Input, OnInit, ViewChild } from '@angular/core';
import Comment from 'models/comment.model';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { CommentInputComponent } from 'components/Input/comment-input/comment-input.component';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  @Input() comment: Comment;

  @ViewChild('replyForm') replyForm: CommentInputComponent;

  menuitem: MenuItem[] = [
    {
      id: 'like',
      label: '',
      disabled: false,
      icon: 'pi pi-thumbs-up',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'unlike',
      label: '',
      disabled: false,
      icon: 'pi pi-thumbs-down',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'reply',
      label: '',
      disabled: false,
      icon: 'pi pi-reply',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'edit',
      label: '',
      disabled: false,
      icon: 'pi pi-pencil',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'delete',
      label: '',
      disabled: false,
      icon: 'pi pi-trash',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'report',
      label: '',
      disabled: false,
      icon: 'pi pi-flag-fill',
      command: (event) => {
        this.onClickReport(event);
      }
    }
  ]

  isShowReply = false;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.comment = {
      ...this.comment,
      fromNow: {
        created: dayjs(this.comment.created_timestamp).fromNow(),
        updated: dayjs(this.comment.last_modified_timestamp)?.fromNow() || null
      }
    };

    this.translate.get('postDetail.commentMenu').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });
  }

  onClickReport(event?) {
  }

  onAddComment(event) {

  }

  onClickLike(event) {

  }

  onClickDislike(event) {
  }

  onClickReply() {
    this.isShowReply = !this.isShowReply;
  }

  onSubmitReply(event?) {
    let value = this.replyForm.form.value.value;
    if (value) {
      console.log(value); 
      this.isShowReply = false;
    }
  }
}
