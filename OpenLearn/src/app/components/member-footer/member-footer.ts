import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Observable } from 'rxjs';
import Member from '../../models/member';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-member-footer',
  imports: [AsyncPipe],
  templateUrl: './member-footer.html',
  styleUrl: './member-footer.css'
})
export class MemberFooter implements OnInit {
  currentUser!: Observable<Member | null>

  constructor (private authService: Auth){}

  ngOnInit(): void {
      this.currentUser = this.authService.currentUser$;

  }
}
