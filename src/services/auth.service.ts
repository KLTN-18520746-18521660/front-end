import { ApiParams } from './../models/api.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { REST_URL } from 'utils/apiConstant';
import { LoginUserModel, SignUpUserModel } from 'models/user.model';
import { handleError } from 'utils/commonFunction';
import { PublicConfig } from 'models/appconfig.model';
import ApiResult from 'models/api.model';
import { CookieService } from './cookie.service';
import { STORAGE_KEY } from 'utils/appConstant';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions() {
    if (this.cookieService.check(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
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

  private user: any = {};

  private config: PublicConfig;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getUser() {
    return this.user;
  }

  getConfig() {
    return this.config;
  }

  setConfig(cf) {
    this.config = cf;
  }

  login(user: LoginUserModel): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER_LOGIN, user, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  register(user: SignUpUserModel): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER_SIGNUP, user, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPublicConfig(): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.CONFIG, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logout() {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER_LOGOUT, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  confirmUser(params: any): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.CONFIRM_USER, { ...this.httpOptions(), params: params }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  // send request confirm user 
  confirmUserPost(params: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.CONFIRM_USER, { ...params }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserInfo(): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.GET_USER_BY_SESSIONID, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  extendSessionUser(): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.EXTENSION_SESSION_USER, {}, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteSessionUser(sessionId?: string): Observable<ApiResult> {
    return this.http.delete(BASE_URL + REST_URL.SESSION + `/${sessionId}`, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#region [Password]
  changePassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.CHANGE_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendRequestForgotPassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.FORGOT_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getRequestForgotPassword(params: any): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.FORGOT_PASSWORD, { ...this.httpOptions(), params: params }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  resetPassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.FORGOT_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#endregion
}
