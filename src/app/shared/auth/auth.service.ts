import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { catchError, map, pluck, switchMap, take } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { User } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {
  }

  get user(): Observable<User> {
    return user(this.auth).pipe(map(user => user as User));
  }

  create(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      pluck('user'),
      map(user => user as User),
    );
  }

  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      pluck('user'),
      map(user => user as User),
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.user.pipe(
      take(1),
      switchMap(uzer => {
        if (uzer) {
          return throwError(() => ({
            code: 'auth/already-logged-in',
            message: 'User is already logged in',
          }));
        } else {
          return this.signIn(email, password);
        }
      }),
      catchError(error => {
        if (error?.code === 'auth/already-logged-in') {
          return throwError(error);
        }
        return this.create(email, password);
      }),
      pluck('user'),
      map(user => user as User),
    );
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
