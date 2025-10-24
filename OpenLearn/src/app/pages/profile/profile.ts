import { Component, OnInit } from '@angular/core';
import Member from '../../models/member';
import { MemberService } from '../../services/member-service';
import { Auth } from '../../services/auth';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  member!: Member | null

  constructor(private auth: Auth,
    public mService: MemberService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.member = this.auth.getUser()
    if (this.member && this.member.registrationDate) {
      this.member.registrationDate = new Date(this.member.registrationDate);
    }
  }

  deleteAccount(id : string){
    return this.mService.deleteAccount(id).subscribe({
      next: (data) => { alert('Your account was successfully deleted');
        this.auth.logout();
        this.router.navigate(['/']);
       },
       error: (e) => console.log(e)
    });
  }
}
