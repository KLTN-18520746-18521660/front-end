import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Admin } from 'models/admin.model';
import { ApiResult, ApiParams } from 'models/api.model';
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
export class ManageAdminUserService {

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

  getUserByUsername(user_name: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.USER + `/${user_name}`, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#region @Admin
  getListAdmin(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.ADMIN, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  createAdmin(admin: Admin): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.ADMIN, admin, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getAdminById(id: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.ADMIN + `/${id}`, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  modifyAdmin(id: string, admin: Admin): Observable<ApiResult> {
    return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.ADMIN + `/${id}`, admin, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

  //#region @User
  getListUser(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.USER_SOCIAL, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  createUser(admin: Admin): Observable<ApiResult> {
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.ADMIN, admin, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserById(id: string): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.USER_SOCIAL + `/${id}`, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  modifyUser(id: string, admin: Admin): Observable<ApiResult> {
    return this.httpClient.put<ApiResult>(BASE_URL + REST_URL.ADMIN.USER_SOCIAL + `/${id}`, admin, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
  //#endregion

}
