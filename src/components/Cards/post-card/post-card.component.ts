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

  @Input() post: Post = {
    "owner": {
      "user_name": "only",
      "display_name": "Only Forever",
      "avatar": null,
      "status": "Activated"
    },
    "title": "NodeJS with ExpressJS and TypeScript part 1.",
    "slug": "",
    "thumbnail": "https://d1iv5z3ivlqga1.cloudfront.net/wp-content/uploads/2021/08/11150618/ho-la-nhung-developer-su-dung-ngon-ngu-lap-trinh-php-de-thiet-ke-phan-mem-1024x576.jpg",
    "time_read": 5,
    "views": 0,
    "likes": 0,
    "dislikes": 0,
    "comments": 0,
    "tags": [
      {
        "tag": "nodejs",
        "name": "nodejs"
      },
      {
        "tag": "typescript",
        "name": "typescript"
      }
    ],
    "categories": [
      {
        "name": "developer",
        "display_name": "Developer",
        "slug": "developer"
      },
      {
        "name": "blog",
        "display_name": "Blog",
        "slug": "blog"
      }
    ],
    "visited_count": 0,
    "short_content": "NodeJS with ExpressJS and TypeScript part 1.In this post we will see how to create a server with expressJS and typescript from scratch, this post will be divided into several parts",
    "status": "Pending",
    "created_timestamp": "2022-04-19T14:54:55.070073+07:00",
    "last_modified_timestamp": null,
    "id": 2,
    "actions": []
  }

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
