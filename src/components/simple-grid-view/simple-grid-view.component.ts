import { SafeHtml } from '@angular/platform-browser';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-grid-view',
  templateUrl: './simple-grid-view.component.html',
  styleUrls: ['./simple-grid-view.component.scss']
})
export class SimpleGridViewComponent implements OnInit {

  @Input() data: {
    [key: string]: any;
  }

  html: SafeHtml = '';

  constructor() { }

  ngOnInit() {
    if (!this.data) {
      return;
    }
    if (Object.keys(this.data).length > 0) {
      Object.entries(this.data).forEach(([key, value]) => {
        this.html += this.loopObject(key, value);
      });
    }
  }

  loopObject(key: string, value: any): string {
    if (value === null) {
      return this.renderHTML(key, JSON.stringify(value));
    }
    else if (typeof value === 'object') {
      let html = '';

      if (Array.isArray(value) && value.length > 0 && (typeof value[0] === 'string' || typeof value[0] === 'number')) {
        return this.renderHTML(key, value.join(', '));
      }
      else {
        if (Object.keys(value).length > 0) {
          Object.entries(value).forEach(([key, value]) => {
            html += this.loopObject(key, value);
          });
          return html;
        }
        else {
          return this.renderHTML(key, JSON.stringify(value));
        }
      }
    }
    else {
      return this.renderHTML(key, JSON.stringify(value));
    }
  }

  renderHTML(key: string, value: string) {
    const tempKey = key.replace(/[_]/g, ' ');
    return `
      <dt class="col-4 pt-0 capitalize font-semibold" title="${key}">${tempKey}</dt>
      <dd class="ml-0 pt-0 col-8 break-word"><textarea disabled>${value}</textarea></code></pre></dd>
    `;
  }

}
