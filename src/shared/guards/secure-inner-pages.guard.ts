import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.isAuthenticated) {
      this.router.navigate([this.userService.history[0]]);
      return false;
    }
    return true;
  }

}
