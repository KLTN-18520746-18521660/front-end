import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
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
export class StatisticService {

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

  getStatisticPostCount(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.STATISTIC_POST + `/${REST_URL.ADMIN.COUNT}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getStatisticPostChart(params: ApiParams): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + REST_URL.ADMIN.STATISTIC_POST + `/${REST_URL.ADMIN.CHART}`, { ...this.httpOptions(), params: { ...params } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }
}
