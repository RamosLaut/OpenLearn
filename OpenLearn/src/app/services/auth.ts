import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Member from '../models/member';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  readonly apiUrl = 'http://localhost:3000/members';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<Member> {
    return this.http.get<Member[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(members => {
        if (members.length > 0) {
          const member = members[0];
          localStorage.setItem('token', btoa(JSON.stringify(member)));
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
  }

  getUser(): Member | null {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token)) : null;
  }
}
