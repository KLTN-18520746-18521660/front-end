import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Tag from 'models/tag.model';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { randomArray } from 'utils/commonFunction';
import { query } from '@angular/animations';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Input() query: string = '';

  @Output() onSearch = new EventEmitter<string>();

  @Input() wFull: boolean = false;

  form: FormGroup;

  tags: Tag[] = randomArray(tagsMockData, 5);

  params: any;

  showButton: boolean = false;

  isFocus: boolean = false;

  subscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      search: new FormControl(this.query)
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
  }

  onSubmit() {
    if (this.userService.user) {
      this.params = {
        name: this.userService.user?.display_name
      }
    }
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
  }
}
