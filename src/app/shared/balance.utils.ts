import { Account, Participant } from './account';
import { Transaction } from './transaction';

export interface Balance {
  participant: Participant;
  credit: number;
  debt: number;
}

export interface Repayment {
  creditor: Participant;
  debtor: Participant;
  amount: number;
}

export class BalanceUtils {
  static computeBalances(account: Account, transactions: Transaction[]): Balance[] {
    const balances = account.participants.map(participant => ({ participant, credit: 0, debt: 0 } as Balance));
    transactions.forEach(transaction => {
      balances[transaction.creditor].credit += transaction.amount;
      const shareAmount = this.computeShareAmount(transaction);
      transaction.debtors.forEach(debtor => balances[debtor.participant].debt += shareAmount * debtor.weight);
    });
    return balances;
  }

  static computeShareAmount(transaction: Transaction) {
    const totalWeight = transaction.debtors.map(debtor => debtor.weight).reduce((partialSum, weight) => partialSum + weight, 0);
    return transaction.amount / totalWeight;
  }

  static computeRepayments(account: Account, transactions: Transaction[]): Repayment[] {
    const balances = this.computeBalances(account, transactions);
    const creditorBalances: (Balance & { remainingCredit: number })[] = [];
    const debtorBalances: (Balance & { remainingDebt: number })[] = [];
    balances.forEach(balance => {
      const balanceAmount = balance.credit - balance.debt;
      if (balanceAmount > 0) {
        creditorBalances.push({ ...balance, remainingCredit: Math.abs(balanceAmount) });
      } else if (balanceAmount < 0) {
        debtorBalances.push({ ...balance, remainingDebt: Math.abs(balanceAmount) });
      }
    });
    creditorBalances.sort((bal1, bal2) => bal1.remainingCredit - bal2.remainingCredit);
    debtorBalances.sort((bal1, bal2) => bal2.remainingDebt - bal1.remainingDebt);

    const repayments: Repayment[] = [];
    creditorBalances.forEach(creditorBalance => {
      while (creditorBalance.remainingCredit > 0 && debtorBalances.length > 0) {
        const debtorBalance = debtorBalances[0];
        const repayment = { creditor: creditorBalance.participant, debtor: debtorBalance.participant, amount: 0 };
        if (debtorBalance.remainingDebt >= creditorBalance.remainingCredit) {
          repayment.amount = creditorBalance.remainingCredit;
        } else {
          repayment.amount = debtorBalance.remainingDebt;
          debtorBalances.splice(0, 1);
        }
        creditorBalance.remainingCredit -= repayment.amount;
        debtorBalance.remainingDebt -= repayment.amount;
        repayments.push(repayment);
      }
    });
    return repayments;
  }
}
