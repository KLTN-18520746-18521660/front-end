import Post from 'models/post.model';
import { Component, Input, OnInit } from '@angular/core';
import { postsMockData } from 'shared/mockData/postsMockData';
@Component({
  selector: 'app-recommend-post-card',
  templateUrl: './recommend-post-card.component.html',
  styleUrls: ['./recommend-post-card.component.scss']
})
export class RecommendPostCardComponent implements OnInit {
  @Input() post: Post = postsMockData[0];

  constructor() { }

  ngOnInit() {
  }

}
