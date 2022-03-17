import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthPipe } from '@angular/fire/auth-guard';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

export type AuthLoadPipeGenerator = (route: Route, segments: UrlSegment[]) => AuthPipe;

@Injectable({
  providedIn: 'root',
})
export class AuthLoadGuard implements CanLoad {
  constructor(private router: Router, private authService: AuthService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user$: Observable<boolean | string | any[]>;
    if (route.data) {
      const authPipeFactory = route.data['authGuardPipe'] as AuthLoadPipeGenerator;
      user$ = this.authService.user.pipe(
        map(user => user as User),
        authPipeFactory(route, segments),
      );
    } else {
      user$ = this.authService.user.pipe(map(user => !!user));
    }
    return user$.pipe(
      take(1),
      map(can => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else if (typeof can === 'string') {
          return this.router.parseUrl(can);
        } else {
          return false;
        }
      }));
  }
}

export const canLoad = (pipe: AuthLoadPipeGenerator) => ({
  canLoad: [AuthLoadGuard], data: { authGuardPipe: pipe },
});
