import { AuthService } from './auth';
import { ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { filter, Observable, of, ReplaySubject } from 'rxjs';
import { Account, AccountService } from './account';
import { Injectable } from '@angular/core';
import { Transaction, TransactionService } from './transaction';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStateService {
  private accountSubject = new ReplaySubject<Account | null>(1);

  private transactionsSubject = new ReplaySubject<Transaction[] | null>(1);

  get account$() {
    return this.accountSubject.asObservable();
  }

  get transactions$() {
    return this.transactionsSubject.asObservable();
  }

  get nonNullAccount$(): Observable<Account> {
    return this.account$.pipe(filter(account => !!account), map(account => account!));
  }

  get nonNullTransactions$(): Observable<Transaction[]> {
    return this.transactions$.pipe(filter(account => !!account), map(account => account!));
  }

  constructor(private authService: AuthService, private router: Router,
              private accountService: AccountService, private transactionService: TransactionService) {
    const activationEndEvent$ = this.router.events.pipe(
      filter(event => event instanceof ActivationEnd), map(event => event as ActivationEnd));
    const accountId$ = activationEndEvent$.pipe(
      map(() => this.findParam('accountId', this.router.routerState.snapshot.root)), distinctUntilChanged());

    accountId$.pipe(switchMap(accountId => {
      if (accountId) {
        return this.accountService.getOneChanges(accountId);
      } else {
        return of(null);
      }
    })).subscribe(this.accountSubject);

    this.account$.pipe(
      distinctUntilChanged((previous, current) => {
        if (previous == null && current == null) {
          return true;
        } else if (previous != null && current != null) {
          return previous.id === current.id;
        }
        return false;
      }),
      switchMap(account => {
        if (account) {
          return this.transactionService.getAllChanges(account);
        } else {
          return of(null);
        }
      }),
    ).subscribe(this.transactionsSubject);
  }

  private findParam(name: string, snapshot: ActivatedRouteSnapshot): string | null {
    if (snapshot.paramMap.has(name)) {
      return snapshot.paramMap.get(name)!;
    } else {
      for (let child of snapshot.children) {
        const param = this.findParam(name, child);
        if (param !== null) {
          return param;
        }
      }
      return null;
    }
  }
}
