import { ReportSendModel, ReportType } from 'models/report.model';
import { ActionPostParams, ApiParams } from 'models/api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiResult } from 'models/api.model';
import Category from 'models/category.model';
import Post, { PostModel, PostTypeView } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';
import { CookieService } from './cookie.service';
import { STORAGE_KEY } from 'utils/appConstant';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  httpOptions() {
    if (this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'session_token': this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN)
        })
      };
    }
    else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    }
  }

  httpOptionsFile() {
    if (this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
      return {
        headers: new HttpHeaders({
          'session_token': this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN)
        })
      };
    }
    else {
      return {
        headers: new HttpHeaders({
        }),
      }
    }
  }

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  /**
   * @param only need search_term
   */
  searchAll(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.SEARCH, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  searchPost(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${REST_URL.SEARCH}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  searchUser(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.USER + `/${REST_URL.SEARCH}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostBySlug(slug: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostById(postId: number): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_ID + `/${postId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostValuesBySlug(slug: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}/` + REST_URL.POST_VALUES, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  modifyPostByPostId(postId: number, post: PostModel): Observable<Post> {
    return this.httpClient.put<Post>(BASE_URL + REST_URL.POST_ID + `/${postId}`, post, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostByActionType(actionType: ActionPostParams, params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${REST_URL.ACTION}`, { ...this.httpOptions(), params: { ...params, action: actionType } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostTimelineById(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.AUDIT_LOG, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deletePostByPostId(postId: number): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(BASE_URL + REST_URL.POST_ID + `/${postId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getRelatedPostsBySlug(slug: string, params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_RECOMMEND + `/${slug}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostsByType(type: PostTypeView, params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${type}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostsTrending(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_TRENDING, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostOfUser(username: string, params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_USER + `/${username}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  publishPost(post: PostModel): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST, post, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithPost(slug: string, action: ActionType): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, {}, { ...this.httpOptions(), params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  changeStatusPost(type: 'publish' | 'private', postId: number): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST + `/${type}` + `/id/${postId}`, {}, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @Category
   */
  getListCategories(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.CATEGORY, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getCategoryDetail(category: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.CATEGORY + `/${category}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getTrendingCategories(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.CATEGORY_TRENDING, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithCategory(category: string, action: ActionType): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.CATEGORY + `/${category}`, {}, { ...this.httpOptions(), params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @Tag 
   */
  getListTags(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.TAG, { ...this.httpOptions, params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getTagDetail(tag: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.TAG + `/${tag}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getTrendingTags(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.TAG_TRENDING, { ...this.httpOptions, params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithTag(tag: string, action: ActionType): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.TAG + `/${tag}`, {}, { ...this.httpOptions(), params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserByUsername(username: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.USER + `/${username}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#region notification
  getNotification(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.NOTIFICATION, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  readNotification(notificationId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_READ + `/${notificationId}`, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  unReadNotification(notificationId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_UNREAD + `/${notificationId}`, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteNotification(notificationId: string): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ID + `/${notificationId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  readAllNotification(): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ALL, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

  gotoUrl(url: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.LINK_REDIRECT, { url }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#region Report
  sendReport(type: ReportType, model: ReportSendModel): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(
      BASE_URL + REST_URL.REPORT + `/${type}`,
      { ...model },
      this.httpOptions()).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
  }
  //#endregion

  upLoadImage(path: 'post' | 'user' | 'common', file: File): Observable<ApiResult> {
    const formData = new FormData();
    formData.append('__FormFile', file);
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.UPLOAD + `/${path}`, formData, this.httpOptionsFile()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
}
