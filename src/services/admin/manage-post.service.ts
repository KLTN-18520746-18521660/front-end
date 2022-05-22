import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Category from 'models/category.model';
import Post, { PostModel } from 'models/post.model';
import Tag from 'models/tag.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType, REST_URL } from 'utils/apiConstant';
import { handleError } from 'utils/commonFunction';

const BASE_URL = environment.baseApiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ManagePostService {

  constructor(private httpClient: HttpClient) { }

  // getListPosts(): Observable<Post[]> {
  //   return this.httpClient.get<Post[]>(BASE_URL + REST_URL.POST, httpOptions).pipe(catchError(error => {
  //     return throwError(handleError(error));
  //   }));
  // }

  getPostBySlug(slug: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(BASE_URL + REST_URL.POST + `/${slug}`, httpOptions).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  approvePostByPostId(postId: string, sessionId: string): Observable<any> {
    return this.httpClient.post<any>(BASE_URL + REST_URL.ADMIN.APPROVE_POST + `/${postId}`, {}, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  rejectPostByPostId(postId: string, sessionId: string): Observable<any> {
    return this.httpClient.post<any>(BASE_URL + REST_URL.ADMIN.REJECT_POST + `/${postId}`, {}, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

  getPostByPostId(postId: string, sessionId: string): Observable<Post> {
    return this.httpClient.get<Post>(BASE_URL + REST_URL.ADMIN.POST + `/${postId}`, { ...httpOptions, headers: { session_token_admin: sessionId } }).pipe(catchError(error => {
      return throwError(handleError(error));
    }));
  }

}
