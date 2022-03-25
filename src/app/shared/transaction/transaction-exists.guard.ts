import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ExistsGuard } from '../exists.guard';
import { TransactionService } from './transaction.service';

@Injectable({ providedIn: 'root' })
export class TransactionExistsGuard extends ExistsGuard {
  constructor(private transactionService: TransactionService, router: Router) {
    super(router);
  }

  exists(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (route.paramMap.has('accountId') && route.paramMap.has('transactionId')) {
      return this.transactionService.exists(route.paramMap.get('accountId')!, route.paramMap.get('transactionId')!);
    } else {
      return false;
    }
  }
}
