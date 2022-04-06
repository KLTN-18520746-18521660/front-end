import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';

const SESSIONS_ID_KEY = 'auth-session-id';
const USER_KEY = 'auth-user';
const REFRESHTOKEN_KEY = 'auth-refresh-token';


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

  user: any;

  isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    this.session_id = this.getSessionId();
    this.updateAuth(this.session_id);
  }

  private authUpdate = new Subject<any>();

  authUpdate$ = this.authUpdate.asObservable();

  addHistory(url) {
    this.history.unshift(url);
    // this.history = this.history.filter((item) => !item.includes('auth'));
  }

  updateAuth(sessionId) {
    this.getUserInfor(sessionId).subscribe(
      (res) => {
        this.user = res.data.user;
        this.saveUser(res.data.user);
        this.session_id = sessionId;
        this.saveSessionId(sessionId);
        this.isAuthenticated = true;
        this.authUpdate.next({ session_id: sessionId, user: res.data.user, isAuthenticated: true });
      },
      (err) => {
        this.isAuthenticated = false;
        this.messageService.add({ severity: 'error', summary: 'Session Error', detail: err.message });
        if (this.history[0] && this.history[0].includes('auth')) {
          this.history = this.history.filter((item) => !item.includes('auth'));
          this.router.navigate(['/']);
        }
      }
    );
  }

  getUserInfor(sessionId): Observable<any> {
    return this.http.get(BASE_URL + REST_URL.GET_USER_BY_SESSIONID, { ...httpOptions, headers: { session_token: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  logOut(): void {
    window.localStorage.removeItem(SESSIONS_ID_KEY);
    window.localStorage.removeItem(USER_KEY);
    this.authUpdate.next({ session_id: null, user: null, isAuthenticated: false });
  }

  public saveSessionId(token: string): void {
    window.localStorage.removeItem(SESSIONS_ID_KEY);
    window.localStorage.setItem(SESSIONS_ID_KEY, token);
  }

  public getSessionId() {
    return window.localStorage.getItem(SESSIONS_ID_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
