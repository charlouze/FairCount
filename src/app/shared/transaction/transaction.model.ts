import { DateTime } from 'luxon';

export interface Debtor {
  participant: number;
  weight: number;
}

export interface Transaction {
  id: string;
  date: DateTime;
  label: string;
  amount: number;
  creditor: number;
  debtors: Debtor[];
}
