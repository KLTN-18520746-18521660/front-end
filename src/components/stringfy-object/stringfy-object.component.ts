import { Component, Input, OnInit } from '@angular/core';
import stringifyObject from 'stringify-object';

@Component({
  selector: 'app-stringfy-object',
  templateUrl: './stringfy-object.component.html',
  styleUrls: ['./stringfy-object.component.scss']
})
export class StringfyObjectComponent implements OnInit {

  @Input() object: any;

  stringfy: string = '';

  constructor() { }

  ngOnInit() {
    this.stringfy = stringifyObject(this.object, {
      indent: '   ',
      singleQuotes: false,
    });
    console.log(this.stringfy);
  }

}
