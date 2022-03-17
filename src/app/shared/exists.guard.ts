import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class ExistsGuard implements CanActivate {
  protected constructor(protected router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const exists = this.exists(route, state);
    if (typeof exists === 'boolean') {
      return exists;
    } else {
      return exists.pipe(catchError(error => of(this.router.createUrlTree(['/error'], { queryParams: { code: error.code } }))));
    }
  }

  protected abstract exists(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean;
}
