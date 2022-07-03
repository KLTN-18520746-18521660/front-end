import { getDifferenceObject } from 'utils/commonFunction';
import { Component, Input, OnInit, Output } from '@angular/core';
import Post from 'models/post.model';
import _ from 'lodash';

@Component({
  selector: 'app-compare-post',
  templateUrl: './compare-post.component.html',
  styleUrls: ['./compare-post.component.scss']
})
export class ComparePostComponent implements OnInit {

  @Input() post: Post;

  @Input() pending: Post;

  newPost: Post;

  oldPost: Post;

  outputDiff: {
    key: string;
    old: any;
    new: any;
  }[] = [];

  constructor() { }

  ngOnInit() {
    this.compareDiff();
  }

  compareDiff() {
    this.newPost = getDifferenceObject(this.post, this.pending);
    this.newPost = _.omitBy(this.newPost, _.isNull);
    this.newPost = _.omitBy(this.newPost, _.isUndefined);
    delete this.newPost.last_modified_timestamp;

    this.oldPost = _.pick(this.post, Object.keys(this.newPost));

    for (const key in this.newPost) {
      if (typeof this.newPost[key] === 'string') {
        this.outputDiff.push({
          key,
          old: this.oldPost[key],
          new: this.newPost[key]
        });
      }
      else {
        this.outputDiff.push({
          key,
          old: this.oldPost[key],
          new: this.newPost[key]
        });
      }
    }
  }

}