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

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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
    return this.http.post(BASE_URL + REST_URL.ADMIN.LOGIN, admin, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logout() {
    return this.http.post(BASE_URL + REST_URL.ADMIN.LOGOUT, {}, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getAdminInfor(): Observable<ApiResult> {
    return this.http.get(BASE_URL + REST_URL.ADMIN.GET_ADMIN_USER_BY_SESSIONID, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  extendSessionAdmin(): Observable<ApiResult> {
    return this.http.post(BASE_URL + REST_URL.ADMIN.EXTEND_SESSION, {}, { ...this.httpOptions() }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  deleteSessionAdmin(sessionId: string): Observable<any> {
    return this.http.delete(BASE_URL + REST_URL.ADMIN.SESSION + `/${sessionId}`, { ...this.httpOptions() }).pipe(catchError(error => {
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
    this.getAdminInfor().subscribe(
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

  //#region [Password]
  changePassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.ADMIN.CHANGE_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  sendForgotPassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.ADMIN.FORGOT_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getForgotPassword(params: any): Observable<ApiResult> {
    return this.http.get<ApiResult>(BASE_URL + REST_URL.ADMIN.FORGOT_PASSWORD, { ...this.httpOptions(), params: params }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  resetPassword(body: any): Observable<ApiResult> {
    return this.http.post<ApiResult>(BASE_URL + REST_URL.ADMIN.FORGOT_PASSWORD, { ...body }, this.httpOptions()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  //#endregion

  logOut() {
    this.isAuthenticated = false;
    this.session_id = null;
    this.admin = null;
    this.authAdminUpdate.next({ session_id: null, user: null, isAuthenticated: false });
  }
}
