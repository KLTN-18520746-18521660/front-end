import { MenuItem } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Post from 'models/post.model';
import { postsMockData } from 'shared/mockData/postsMockData';
import { mapActionWithPost } from 'utils/commonFunction';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() isSmall: boolean = false;

  @Input() isGrid = false;

  @Input() post: Post;

  menuitem: MenuItem[] = [
    {
      id: 'save',
      label: '',
      icon: 'pi pi-bookmark-fill',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'copy',
      label: '',
      icon: 'pi pi-copy',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'share',
      label: '',
      icon: 'pi pi-share-alt',
      command: (event) => {
        console.log(event);
      }
    },
    {
      id: 'report',
      label: '',
      icon: 'pi pi-flag-fill',
      command: (event) => {
        console.log(event);
      }
    }
  ]

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.post = {
      ...this.post,
      fromNow: {
        created: dayjs(this.post.created_timestamp).fromNow(true),
      }
    };

    this.post.mapAction = mapActionWithPost(this.post.actions || []);

    this.translate.get('card.action').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });
  }

}
