import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tag } from 'models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag: Tag;

  /**
   * xs, sm, base, lg, xl
   */
  @Input() size: string = 'sm';

  @Input() color = 'bg-indigo'

  @Input() width = '';

  @Input() loading: boolean = false;
  
  constructor(private router: Router) { }

  ngOnInit() {
    // this.tag.name = this.tag.tag?.replace(/\s/g, '');
  }
}
