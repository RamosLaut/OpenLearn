import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-component.html',
  styleUrls: ['./forgot-password-component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.forgotPasswordForm.get('email')?.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.successMessage = 'A reset code has been sent to your email.';
        this.isSubmitting = false;
        this.router.navigate(['/reset-password'], { queryParams: { email: email } });
      },
      error: (err) => {
        this.errorMessage = 'An error occurred. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }
}