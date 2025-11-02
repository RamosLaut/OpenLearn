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
  isConfirmModalOpen: boolean = false
  memberIdToDelete: string | null = null

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

  openConfirmModal(id: string) {
    this.memberIdToDelete = id
    this.isConfirmModalOpen = true;
  }

  confirmDelete() {
    if(this.memberIdToDelete) {
      this.executeDelete(this.memberIdToDelete);
      this.closeConfirmModel()
    }
  }

  closeConfirmModel(){
    this.isConfirmModalOpen = false;
    this.memberIdToDelete = null;
  }
  
  executeDelete(id: string) {
    return this.mService.deleteAccount(id).subscribe({
      next: (data) => {
        alert('Your account has been successfully deleted.');
        this.auth.logout();
        this.router.navigate(['/']);
      },
      error: (e) => console.log(e)
    });
  }
}
