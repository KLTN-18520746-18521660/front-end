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
import { Role } from 'models/Admins/role_right.model';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageRoleService {

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

  getRoleAdmin(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_ADMIN, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getRoleUser(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_USER, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  createRole(type: 'admin' | 'user', body: Role): Observable<ApiResult> {
    if (type === 'admin') {
      return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_ADMIN, body, this.httpOptions()).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_USER, body, this.httpOptions()).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  updateRole(type: 'admin' | 'user', key: string, body): Observable<ApiResult> {
    if (type === 'admin') {
      return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_ADMIN + `/${key}`, body, this.httpOptions()).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.ROLE_USER + `/${key}`, body, this.httpOptions()).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }
}
