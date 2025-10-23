import { Component, OnInit } from '@angular/core';
import Member from '../../models/member';
import { MemberService } from '../../services/member-service';
import { Auth } from '../../services/auth';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  member!: Member | null

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.member = this.auth.getUser()
    if (this.member && this.member.registrationDate) {
      this.member.registrationDate = new Date(this.member.registrationDate);
    }
  }
}
