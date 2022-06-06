import { Component, Input, OnInit } from '@angular/core';
import Category from 'models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  
  @Input() category: Category;

  @Input() loading: boolean = false;

  @Input() size = 'sm';

  @Input() color = 'bg-indigo'

  @Input() width = '';
  
  constructor() { }

  ngOnInit() {
  }

}
