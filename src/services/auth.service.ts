import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/api/';

// const gen (salt, date) = () => {}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(BASE_URL + 'signin', {
      username,
      password
    }, httpOptions);
  }
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(BASE_URL + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  refreshToken(token: string) {
    return this.http.post(BASE_URL + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }
}
