import { CookieService } from 'services/cookie.service';
import { ApiParams, ApiResult } from 'models/api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Category from 'models/category.model';
import Post, { PostModel } from 'models/post.model';
import { Tag } from 'models/tag.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';
import { STORAGE_KEY } from 'utils/appConstant';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ManagePostService {

  httpOptions() {
    if (this.cookieService.check(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'session_token': this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)
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
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  getListPosts(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.POSTS, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostById(postId: number): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.POST + `/${postId}`, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostBySlug(slug: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(BASE_URL + REST_URL.POST + `/${slug}`, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  approvePostByPostId(postId: number): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.APPROVE_POST + `/${postId}`, {}, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  rejectPostByPostId(postId: number, pending: boolean = false): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.REJECT_POST + `/${postId}`, { reject_pending_content: pending }, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

}
