import { ApiParams } from './../models/api.model';
import User from 'models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Message, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError, localStorageFunctions } from 'utils/commonFunction';
import _ from 'lodash';
import { STORAGE_KEY, APPCONSTANT } from 'utils/appConstant';
import { CookieService } from 'services/cookie.service';
import { PublicConfig } from 'models/appconfig';
import ApiResult, { Session } from 'models/api.model';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json-patch+json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ref: DynamicDialogRef[] = [];

  history: Array<string> = [];

  session_id: string;

  session: Session;

  user: User;

  remember: boolean = false;

  messages: Message[] = [];

  alreadyLogin: boolean = false;

  config: PublicConfig;

  isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    console.log("SessionID: ", this.getSessionId());
    if (this.getSessionId()) {
      this.session_id = this.getSessionId();
      this.updateAuth(this.session_id);
    }
    this.history = localStorageFunctions.getConfigByKey('history') || [];
  }

  authUpdate = new Subject<any>();

  authUpdate$ = this.authUpdate.asObservable();

  updateAuth(sessionId) {
    if (!sessionId) {
      this.isAuthenticated = false;
      this.authUpdate.next({ session_id: null, user: null, isAuthenticated: false, error: false });
      localStorage.removeItem(STORAGE_KEY.CURRENT_USER);
      return;
    }
    this.getUserInfo(sessionId).subscribe(
      (res) => {
        setTimeout(() => {
          this.router.navigate([this.history[0]]);
        }, APPCONSTANT.LOADING_TIMEOUT);
        this.session_id = sessionId;
        this.user = res.data.user;
        this.isAuthenticated = true;
        this.session = res.data.session;
        this.remember = res.data.session.saved;
        this.alreadyLogin = true;
        this.authUpdate.next({ session_id: sessionId, user: res.data.user, isAuthenticated: true, remember: this.remember, error: false });
        // close all ref
        if (this.ref) {
          this.ref.forEach(item => {
            item.close();
          })
        }
      },
      (err) => {
        console.log(err);
        this.isAuthenticated = false;
        this.user = null;
        this.alreadyLogin = false;
        this.session = null;
        this.remember = false;
        this.authUpdate.next({ session_id: null, user: null, isAuthenticated: false, remember: this.remember, error: true });
        // this.messages = [{ severity: 'error', summary: err.error, detail: err.error.message }];
        // this.logOut();
      }
    );
  }

  getConfigByKey(key: string, sessionId?) {
    if (sessionId) {
      return this.http.get(BASE_URL + REST_URL.CONFIG + `/${key}`, { ...httpOptions, headers: { session_id: sessionId } }).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
    else {
      return this.http.get(BASE_URL + REST_URL.CONFIG + `/${key}`, httpOptions).pipe(catchError(error => {
        return throwError(handleError(error));
      }));
    }
  }

  addHistory(url) {
    this.history.unshift(url);
    this.history = this.history.filter((item) => !item.includes('auth') && !item.includes('admin'));
    this.history = _.uniq(this.history);
    this.history = this.history.slice(0, 5);
    localStorageFunctions.addConfig('history', this.history);
  }

  getUserInfo(sessionId): Observable<ApiResult> {
    return this.http.get(BASE_URL + REST_URL.GET_USER_BY_SESSIONID, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getUserInfoByUserName(user_name: string, sessionId?: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.USER + `/${user_name}`, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendActionWithUser(user_name: string, action: ActionType, sessionId: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.USER + `/${user_name}`, {}, { ...httpOptions, headers: { session_token: sessionId }, params: { action } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getFollowers(params: ApiParams, sessionId: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.USER + `/${REST_URL.FOLLOWER}`, { ...httpOptions, headers: { session_token: sessionId }, params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getFollowings(params: ApiParams, sessionId: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.USER + `/${REST_URL.FOLLOWING}`, { ...httpOptions, headers: { session_token: sessionId }, params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logOut(): void {
    this.isAuthenticated = false;
    this.session_id = null;
    this.user = null;
    this.alreadyLogin = false;
    this.session = null;
    this.remember = false;
    this.authUpdate.next({ session_id: null, user: null, isAuthenticated: false, remember: this.remember, error: false });
  }

  // public saveSessionId(token: string, remember: boolean): void {
  //   this.remember = remember;
  //   if (this.cookieService.check(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
  //     this.cookieService.delete(STORAGE_KEY.USER_SESSIONS_TOKEN);
  //   }

  //   const expiry_time = new Date(new Date().getTime() + (1000 * 60 * (this.config?.SessionAdminUserConfig?.expiry_time || 5)));
  //   if (remember) {
  //     this.cookieService.set(
  //       STORAGE_KEY.USER_SESSIONS_TOKEN,
  //       token,
  //     );
  //   }
  //   else {
  //     this.cookieService.set(
  //       STORAGE_KEY.USER_SESSIONS_TOKEN,
  //       token,
  //       expiry_time
  //     );
  //   }
  // }

  public getSessionId() {
    return this.cookieService.get(STORAGE_KEY.USER_SESSIONS_TOKEN) || null;
  }

  public getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY.CURRENT_USER);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
