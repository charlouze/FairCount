import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  deleteDoc,
  doc,
  docSnapshots,
  Firestore,
  getDoc,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { DocumentData, DocumentSnapshot } from 'rxfire/firestore/interfaces';
import { from, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from './transaction.model';
import { Account, AccountService } from '../account';
import { DateTime } from 'luxon';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

declare type AnyValue<T> = {
  [K in keyof T]: any;
}

const fromFirebase = (snap: DocumentSnapshot<DocumentData>): Transaction => {
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    date: DateTime.fromJSDate((data?.['date'] as Timestamp).toDate()),
  } as Transaction;
};

const toFirebase = (transaction: Omit<Transaction, 'id'>): AnyValue<Transaction> => {
  const firebasedTransaction = { ...transaction } as AnyValue<Transaction>;
  delete firebasedTransaction.id;
  firebasedTransaction.date = transaction.date.toJSDate();
  return firebasedTransaction;
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private firestore: Firestore, private accountService: AccountService) {
  }

  create(account: Pick<Account, 'id'>, transaction: Omit<Transaction, 'id'>) {
    return from(addDoc(this.getCollection(account), toFirebase(transaction))).pipe(
      switchMap(ref => getDoc(ref)),
      map(snap => fromFirebase(snap)),
    );
  }

  update(account: Pick<Account, 'id'>, transaction: Pick<Transaction, 'id'>,
         newTransaction: Omit<Transaction, "id">): Observable<Transaction> {
    return from(updateDoc(this.getDoc(account, transaction), toFirebase(newTransaction))).pipe(
      map(() => ({ ...transaction, ...newTransaction })));
  }

  getAllChanges(account: Pick<Account, 'id'>) {
    return collectionSnapshots(query(this.getCollection(account), orderBy('date', 'desc')))
      .pipe(map(snaps => snaps.map(snap => fromFirebase(snap))));
  }

  getOneChanges(account: Pick<Account, 'id'>, id: string): Observable<Transaction> {
    return docSnapshots(this.getDoc(account, { id })).pipe(map(snap => fromFirebase(snap)));
  }

  delete(account: Pick<Account, 'id'>, transaction: Pick<Transaction, 'id'>) {
    return from(deleteDoc(this.getDoc(account, transaction)));
  }

  exists(accountId: string, transactionId: string) {
    return from(getDoc(this.getDoc({ id: accountId }, { id: transactionId }))).pipe(map(snap => snap.exists()));
  }

  private getCollection(account: Pick<Account, 'id'>) {
    return collection(this.accountService.getDoc(account), 'transactions');
  }

  private getDoc(account: Pick<Account, 'id'>, transaction: Pick<Transaction, 'id'>) {
    return doc(this.getCollection(account), transaction.id);
  }
}
