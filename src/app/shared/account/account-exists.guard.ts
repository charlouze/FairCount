import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { ExistsGuard } from '../exists.guard';

@Injectable({ providedIn: 'root' })
export class AccountExistsGuard extends ExistsGuard {
  constructor(private accountService: AccountService, router: Router) {
    super(router);
  }

  exists(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (route.paramMap.has('accountId')) {
      return this.accountService.exists(route.paramMap.get('accountId')!);
    } else {
      return false;
    }
  }
}
