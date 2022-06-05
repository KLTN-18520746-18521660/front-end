import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-SearchPage',
  templateUrl: './SearchPage.component.html',
  styleUrls: ['./SearchPage.component.scss']
})
export class SearchPageComponent implements OnInit {

  keyword: string;

  isLoading: boolean = false;

  routeItems: MenuItem[];

  routeSubscription: Subscription;

  @ViewChild('inputQuery') searchInput: ElementRef;

  constructor(
    private route: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.keyword = params.q || null;
      if (this.keyword) {
        this.title.setTitle(this.translate.instant('search.title.result', { query: this.keyword }));
      }
      else {
        this.title.setTitle(this.translate.instant('search.title.search'));
      }
    });

    this.renderTabMenu();
  }

  renderTabMenu() {
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

  onSearch() {
    const query = this.searchInput.nativeElement.value;
    this.keyword = query;
    this.renderTabMenu();
    this.route.navigate([], {
      queryParams: {
        q: query
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
