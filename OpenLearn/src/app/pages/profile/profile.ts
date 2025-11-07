import { Component, OnInit } from '@angular/core';
import Member from '../../models/member';
import { MemberService } from '../../services/member-service';
import { Auth } from '../../services/auth';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, DatePipe, RouterLink,
    CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  member!: Member | null
  isConfirmModalOpen: boolean = false
  memberIdToDelete: string | null = null
  isChangePasswordModalOpen = false;
  changePasswordForm!: FormGroup;

  constructor(private auth: Auth,
    public mService: MemberService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.member = this.auth.getUser()
    if (this.member && this.member.registrationDate) {
      this.member.registrationDate = new Date(this.member.registrationDate);
    }
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  openChangePasswordModal(): void {
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordModalOpen = false;
    this.changePasswordForm.reset();
  }

  onChangePasswordSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const currentMember: Member | null = this.auth.getUser()
    if (currentMember != null && currentMember.password === this.changePasswordForm.get('currentPassword')?.value) {
      currentMember.password = this.changePasswordForm.get('newPassword')?.value
      this.mService.put(currentMember.id, currentMember).subscribe({
        next: (savedMember) => {
          this.auth.updateCurrentUser(savedMember);
          alert('Password changed successfully!');
          this.closeChangePasswordModal();
        },
        error: (err) => {
          alert('Error saving the new password. Please try again.');
          console.error(err);
        }
      })
    }
    else {
      alert('Your current password does not match.');
    }
  }

  openConfirmModal(id: string) {
    this.memberIdToDelete = id
    this.isConfirmModalOpen = true;
  }

  confirmDelete() {
    if (this.memberIdToDelete) {
      this.executeDelete(this.memberIdToDelete);
      this.closeConfirmModel()
    }
  }

  closeConfirmModel() {
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
