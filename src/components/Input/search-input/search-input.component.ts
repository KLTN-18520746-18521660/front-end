import { ApiParams } from 'models/api.model';
import { PostsService } from 'services/posts.service';
import { AppConfig } from 'models/appconfig.model';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Tag } from 'models/tag.model';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { randomArray } from 'utils/commonFunction';
import { query } from '@angular/animations';
import { AppConfigService } from 'services/app.config.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Input() query: string = '';

  @Output() onSearch = new EventEmitter<string>();

  @Input() wFull: boolean = false;

  @Input() hasAnimation: boolean = false;

  @Input() showPopular: boolean = true;

  form: FormGroup;

  popularTags: Tag[] = [];

  userName: string;

  showButton: boolean = false;

  isFocus: boolean = false;

  isLoadingTag: boolean = false;

  config: AppConfig;

  getTagSubscription: Subscription;

  configSubscription: Subscription;

  authSubscription: Subscription;

  subscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private postService: PostsService,
    private configService: AppConfigService,
  ) { }

  ngOnInit() {
    this.getTrendingTags();

    this.form = new FormGroup({
      search: new FormControl(this.query)
    });

    this.config = this.configService.config;
    this.configSubscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });

    this.showButton = this.query?.length > 0;

    this.subscription = this.form.valueChanges.subscribe((e) => {
      if (e.search !== '') {
        this.showButton = true;
      }
      else {
        this.showButton = false;
      }
    });

    if (this.userService.isAuthenticated) {
      this.userName = this.userService.user?.display_name
    }

    this.authSubscription = this.userService.authUpdate$.subscribe(res => {
      if (res.isAuthenticated) {
        this.userName = res.user.display_name;
      }
      else {
        this.userName = null;
      }
    })
  }

  getTrendingTags() {
    this.isLoadingTag = true;

    const params: ApiParams = {
      start: 0,
      size: 6
    };

    this.getTagSubscription = this.postService.getTrendingTags(params).subscribe(
      (res) => {
        this.isLoadingTag = false;
        this.popularTags = res.data.tags;
      },
      (err) => {
        this.popularTags = [];
        this.isLoadingTag = false;
      }
    );
  }

  onSubmit() {
    if (this.form.value.search.trim()) {
      this.router.navigate(
        ['/search'],
        {
          queryParams: {
            q: this.form.value.search
          },
        });
      this.onSearch.emit(this.form.value.search);
    }
    // this.form.get('search').setValue('');
  }

  onFocus() {
    this.isFocus = true;
  }

  onBlur() {
    if (this.form.value.search === '') {
      this.isFocus = false;
    }
  }

  onClear() {
    this.form.get('search').setValue('');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.getTagSubscription) {
      this.getTagSubscription.unsubscribe();
    }
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
