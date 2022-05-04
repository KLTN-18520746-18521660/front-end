import { ReportSendModel, ReportType } from 'models/report.model';
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

  getListPosts(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostBySlug(slug: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostValuesBySlug(slug: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}/` + REST_URL.POST_VALUES, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  modifyPostByPostId(postId: string, post: CreatePostModel): Observable<Post> {
    return this.httpClient.put<Post>(BASE_URL + REST_URL.POST_ID + `/${postId}`, post, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deletePostByPostId(postId: string): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(BASE_URL + REST_URL.POST_ID + `/${postId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostsByType(type: 'following' | 'new' | 'trending', params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST + `/${type}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostsTrending(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_TRENDING, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
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
  getPostOfUser(username: string, params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.POST_USER + `/${username}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  publishPost(post: CreatePostModel): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST, post, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithPost(slug: string, action: ActionType): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.POST + `/${slug}`, {}, { ...this.httpOptions(), params: { action } }).pipe(catchError(error => {
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

  sendActionWithCategory(category: string, action: ActionType): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.CATEGORY + `/${category}`, {}, { ...this.httpOptions(), params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  /**
   * 
   * @Tag 
   */
  getListTags(search_term = '', start = 0, size = 20): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.TAG, { ...this.httpOptions, params: { start, size, search_term } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getTagDetail(tag: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(BASE_URL + REST_URL.TAG + `/${tag}`, this.httpOptions()).pipe(catchError(error => {
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

  deleteNotification(notificationId: string): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ID + `/${notificationId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  readAllNotification(sessionId: string): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.NOTIFICATION_ALL, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

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

  upLoadImage(path: 'post' | 'user', file: File): Observable<ApiResult> {
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.UPLOAD + `/${path}`, formData, this.httpOptionsFile()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
}
