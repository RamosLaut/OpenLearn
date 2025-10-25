import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Member from '../models/member';
import { map, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  readonly apiUrl = 'http://localhost:3000/members';

  private currentUserSubject: BehaviorSubject<Member | null>;
  public currentUser$: Observable<Member | null>;

  constructor(private http: HttpClient) {
    const initialUser = this.getUserFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<Member | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromLocalStorage(): Member | null {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token)) : null;
  }

  login(username: string, password: string): Observable<Member> {
    return this.http.get<Member[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(members => {
        if (members.length > 0) {
          const member = members[0];

          if(member.accountStatus === 'deleted') {
            throw new Error('Account has been deleted');
          }

          localStorage.setItem('token', btoa(JSON.stringify(member)));
          this.currentUserSubject.next(member);
          return member;
        }
        throw new Error('Invalid credentials');
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getUser(): Member | null {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token)) : null;
  }

  updateCurrentUser(member: Member): void {
    localStorage.setItem('token', btoa(JSON.stringify(member)));
    this.currentUserSubject.next(member);
  }

  public get CurrentUserValue(): Member | null {
    return this.currentUserSubject.value;
  }
}