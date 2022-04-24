import { ApiParams } from './../models/api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import ApiResult from 'models/api.model';
import Category from 'models/category.model';
import Post, { CreatePostModel } from 'models/post.model';
import Tag from 'models/tag.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getListPosts(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostBySlug(slug: string, sessionId: string): Observable<ApiResult> {
    if (sessionId) {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, httpOptions).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  getPostValuesBySlug(slug: string, sessionId: string): Observable<ApiResult> {
    if (sessionId) {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}/` + REST_URL.POST_VALUES, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}/` + REST_URL.POST_VALUES, httpOptions).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  // modifyPostByPostId(postId: string, post: CreatePostModel, sessionId: string): Observable<Post> {
  //   return this.httpClient.put<Post>(BASE_URL + REST_URL.POST_ID + `/${postId}`, post, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
  //     return throwError(handleError(error));
  //   }));
  // }

  deletePostByPostId(postId: string, sessionId: string): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(BASE_URL + REST_URL.POST_ID + `/${postId}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @param username 
   * @param params : { start, size, search_term, status, order: string[], desc: string[], tags: string[], categories: string[] }
   * @param sessionId header session_token
   * @returns 
   */
  getPostOfUser(username: string, params: ApiParams, sessionId: string): Observable<ApiResult> {
    if (sessionId) {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_USER + `/${username}`, { ...httpOptions, headers: { session_token: sessionId }, params: { ...params } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_USER + `/${username}`, { ...httpOptions, params: { ...params } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  publishPost(post: CreatePostModel, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST, post, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithPost(slug: string, action: ActionType, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, {}, { ...httpOptions, headers: { session_token: sessionId }, params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @Category
   */
  getListCategories(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.CATEGORY, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getCategoryDetail(category: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.CATEGORY + `/${category}`, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithCategory(category: string, action: ActionType, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.CATEGORY + `/${category}`, {}, { ...httpOptions, headers: { session_token: sessionId }, params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @Tag 
   */
  getListTags(search_term = '', start = 0, size = 20): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.TAG, { ...httpOptions, params: { start, size, search_term } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getTagDetail(tag: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(BASE_URL + REST_URL.TAG + `/${tag}`, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithTag(tag: string, action: ActionType, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.TAG + `/${tag}`, {}, { ...httpOptions, headers: { session_token: sessionId }, params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserByUsername(username: string, sessionId): Observable<ApiResult> {
    if (sessionId) {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.USER + `/${username}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.USER + `/${username}`, httpOptions).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  //#region notification
  getNotification(params: ApiParams, sessionId: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.NOTIFICATION, { ...httpOptions, headers: { session_token: sessionId }, params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  readNotification(notificationId: string, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ID + `/${notificationId}`, {}, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  readAllNotification(sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ALL, {}, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

  //#region Report
  reportPost(post_slug: number, title: string, description: string, content: string, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(
      BASE_URL + REST_URL.REPORT_POST,
      { post_slug, report_type: 'post', title, description, content },
      { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
  }

  reportComment(comment_id: number, title: string, description: string, content: string, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(
      BASE_URL + REST_URL.REPORT_COMMENT,
      { comment_id, report_type: 'comment', title, description, content },
      { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
  }

  reportUser(user_name: string, title: string, description: string, content: string, sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(
      BASE_URL + REST_URL.REPORT_USER,
      { user_name, report_type: 'user', title, description, content },
      { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
  }
  //#endregion

  upLoadImage(file: File, sessionId: string): Observable<ApiResult> {
    const formData = new FormData();
    formData.append('formFile', file);
    if (sessionId) {
      return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.UPLOAD, formData, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.UPLOAD, formData, httpOptions).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }
}
