import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  doc,
  docSnapshots,
  Firestore,
  getDoc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { User } from '../auth';
import { Account } from './account.model';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from 'rxfire/firestore/interfaces';

const toRecord = (snap: DocumentSnapshot<DocumentData>): Account => ({
  ...snap.data(),
  id: snap.id,
} as Account);

export const toAccount = toRecord;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private firestore: Firestore) {
  }

  create(user: Pick<User, 'email' | 'displayName'>, accountData: Pick<Account, 'name' | 'participants'>): Observable<Account> {
    return from(addDoc(this.getCollection(), {
      ...accountData,
      members: [user.email],
    } as Omit<Account, 'id'>)).pipe(
      switchMap(ref => getDoc(ref)),
      map(snap => toRecord(snap)),
    );
  }

  update(currentAccount: Account, updatedAccount: Partial<Account>): Observable<Account> {
    const account = { ...currentAccount, ...updatedAccount };
    const accountData = { ...account } as Partial<Account>;
    delete accountData.id;
    return from(updateDoc(this.getDoc(currentAccount), accountData)).pipe(map(() => account));
  }

  exists(id: string) {
    return from(getDoc(this.getDoc({ id }))).pipe(map(snap => snap.exists()));
  }

  getAllChanges(user: Pick<User, 'email'>): Observable<Account[]> {
    const memberAccountQuery = query(this.getCollection(), where('members', 'array-contains', user.email));
    return collectionSnapshots(memberAccountQuery).pipe(map(snaps => snaps.map(snap => toRecord(snap))));
  }

  getOneChanges(id: string): Observable<Account> {
    return docSnapshots(this.getDoc({ id })).pipe(map(snap => toRecord(snap)));
  }

  getCollection() {
    return collection(this.firestore, 'accounts');
  }

  getDoc(account: Pick<Account, 'id'>) {
    return doc(this.getCollection(), account.id);
  }
}
