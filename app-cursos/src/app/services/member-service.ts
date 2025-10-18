import { Injectable } from '@angular/core';
import Member from '../models/member';
import { HttpClient } from '@angular/common/http';
import { MemberRegistration } from '../models/memberRegistration';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  readonly API_URL= "http://localhost:3000/members";

  members : Member[];

  constructor(private http: HttpClient){
    this.members = [];
  }
  
  getAll(){
    return this.http.get<Member[]>(this.API_URL)
  }

  getById(id:string){
    return this.http.get<Member>(this.API_URL + "/" + id)
  }

  post(m: MemberRegistration){
    return this.http.post<Member>(this.API_URL, m)
  }

  put(id: string, m: Member){
    return this.http.put<Member>(this.API_URL + "/" + id, m)
  }

  delete(id: string){
    return this.http.delete<Member>(this.API_URL + "/" + id)
  }
}
