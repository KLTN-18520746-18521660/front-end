import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

@Component({
  selector: 'app-post-card-vertical',
  templateUrl: './post-card-vertical.component.html',
  styleUrls: ['./post-card-vertical.component.scss']
})
export class PostCardVerticalComponent implements OnInit {

  @Input() post: any = {
    id: 2,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
    owner: {
      uid: 2,
      username: '@john_doe',
      display_name: 'Jenny Wilson',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: new Date(),
    time_read: '1',
    view: 3200,
    comments: 125121,
    likes: 30210,
    tags: [{
      id: 'angular',
      name: 'Angular'
    },
    {
      id: 'javascript',
      name: 'JavaScript'
    },
    {
      id: 'typescript',
      name: 'TypeScript'
    }]
  }

  constructor(
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);

    this.post = {
      ...this.post,
      fromNow: {
        created: dayjs(this.post.created_timestamp).fromNow(),
        updated: dayjs(this.post.last_modified_timestamp)?.fromNow() || null
      }
    }
  }

}
