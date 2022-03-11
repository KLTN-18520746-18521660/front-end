import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recommend-post-card',
  templateUrl: './recommend-post-card.component.html',
  styleUrls: ['./recommend-post-card.component.scss']
})
export class RecommendPostCardComponent implements OnInit {
  @Input() post: any = {
    postId: 1,
    title: 'Introducing Angular Mini Blog Series - Getting Started With Angular 8 - DEV Community',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl. Nullam euismod, nisi vel consectetur interdum, nisl nisi consectetur purus, eget egestas nisl nisi sed nisl.',
    thumbnail: 'https ://csharpcorner-mindcrackerinc.netdna-ssl.com/article/primeng-ui-components-for-angular-part-one/Images/PrimeNG%20UI%20Components%20For%20Angular%207%20Application.png',
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

  constructor() { }

  ngOnInit() {
  }

}
