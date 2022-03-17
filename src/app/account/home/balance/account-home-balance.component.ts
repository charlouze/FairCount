import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Account } from '../../../shared/account';
import { Transaction } from '../../../shared/transaction';
import { Balance, BalanceUtils, Repayment } from '../../../shared/balance.utils';

@Component({
  selector: 'app-account-home-balance',
  templateUrl: './account-home-balance.component.html',
  styleUrls: ['./account-home-balance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHomeBalanceComponent {
  @Input()
  account: Account | null = null;

  @Input()
  transactions: Transaction[] | null = null;

  get balances(): Balance[] {
    if (this.transactions && this.account) {
      return BalanceUtils.computeBalances(this.account, this.transactions);
    }
    return [];
  }

  get repayments(): Repayment[] {
    if (this.transactions && this.account) {
      return BalanceUtils.computeRepayments(this.account, this.transactions);
    }
    return [];
  }

  constructor() {
  }

  computeBalanceClass(balance: Balance) {
    return {
      positive: balance.credit > balance.debt,
      neutral: balance.credit === balance.debt,
      negative: balance.credit < balance.debt,
    };
  }

  computeBalanceValue(balance: Balance) {
    return balance.credit - balance.debt;
  }
}
