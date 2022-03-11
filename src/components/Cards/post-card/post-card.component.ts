import { MenuItem } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() isSmall: boolean = false;

  @Input() isGrid = false;

  @Input() post: any = {
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

  menuitem: MenuItem[] = [
    {
      label: '',
      icon: 'pi pi-bookmark-fill',
      command: (event) => {
        console.log(event);
      }
    },
    {
      label: '',
      icon: 'pi pi-copy',
      command: (event) => {
        console.log(event);
      }
    },
    {
      label: '',
      icon: 'pi pi-share-alt',
      command: (event) => {
        console.log(event);
      }
    }
  ]

  constructor(private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.post = { ...this.post, fromNow: dayjs(this.post.created_at).fromNow() };

    this.translate.get('card.action').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });
  }

  onClickAvatar() {
    this.router.navigate(['/user', this.post.owner.uid])
  }

  onClickReadMore() {
    this.router.navigate(['/post', this.post.id])
  }

}
