import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { MemberHeader } from './components/member-header/member-header';
import { Auth } from './services/auth';
import Member from './models/member';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MemberFooter } from './components/member-footer/member-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MemberHeader, CommonModule, MemberFooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  member$!: Observable<Member | null>;
  protected readonly title = signal('app-cursos');
  constructor(private auth: Auth){}
  ngOnInit(): void {
    this.member$ = this.auth.currentUser$;
  }

}
