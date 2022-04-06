import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Tag from 'models/tag.model';
import { tagsMockData } from 'shared/mockData/tagsMockData';
import { randomArray } from 'utils/commonFunction';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Input() onSearch = new EventEmitter<string>();

  form: FormGroup = new FormGroup({
    search: new FormControl('')
  })

  tags: Tag[] = randomArray(tagsMockData, 5)

  params = {
    name: "Vinh"
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.value.search.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.form.value.search } });
      this.onSearch.emit(this.form.value.search);
    }
    this.form.get('search').setValue('');
  }
}
