import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-SearchPage',
  templateUrl: './SearchPage.component.html',
  styleUrls: ['./SearchPage.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
    });
  }

  ngOnInit() {
  }

}
