import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'services/cookie.service';
import { STORAGE_KEY } from 'utils/appConstant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private cookieService: CookieService) { }

  canActivate(
    // route: ActivatedRouteSnapshot,
    route: any,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.cookieService.check(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
      this.router.navigate(["auth/login"], { queryParams: { returnUrl: route._routerState.url } });
      return false;
    }
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.cookieService.check(STORAGE_KEY.USER_SESSIONS_TOKEN)) {
      this.router.navigate(["auth/login"], { queryParams: { returnUrl: childRoute.url } });
      return false;
    }
    return true;
  }

}
