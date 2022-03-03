import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClickTag() {
    this.router.navigate(['/tag', this.tag.id]);
  }

}
