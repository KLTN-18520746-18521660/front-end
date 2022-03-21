import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

  breadcrumbItems: MenuItem[];

  home: MenuItem;

  post: any = {
    postId: 1,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777588/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png',
    owner: {
      uid: 2,
      username: 'Jenny Wilson',
      avatar: 'https://via.placeholder.com/150x150'
    },
    created_at: '2022-03-03 12:00:00',
    updated_at: '2022-03-08 12:00:00',
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
  };

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.breadcrumbItems = [
      { label: 'Technology', url: 'technology' },
      { label: 'Angular', url: 'tag/angular' },
      { label: 'Angularrrrrrrrrrrrrrr' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.post = { 
      ...this.post, 
      createdTime: dayjs(this.post.created_at).fromNow(),
      UpdatedTime: dayjs(this.post.updated_at).fromNow() || null
    };
  }

}
