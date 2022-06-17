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
export class ManageConfigService {

  httpOptions() {
    if (this.cookieService.check(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'session_token_admin': this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)
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


  getPublicConfig(): Observable<ApiResult> {
    return this.httpClient.get(BASE_URL + REST_URL.ADMIN.CONFIG, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  reloadConfig(): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.RELOAD_CONFIG, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getAllConfig(): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.CONFIG, this.httpOptions()).pipe((catchError(error => {
      return throwError(handleError(error));
    })));
  }

  getConfigByKey(key: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.CONFIG + `/${key}`, this.httpOptions()).pipe((catchError(error => {
      return throwError(handleError(error));
    })));
  }

  modifyConfig(key: string, body): Observable<ApiResult> {
    return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.CONFIG + `/${key}`, body, this.httpOptions()).pipe((catchError(error => {
      return throwError(handleError(error));
    })));
  }
}
