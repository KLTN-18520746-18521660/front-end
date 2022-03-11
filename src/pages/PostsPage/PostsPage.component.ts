import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-PostsPage',
  templateUrl: './PostsPage.component.html',
  styleUrls: ['./PostsPage.component.scss']
})
export class PostsPageComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('Posts Page');
  }

  ngOnInit() {
  }

}
