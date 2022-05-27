import { ApiResult } from 'models/api.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Admin, AdminLoginModel } from 'models/admin.model';
import { Message, MessageService } from 'primeng/api';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';
import { STORAGE_KEY } from 'utils/appConstant';
import { PublicConfig } from 'models/appconfig.model';
import { CookieService } from './cookie.service';
import { AuthUpdateUser } from 'models/user.model';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json-patch+json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  ref: DynamicDialogRef[] = [];

  config: PublicConfig;

  admin: Admin;

  session_id: string;

  remember: boolean = false;

  isAuthenticated: boolean = false;

  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private cookieService: CookieService
  ) { }

  getConfig() {
    return this.config;
  }

  setConfig(cf) {
    this.config = cf;
  }

  login(admin: AdminLoginModel): Observable<ApiResult> {
    return this.http.post(BASE_URL + REST_URL.ADMIN.LOGIN, admin, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logout(session_token_admin) {
    return this.http.post(BASE_URL + REST_URL.ADMIN.LOGOUT, {}, { ...httpOptions, headers: { session_token_admin: session_token_admin } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getAdminInfor(sessionId): Observable<ApiResult> {
    return this.http.get(BASE_URL + REST_URL.ADMIN.GET_ADMIN_USER_BY_SESSIONID, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  extendSessionAdmin(sessionId: string): Observable<ApiResult> {
    return this.http.post(BASE_URL + REST_URL.ADMIN.EXTEND_SESSION, {}, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteSessionAdmin(sessionId: string): Observable<any> {
    return this.http.delete(BASE_URL + REST_URL.ADMIN.SESSION + `/${sessionId}`, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPublicConfig(): Observable<ApiResult> {
    return this.http.get(BASE_URL + REST_URL.CONFIG, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getAdminConfig(sessionId): Observable<ApiResult> {
    return this.http.get(BASE_URL + REST_URL.ADMIN.CONFIG, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  reloadConfig(sessionId): Observable<ApiResult> {
    console.log(sessionId)
    return this.http.post(BASE_URL + REST_URL.ADMIN.RELOAD_CONFIG, {}, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  authAdminUpdate = new Subject<AuthUpdateUser>();

  authAdminUpdate$ = this.authAdminUpdate.asObservable();

  updateAdminAuth(sessionId) {
    if (!sessionId) {
      this.isAuthenticated = false;
      this.authAdminUpdate.next({ session_id: null, user: null, isAuthenticated: false });
      return;
    }
    this.getAdminInfor(sessionId).subscribe(
      (res) => {
        this.admin = res.data.user;
        this.session_id = sessionId;
        this.isAuthenticated = true;
        this.remember = res.data?.session?.saved || false;
        this.authAdminUpdate.next({ session_id: sessionId, user: res.data.user, isAuthenticated: true, remember: this.remember, error: false });

        // close all ref
        // this.ref.forEach(item => {
        //   item.close();
        // })
      },
      (err) => {
        this.isAuthenticated = false;
        this.authAdminUpdate.next({ session_id: null, user: null, isAuthenticated: false, remember: false, error: true });
        // this.logOut();
        this.messageService.add({ severity: 'error', summary: err.error, detail: err.message });
      }
    );
  }

  changeAuth(sessionId: string, user: any, isAuthenticated: boolean, remember: boolean, error: boolean = false) {
    this.admin = user;
    this.session_id = sessionId;
    this.isAuthenticated = true;
    this.authAdminUpdate.next({ session_id: sessionId, user: user, isAuthenticated: isAuthenticated, remember: remember, error: false });
  }

  public getSessionId() {
    return this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN) || null;
  }

  // saveAdmin(admin) {
  //   window.sessionStorage.setItem(STORAGE_KEY.ADMIN_INFO, JSON.stringify(admin));
  // }

  logOut() {
    this.isAuthenticated = false;
    this.session_id = null;
    this.admin = null;
    this.authAdminUpdate.next({ session_id: null, user: null, isAuthenticated: false });
  }
}
