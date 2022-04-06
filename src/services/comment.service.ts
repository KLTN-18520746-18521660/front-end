import { Injectable } from '@angular/core';
import Comment from 'models/comment.model';
import { commentsMockData } from 'shared/mockData/commentsMockData';
import { convertArrayToNested } from 'utils/commonFunction';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  listOrginal: any[] = commentsMockData;

  listNested: any[] = [];

  current: Comment = {
    id: '',
    parent_id: null,
    owner: {
      id: '111',
      first_name: 'Vinh',
      last_name: 'Trinh',
      email: 'tnvinh99@gmail.com',
      display_name: 'Ngọc Vĩnh',
      user_name: 'vinhtrinh',
      avatar: '',
    },
    post_id: '1',
    content: 'English translation for this series is available at ./translations/EN folder',
    status: 'Active',
    created_timestamp: new Date().toString(),
    last_modified_timestamp: new Date(Date.now() + 1).toString(),
    children: [],
  };

  getNumberComments(id: string) {
    return this.listOrginal.length;
  }

  getComments(id: string) {
    // Call api to get comments
    return this.listNested;
  }

  constructor() {
    this.convertToNested();
    this.sortComments();
  }

  addComment(comment: Comment) {
    this.listOrginal.unshift(comment);
  }

  convertToNested(list: any[] = this.listOrginal) {
    const result = convertArrayToNested(list, 'parent_id');
    this.listNested = result;
    return result;
  }

  sortComments(sortField = 'created_timestamp', sortOrder = 'asc', list: any[] = this.listNested) {
    list = _.orderBy(list, [sortField], [sortOrder]);
    list.map((item) => {
      if (item.children && item.children.length > 0) {
        this.sortComments(sortField, sortOrder, item.children);
      }
    });
    this.listNested = list;
    return list;
  }
}
