import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.component.html',
  styleUrls: ['./search-all.component.scss']
})
export class SearchAllComponent implements OnInit {

  isLoading: boolean = false;

  isLoadingTag: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
