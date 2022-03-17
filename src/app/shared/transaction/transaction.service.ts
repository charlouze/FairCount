import { Injectable } from '@angular/core';
import { addDoc, collection, collectionSnapshots, Firestore, getDoc, orderBy, query } from '@angular/fire/firestore';
import { DocumentData, DocumentSnapshot } from 'rxfire/firestore/interfaces';
import { from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from './transaction.model';
import { Account, AccountService } from '../account';
import { DateTime } from 'luxon';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

const toRecord = (snap: DocumentSnapshot<DocumentData>): Transaction => {
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    date: DateTime.fromJSDate((data?.['date'] as Timestamp).toDate()),
  } as Transaction;
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private firestore: Firestore, private accountService: AccountService) {
  }

  create(account: Pick<Account, 'id'>, transaction: Omit<Transaction, 'id'>) {
    return from(addDoc(this.getCollection(account), {
      ...transaction,
    } as Omit<Transaction, 'id'>)).pipe(
      switchMap(ref => getDoc(ref)),
      map(snap => toRecord(snap)),
    );
  }

  getAllChanges(account: Pick<Account, 'id'>) {
    return collectionSnapshots(query(this.getCollection(account), orderBy('date', 'desc')))
      .pipe(map(snaps => snaps.map(snap => toRecord(snap))));
  }

  private getCollection(account: Pick<Account, 'id'>) {
    return collection(this.accountService.getDoc(account), 'transactions');
  }
}
