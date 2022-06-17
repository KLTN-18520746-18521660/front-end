import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { CategorySendModel, TagSendModel } from 'models/Admins/category-tag.model';
import { ApiParams, ApiResult } from 'models/api.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'services/cookie.service';
import { REST_URL } from 'utils/apiConstant';
import { STORAGE_KEY } from 'utils/appConstant';
import { handleError } from 'utils/commonFunction';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageCategoryTagService {

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

  //#region Category
  getCategoryList(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.CATEGORY, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  createCategory(body: CategorySendModel): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.CATEGORY, body, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  updateCategory(id: number, body: CategorySendModel): Observable<ApiResult> {
    return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.CATEGORY + `/${id}`, body, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

  //#region Tag
  getTagList(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.TAG, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  createTag(body: TagSendModel): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.TAG, body, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  updateTag(id: number, body: TagSendModel): Observable<ApiResult> {
    return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.TAG + `/${id}`, body, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

}
