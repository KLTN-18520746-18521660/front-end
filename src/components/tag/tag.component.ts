import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Tag from 'models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag: Tag;

  @Input() size = 'sm';

  @Input() color = 'bg-indigo'

  @Input() width = '';
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.tag.short = this.tag.tag?.replace(/\s/g, '');
  }

  onClickTag() {
    this.router.navigate(['/tag', this.tag.id]);
  }

}
