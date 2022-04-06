import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { REST_URL } from 'utils/apiConstant';
import { LoginUserModel, SignUpUserModel } from 'models/user.model';
import { handleError } from 'utils/commonFunction';

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

  constructor(private http: HttpClient) { }

  getUser() {
    return this.user;
  }

  login(user: LoginUserModel): Observable<any> {
    return this.http.post(BASE_URL + REST_URL.USER_LOGIN, user, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  register(user: SignUpUserModel): Observable<any> {
    return this.http.post(BASE_URL + REST_URL.USER_SIGNUP, user, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logout(sessionId?: string) {
    return this.http.post(BASE_URL + REST_URL.USER_LOGOUT, {}, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  confirmUser(params: any) {
    return this.http.get(BASE_URL + REST_URL.CONFIRM_USER, { ...httpOptions, params: params }).pipe(catchError(error => {
      return throwError(handleError(error));
    }))
  }

  confirmUserPost(params: any) {
    return this.http.post(BASE_URL + REST_URL.CONFIRM_USER, { ...params }, httpOptions);
  }

  getUserInfor(sessionId?: string): Observable<any> {
    return this.http.get(BASE_URL + REST_URL.GET_USER_BY_SESSIONID, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  refreshToken(token: string) {
    return this.http.post(BASE_URL + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }
}
