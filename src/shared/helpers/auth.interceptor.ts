import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from 'utils/commonFunction';

// const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-access-token';    // for Node.js Express back-end

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Max-Age=-99999999;';
            this.router.navigate(['/auth/login']);
          }
          else if (error.status === 403) {
            this.router.navigate(['/admin/loginn']);
          }
          return throwError(error);
        }
        return throwError((error));
      })
    );
  }
}
export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useFactory: (router: Router) => new AuthInterceptor(router),
    multi: true,
    deps: [Router]
  },
];