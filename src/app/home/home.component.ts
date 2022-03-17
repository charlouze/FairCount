import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';
import { Destroyed } from '../shared/destroyed';
import { Account, AccountService } from '../shared/account';
import { AuthService } from '../shared/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends Destroyed {
  accounts$: Observable<Account[]>;

  constructor(authService: AuthService, accountService: AccountService) {
    super();
    this.accounts$ = authService.user.pipe(filter(user => !!user), switchMap(user => accountService.getAllChanges(user)));
  }
}
