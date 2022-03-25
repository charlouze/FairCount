import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Transaction, TransactionService } from '../../../shared/transaction';
import { Account } from '../../../shared/account';
import { DateTime } from 'luxon';
import { BalanceUtils } from '../../../shared/balance.utils';

@Component({
  selector: 'app-account-home-transaction-item',
  templateUrl: './account-home-transaction-item.component.html',
  styleUrls: ['./account-home-transaction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHomeTransactionItemComponent {
  @Input()
  transaction!: Transaction | null;

  @Input()
  account!: Account | null;

  @Input()
  lightDisplay = true;

  get fullDisplay() {
    return !this.lightDisplay;
  }

  get amount() {
    if (this.transaction) {
      return this.transaction.amount;
    } else {
      return NaN;
    }
  }

  get creditor() {
    if (this.transaction && this.account) {
      const creditorIdx = this.transaction.creditor;
      const participant = this.account.participants.find((participant, index) => creditorIdx === index);
      if (participant) {
        return participant.name;
      }
    }
    return '';
  }

  get date() {
    if (this.transaction) {
      return this.transaction.date.toLocaleString(DateTime.DATE_SHORT);
    }
    return '';
  }

  get debtors() {
    if (this.transaction && this.account) {
      const shareAmount = BalanceUtils.computeShareAmount(this.transaction);
      return this.transaction.debtors.map(debtor => ({
        participant: this.account!.participants.find((participant, index) => debtor.participant === index),
        amount: shareAmount * debtor.weight,
        weight: debtor.weight,
      }));
    }
    return [];
  }

  constructor(private transactionService: TransactionService) {
  }

  toggleDisplay() {
    this.lightDisplay = !this.lightDisplay;
  }

  delete() {
    if(this.account && this.transaction) {
      this.transactionService.delete(this.account, this.transaction);
    }
  }
}
