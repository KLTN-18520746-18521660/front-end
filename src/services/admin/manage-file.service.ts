import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiResult } from 'models/api.model';
import { Observable, catchError, throwError } from 'rxjs';
import { CookieService } from 'services/cookie.service';
import { REST_URL } from 'utils/apiConstant';
import { STORAGE_KEY } from 'utils/appConstant';
import { handleError } from 'utils/commonFunction';

const BASE_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageFileService {

  httpOptionsFile() {
    if (this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)) {
      return {
        headers: new HttpHeaders({
          'session_token_admin': this.cookieService.get(STORAGE_KEY.ADMIN_SESSIONS_TOKEN)
        })
      };
    }
    else {
      return {
        headers: new HttpHeaders({
        }),
      }
    }
  }

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  upLoadImage(path: 'post' | 'user' | 'common', file: File): Observable<ApiResult> {
    const formData = new FormData();
    formData.append('__FormFile', file);
    return this.httpClient.post<ApiResult>(BASE_URL + REST_URL.ADMIN.UPLOAD + `/${path}`, formData, this.httpOptionsFile()).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

}
