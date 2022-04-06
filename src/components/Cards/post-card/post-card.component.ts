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

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() isSmall: boolean = false;

  @Input() isGrid = false;

  @Input() post: Post = postsMockData[0];

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

  constructor(private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    dayjs.extend(relativeTime);
    dayjs.locale(this.translate.currentLang);
    this.post = {
      ...this.post,
      fromNow: {
        created: dayjs(this.post.created_timestamp).fromNow(),
      }
    };

    this.translate.get('card.action').subscribe((res) => {
      let result = Object.values(res) as [];
      this.menuitem.map((item, index) => {
        item.label = result[index]
      })
    });
  }

  onClickAvatar() {
    this.router.navigate(['/user', this.post.owner.id])
  }

  onClickReadMore() {
    this.router.navigate(['/post', this.post.id])
  }

}
