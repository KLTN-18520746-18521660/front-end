import { query } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { PostsService } from 'services/posts.service';

@Component({
  selector: 'app-SearchPage',
  templateUrl: './SearchPage.component.html',
  styleUrls: ['./SearchPage.component.scss']
})
export class SearchPageComponent implements OnInit {

  keyword: string;

  isLoading: boolean = false;

  routeItems: MenuItem[];

  constructor(
    private route: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.keyword = this.activatedRoute.snapshot.queryParams.q || null;
    if (this.keyword) {
      this.title.setTitle(this.translate.instant('search.title.result', { query: this.keyword }));
    }
    else {
      this.title.setTitle(this.translate.instant('search.title.search'));
    }

    this.routeItems = [
      {
        label: this.translate.instant('search.menu.all'),
        icon: 'pi pi-fw pi-search',
        routerLink: './all',
        queryParams: {
          q: this.keyword
        }
      },
      {
        label: this.translate.instant('search.menu.post'),
        icon: 'pi pi-fw pi-book',
        badge: '1',
        tooltip: this.translate.instant('search.menu.post'),
        routerLink: './post',
        queryParams: {
          q: this.keyword
        }
      },
      {
        label: this.translate.instant('search.menu.user'),
        icon: 'pi pi-fw pi-user',
        routerLink: './user',
        queryParams: {
          q: this.keyword
        }
      },
    ];
  }

}
