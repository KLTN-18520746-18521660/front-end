import ApiResult from 'models/api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Comment from 'models/comment.model';
import { commentsMockData } from 'shared/mockData/commentsMockData';
import { convertArrayToNested, removeChildrenByLevel } from 'utils/commonFunction';
import _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  current_Slug: string;

  constructor(
    private http: HttpClient
  ) { }

  getCommentByPostSlug(postSlug: string, sessionId, params = {}): Observable<ApiResult> {
    if (sessionId) {
      return this.http.get<ApiResult>(BASE_URL + REST_URL.COMMENT_POST + `/${postSlug}`, { ...httpOptions, headers: { session_token: sessionId }, params }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.http.get<ApiResult>(BASE_URL + REST_URL.COMMENT_POST + `/${postSlug}`, { ...httpOptions, params }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  postComment(postSlug: string, parenId: number, content: string, sessionId: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.COMMENT_POST + `/${postSlug}`, { parent_id: parenId, content }, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteComment(commentId, sessionId): Observable<ApiResult> {
    return this.http.delete<ApiResult>(BASE_URL + REST_URL.COMMENT + `/${commentId}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithComment(commentId: number, action: ActionType, sessionId: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.COMMENT + `/${commentId}`, {}, { ...httpOptions, headers: { session_token: sessionId }, params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  convertToNested(list: any[]) {
    let result = convertArrayToNested(list, 'parent_id');
    result = removeChildrenByLevel(result, 3);
    // this.listNested = result;
    return result;
  }

  sortComments(sortField = 'created_timestamp', sortOrder = 'asc', list: any[]) {
    list = _.orderBy(list, [sortField], [sortOrder]);
    list.map((item) => {
      if (item.children && item.children.length > 0) {
        this.sortComments(sortField, sortOrder, item.children);
      }
    });
    // this.listNested = list;
    return list;
  }
}
