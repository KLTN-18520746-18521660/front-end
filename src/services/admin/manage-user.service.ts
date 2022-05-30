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
export class ManageUserService {

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

}
