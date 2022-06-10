import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
          switch (error.status) {
            case 401:
              if (req.url.includes('/api/admin')) {
                this.router.navigate(['/admin/login']);
                break;
              }
              this.router.navigate(['/auth/login']);
              break;
            case 403:
              this.router.navigate(['/no-access']);
              break;
            case 500:
              this.router.navigate(['/server-error']);
              break;
            default:
              break;
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