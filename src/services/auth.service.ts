import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { REST_URL } from 'utils/apiConstant';
import { LoginUserModel, SignUpUserModel } from 'models/user.model';
import { handleError } from 'utils/commonFunction';
import { PublicConfig } from 'models/appconfig';
import ApiResult from 'models/api.model';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json-patch+json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: any = {};

  private config: PublicConfig;

  constructor(private http: HttpClient) { }

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
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER_LOGIN, user, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  register(user: SignUpUserModel): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER_SIGNUP, user, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPublicConfig(): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.CONFIG, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logout(sessionId?: string) {
    return this.http.post(BASE_URL + REST_URL.USER_LOGOUT, {}, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  confirmUser(params: any): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.CONFIRM_USER, { ...httpOptions, params: params }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  // send request confirm user 
  confirmUserPost(params: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.CONFIRM_USER, { ...params }, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserInfo(sessionId?: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.GET_USER_BY_SESSIONID, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  extendSessionUser(sessionId: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.EXTENSION_SESSION_USER, {}, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteSessionUser(sessionId: string): Observable<ApiResult> {
    return this.http.delete(BASE_URL + REST_URL.SESSION + `/${sessionId}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
}
