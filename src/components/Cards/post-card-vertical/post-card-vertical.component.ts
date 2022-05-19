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

  @Input() post: Post = {
    id: 2,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
    owner: {
      id: '2',
      user_name: '@john_doe',
      display_name: 'Jenny Wilson',
      avatar: 'https://placeimg.com/320/320'
    },
    created_timestamp: new Date().toISOString(),
    time_read: 1,
    views: 3200,
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
