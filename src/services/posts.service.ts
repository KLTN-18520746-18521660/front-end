import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Post from 'models/post.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { REST_URL } from 'utils/apiConstant';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getListPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(BASE_URL, httpOptions).pipe(catchError(error => {
      let errorMsg: string;
      if (error.error instanceof ErrorEvent)
        errorMsg = `Error: ${error.error.message}`;
      else
        errorMsg = this.getServerErrorMessage(error);
      return throwError(errorMsg);
    }));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: return `Not Found: ${error.message}`;
      case 403: return `Access Denied: ${error.message}`;
      case 500: return `Internal Server Error: ${error.message}`;
      default: return `Unknown Server Error: ${error.message}`;
    }
  }
}
