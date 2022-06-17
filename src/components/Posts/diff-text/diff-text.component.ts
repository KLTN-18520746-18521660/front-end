import { Component, Input, OnInit } from '@angular/core';
import * as diff from 'diff';
import * as Diff2html from 'diff2html';
import { OutputFormatType, LineMatchingType } from 'diff2html/lib/types';

@Component({
  selector: 'app-diff-text',
  templateUrl: './diff-text.component.html',
  styleUrls: ['./diff-text.component.scss']
})
export class DiffTextComponent implements OnInit {

  @Input() oldText: any;

  @Input() newText: any;

  @Input() key: string;

  outputHtml: string;

  outputFormat: OutputFormatType = 'line-by-line';
  outputFormats: OutputFormatType[] = ['side-by-side', 'line-by-line'];

  breakLine: boolean = false;

  constructor() { }

  ngOnInit() {
    this.generateDiff();
  }

  generateDiff() {
    let diffText = '';
    if (typeof this.oldText === 'string') {
      diffText = diff.createPatch(
        this.key,
        this.oldText,
        this.newText
      );
    }
    else if (Array.isArray(this.oldText)) {
      diffText = diff.createPatch(
        this.key,
        this.oldText.map(item => item.tag || item.name).join(','),
        this.newText.join(','),
      );
    }

    this.outputHtml = Diff2html.html(diffText, {
      drawFileList: false,
      matching: 'words',
      outputFormat: this.outputFormat,
    });
  }

  onChangeFormat(event) {
    this.generateDiff();
  }

}
