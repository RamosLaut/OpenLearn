import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../services/member-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import Member from '../../models/member';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfile implements OnInit {
  editForm!: FormGroup;
  currentMember!: Member;
  memberId!: string;

  constructor(
    private fb: FormBuilder,
    private mService: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    this.memberId = this.auth.getUser()?.id || '';

    if (this.memberId) {
      this.mService.getById(this.memberId)
        .subscribe({
          next: (memberData) => {
            this.currentMember = memberData; 
            this.editForm = this.fb.group({
              fullName: [this.currentMember.fullName, Validators.required],
              email: [this.currentMember.email, [Validators.required, Validators.email]],
              profilePhotoUrl: [this.currentMember.profilePhotoUrl || '', Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg|gif|svg))')],
              professionalTitle: [this.currentMember.professionalTitle || ''],
              biography: [this.currentMember.biography || ''],
              links: this.fb.group({
                webpage: [this.currentMember.links?.webpage || '', Validators.pattern('https?://.*')],
                linkedin: [this.currentMember.links?.linkedin || '', Validators.pattern('https?://.*')],
                github: [this.currentMember.links?.github || '', Validators.pattern('https?://.*')],
                twitter: [this.currentMember.links?.twitter || '', Validators.pattern('https?://.*')]
              })
            });
          },
          error: (err) => {
            console.error("Error loading profile:", err);
          }
        });
    } else {
      this.router.navigate(['/login']); 
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.memberId) {
      const updatedMemberData: Member = {
        ...this.currentMember,
        ...this.editForm.value
      };

      this.mService.put(this.memberId, updatedMemberData).subscribe({
        next: () => {
          this.auth.updateCurrentUser(updatedMemberData);
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed. Check console for details.');
        }
      });
    }
  }
}